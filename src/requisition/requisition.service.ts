import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus, RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto } from './dto/requisition.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Like } from "typeorm";
import { ValidateDataRequest } from 'src/dto/global.dto';
import { log } from 'util';
import { UserStatus } from 'src/users/users.entity';


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

    async getRequisition(id: number): Promise<ValidateDataRequest> {
        try {
            const data = await this.requisitionRepository.findOne({
                where: {
                    id: id
                }
            });
            return { message: "Requisicion ", data: data, valid: true }
        } catch (error) {
            return { message: "Error obteniendo Requisicione: " + error, data: null, valid: false }
        }
    }

    async createRequisition(title: string, description: string, image: string, process: string, username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const requisition = {
                    title,
                    description,
                    observation: '',
                    image,
                    process,
                    firms: '',
                    currentDates: '',
                    currentProcess: process,
                    currentState : RequisitionDepartmentStatus[user.department],
                    status: RequisitionStatus.INITIATED,
                }
                const newRequisition = this.requisitionRepository.create(requisition);
                const createrequisition = await this.requisitionRepository.save(newRequisition)
                return { message: "Requisicion creada con exito ", data: createrequisition, valid: true }
            } else {
                return { message: "Usuario invalido para crear Requisicion ", data: null, valid: false }
            }

        } catch (error) {
            return { message: "Error creando Requisicion: " + error, data: null, valid: false }
        }
    }

    async updateRequisition(id: number, updatedFields: UpdateRequisitionDto): Promise<ValidateDataRequest> {

        try {
            const updaterequisition = await this.requisitionRepository.update({ id }, updatedFields)
            return { message: "Requisicion actualizada con exito", data: updaterequisition, valid: true }
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

    async aprovedRequisition(id: number,observacion: string): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == RequisitionStatus.PENDING || requisition.status == RequisitionStatus.IN_PROGRESS || requisition.status == RequisitionStatus.INITIATED) {
                const aproverequisition = await this.requisitionRepository.update(id, { status: RequisitionStatus.APPROVED, observation: observacion })
                return { message: "Requisicion aprobada con exito ", data: null, valid: true }
            }
            return { message: "Error aprobando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Aprobando Requisicion: " + error, data: null, valid: false }
        }
    }

    async declinedRequisition(id: number,observacion: string): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == RequisitionStatus.PENDING || requisition.status == RequisitionStatus.IN_PROGRESS || requisition.status == RequisitionStatus.INITIATED) {
                const aproverequisition = await this.requisitionRepository.update(id, { status: RequisitionStatus.DECLINED, observation: observacion })
                return { message: "Requisicion aprobada con exito ", data: null, valid: true }
            }
            return { message: "Error aprobando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Aprobando Requisicion: " + error, data: null, valid: false }
        }
    }

    async getRequisitionsByUser(username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const userDepartment: RequisitionDepartmentStatus = RequisitionDepartmentStatus[user.department];
                const getRequisitions = await this.requisitionRepository.find({
                    where: {
                        currentState: userDepartment
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

}
