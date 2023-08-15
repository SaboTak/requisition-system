import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Requisition, RequisitionStatus, RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto } from './dto/requisition.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from "typeorm";
import { ValidateDataRequest } from 'src/dto/global.dto';
import { UserStatus } from 'src/users/users.entity';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Injectable()
export class RequisitionService {

    constructor(private usersService: UsersService, @InjectRepository(Requisition) private requisitionRepository: Repository<Requisition>) { }

    //Principals Methods for requisitions
    async getRequisitions(): Promise<ValidateDataRequest> {
        try {
            const data = await this.requisitionRepository.find();
            return { message: "Requisiciones ", data: data, valid: true }
        } catch (error) {
            return { message: "Error obteniendo Requisiciones: " + error, data: null, valid: false }
        }
    }

    async getRequisition(id: number, username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const data = await this.requisitionRepository.findOne({
                    where: {
                        id: id
                    }
                });
                if (user.department === data.currentState) {
                    return { message: "Requisicion ", data: data, valid: true }
                } else {
                    return { message: "No esta disponible para tu departamento", data: null, valid: false }
                }
            } else {
                return { message: "Usuario invalido para ver requision ", data: null, valid: false }

            }

        } catch (error) {
            return { message: "Error obteniendo Requisicione: " + error, data: null, valid: false }
        }
    }

    async createRequisition(title: string, number: number, reference: number,  description: string, process: string, username: string, file: Express.Multer.File): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const upImage = await this.uploadImageToCloudinary(file);
                if (upImage.valid == true) {
                    const requisition = {
                        title,
                        description,
                        number,
                        reference,
                        observation: '',
                        image: upImage.data.toString(),
                        process,
                        firms: '',
                        currentDates: '',
                        currentProcess: process,
                        currentState: RequisitionDepartmentStatus[user.department],
                        status: RequisitionStatus.INITIATED,
                    }
                    const newRequisition = this.requisitionRepository.create(requisition);
                    const createrequisition = await this.requisitionRepository.save(newRequisition)
                    return { message: "Requisicion creada con exito ", data: createrequisition, valid: true }
                } else {
                    return { message: "Error subiendo Imagen ", data: null, valid: false }
                }
            } else {
                return { message: "Usuario invalido para crear Requisicion ", data: null, valid: false }
            }

        } catch (error) {
            return { message: "Error creando Requisicion: " + error, data: null, valid: false }
        }
    }

    async updateRequisition(id: number, title: string, description: string, file: Express.Multer.File, username: string): Promise<ValidateDataRequest> {

        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const upImage = await this.uploadImageToCloudinary(file);
                if (upImage.valid == true) {
                    const updaterequisition = await this.requisitionRepository.update({ id }, {
                        title: title,
                        description: description,
                        image: upImage.data.toString()
                    })
                    return { message: "Requisicion actualizada con exito", data: updaterequisition, valid: true }
                } else {
                    return { message: "Error subiendo Imagen ", data: null, valid: false }
                }
            } else {
                return { message: "Usuario invalido para editar Requisicion ", data: null, valid: false }
            }

        } catch (error) {
            return { message: "Error actualizando Requisicion: " + error, data: null, valid: false }
        }

    }

    async deleteRequisition(id: number): Promise<ValidateDataRequest> {

        try {
            const detelerequisition = await this.requisitionRepository.update(id, { status: RequisitionStatus.DECLINED });
            return { message: "Requisicion eliminada con exito", data: detelerequisition, valid: true }
        } catch (error) {
            return { message: "Error eliminando Requisicion: " + error, data: null, valid: false }
        }
    }

    async changeProcessRequisition(id: number, username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                //Logic for new state of the Requisition
                const requisition = await this.getRequisitionById(id);
                const newProcessStatus = requisition.currentProcess.split(",");
                const newFirms = requisition.firms.split(",");
                const newRecordDates = requisition.currentDates.split(",");

                newProcessStatus.shift();

                const fechaActualTexto = this.fechaActual();

                if (requisition.currentProcess != "") {
                    newRecordDates.push(fechaActualTexto);
                    newFirms.push(user.firm)
                }
                let resultFirms = newFirms.join(",")
                const resultNewProcess = newProcessStatus.join(",");
                let resultDates = newRecordDates.join(",");

                if (resultDates.endsWith(',')) {
                    resultDates = resultDates.slice(0, -1);
                }
                if (resultDates.startsWith(',')) {
                    resultDates = resultDates.slice(1);
                }

                if (resultFirms.endsWith(',')) {
                    resultFirms = resultFirms.slice(0, -1);
                }
                if (resultFirms.startsWith(',')) {
                    resultFirms = resultFirms.slice(1);
                }

                // Set new data
                const UpdateRequisition = await this.requisitionRepository.update(id, {
                    firms: resultFirms,
                    currentProcess: resultNewProcess,
                    currentState: newProcessStatus.length > 0 ? RequisitionDepartmentStatus[newProcessStatus[0]] : requisition.currentState,
                    currentDates: resultDates,
                    status: newProcessStatus.length == 0 ? RequisitionStatus.PENDING : RequisitionStatus.IN_PROGRESS,
                })
                return { message: "Requisicion actualizada con exito", data: UpdateRequisition, valid: true }
            } else {
                return { message: "Usuario invalido para cambiar estado de requisicion ", data: null, valid: false }
            }
        } catch (error) {
            return { message: "Error avanzando en el proceso de Requisiciones: " + error, data: null, valid: false }
        }
    }

    async aprovedRequisition(id: number, observation: string): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == RequisitionStatus.PENDING || requisition.status == RequisitionStatus.IN_PROGRESS || requisition.status == RequisitionStatus.INITIATED) {
                await this.requisitionRepository.update(id, { status: RequisitionStatus.APPROVED, observation: observation })
                return { message: "Requisicion aprobada con exito ", data: null, valid: true }
            }
            return { message: "Error aprobando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Aprobando Requisicion: " + error, data: null, valid: false }
        }
    }

    async declinedRequisition(id: number, observation: string): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == RequisitionStatus.PENDING || requisition.status == RequisitionStatus.IN_PROGRESS || requisition.status == RequisitionStatus.INITIATED) {
                await this.requisitionRepository.update(id, { status: RequisitionStatus.DECLINED, observation: observation })
                return { message: "Requisicion rechazada con exito ", data: null, valid: true }
            }
            return { message: "Error Rechazando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Rechazando Requisicion: " + error, data: null, valid: false }
        }
    }

    async getRequisitionsByUser(username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const getRequisitions = await this.requisitionRepository.find({
                    where: {
                        currentState: In([user.department]),
                    }
                })
                return { message: "Requisiciones por departamento ", data: getRequisitions, valid: true }
            } else {
                return { message: "Usuario invalido para obtener requisiciones ", data: null, valid: false }
            }

        } catch (error) {
            return { message: "Error obteniendo Requisiciones por Departamento: " + error, data: null, valid: false }
        }
    }

    async getDepartments(username: string) {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const departamentos: string[] = [];

                for (const departamento in RequisitionDepartmentStatus) {
                    departamentos.push(RequisitionDepartmentStatus[departamento]);
                }
                return { message: "Departamentos obtenidos correctamente", data: departamentos, valid: true }

            } else {
                return { message: "Error usuario invalido: ", data: null, valid: false }
            }
        } catch (error) {
            return { message: "Error obteniendo Departamentos: " + error, data: null, valid: false }
        }
    }

    // Methods Aux
    async getRequisitionById(id: number): Promise<Requisition> {
        return await this.requisitionRepository.findOne({
            where: {
                id: id
            }
        })
    }

    fechaActual(): string {
        const newData = new Date();
        return newData.toISOString();
    }

    async uploadImageToCloudinary(file: Express.Multer.File): Promise<ValidateDataRequest> {
        const cloudinary = require('cloudinary').v2;
        const fs = require('fs');
        // Return "https" URLs by setting secure: true
        cloudinary.config({
            secure: true
        });

        // Ruta temporal del archivo cargado
        const imagePath = file.path;
        try {
            // Subir el archivo a Cloudinary
            const datenow = new Date();
            const result = await cloudinary.uploader.upload(imagePath, {
                public_id: "Unilibre-" + datenow,
                folder: "Unilibre"
            });
            // La imagen se ha subido exitosamente a Cloudinary
            const imageUrl = result.secure_url;
            // Elimina la carpeta ./uploads/
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
            return { message: "Imagen subida con exito", data: imageUrl, valid: true }
        } catch (error) {
            return { message: "Departamentos obtenidos correctamente" + error, data: null, valid: false }
        }
    }


}
