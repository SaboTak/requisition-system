import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus, RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto } from './dto/requisition.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Like } from "typeorm";
import { ValidateDataRequest } from 'src/dto/global.dto';
import { log } from 'util';


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

    async createRequisition(tittle: string, description: string, image: string, process: string, currentProcess: string, currentState: RequisitionDepartmentStatus): Promise<ValidateDataRequest> {
        try {
            const requisition = {
                tittle,
                description,
                observation: '',
                image,
                process,
                firms: '',
                currentDates: '',
                currentProcess,
                currentState,
                status: RequisitionStatus.INITIATED,
            }
            const newRequisition = this.requisitionRepository.create(requisition);
            const createrequisition = await this.requisitionRepository.save(newRequisition)
            return { message: "Requisicion creada con exito ", data: createrequisition, valid: true }
        } catch (error) {
            return { message: "Error creando Requisicion: " + error, data: null, valid: false }
        }
    }

    async updateRequisition(id: number, updatedFields: UpdateRequisitionDto): Promise<ValidateDataRequest> {

        try {
            const updaterequisition =await this.requisitionRepository.update({ id }, updatedFields)
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

    async changeProcessRequisition(id: number): Promise<ValidateDataRequest> {
        try {
            //Logic for new state of the Requisition
            const requisition = await this.getRequisitionById(id);
            const newProcessStatus = requisition.currentProcess.split(",");
            newProcessStatus.shift();
            const resultNewProcess = newProcessStatus.join(",");

            //Logic record for the changes process
            const fechaActualTexto = this.fechaActual();
            const newRecordDates = requisition.currentDates.split(",");

            if (requisition.currentProcess != "") {
                newRecordDates.push(fechaActualTexto);
            }

            const resultNewDates = newRecordDates.filter((date) => date !== '').join(",");

            // Set new data
            const UpdateRequisition = await this.requisitionRepository.update(id, {
                currentProcess: resultNewProcess,
                currentState: newProcessStatus.length > 0 ? RequisitionDepartmentStatus[newProcessStatus[0]] : requisition.currentState,
                currentDates: resultNewDates,
                status: newProcessStatus.length == 0 ? RequisitionStatus.PENDING : RequisitionStatus.IN_PROGRESS,

            })
            return { message: "Requisicion actualizada con exito", data: UpdateRequisition, valid: true }

        } catch (error) {
            return { message: "Error avanzando en el proceso de Requisiciones: " + error, data: null, valid: false }
        }
    }

    async aprovedRequisition(id: number): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == 'PENDING') {
                const aproverequisition = await this.requisitionRepository.update(id, { status: RequisitionStatus.APPROVED })
                return { message: "Requisicion aprobada con exito ", data: aproverequisition, valid: true }
            }
            return { message: "Error aprobando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Aprobando Requisicion: " + error, data: null, valid: false }
        }
    }

    async declinedRequisition(id: number): Promise<ValidateDataRequest> {
        try {
            const requisition = await this.getRequisitionById(id);
            if (requisition.status == 'PENDING') {
                const aproverequisition = await this.requisitionRepository.update(id, { status: RequisitionStatus.DECLINED })
                return { message: "Requisicion aprobada con exito ", data: aproverequisition, valid: true }
            }
            return { message: "Error aprobando Requisicion ", data: requisition, valid: false }
        } catch (error) {
            return { message: "Error Aprobando Requisicion: " + error, data: null, valid: false }
        }
    }

    async getRequisitionsByUser(username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            const userDepartment: RequisitionDepartmentStatus = RequisitionDepartmentStatus[user.department];
            const getRequisitions = await this.requisitionRepository.find({
                where: {
                    currentState: userDepartment
                }
            })
            
            return { message: "Requisiciones por departamento ", data: getRequisitions, valid: true }

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
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();
        return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year},`;
    }


}
