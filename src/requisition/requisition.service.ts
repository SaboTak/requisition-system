import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus, RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto , CreateRequisitionDto, UpdateProcessRequisitionDtop} from './dto/requisition.dto';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository , In} from "typeorm";


@Injectable()
export class RequisitionService {

    constructor(private usersService:UsersService,@InjectRepository(Requisition) private requisitionRepository: Repository<Requisition>){}


    //Create the firt obj of the requisition array (it is while you connect the db)
    private requisitions: Requisition[] = [{
        id: 1,
        tittle: 'Prueba 1',
        description: 'Prueba body 1',
        observation: '',
        image: 'zzz',
        process: 'DECANATURA,CONTABLE,RECTORIA',
        firms: '',
        currentDates: '',
        currentProcess: 'DECANATURA,CONTABLE,RECTORIA',
        currentState: RequisitionDepartmentStatus.DECANATURA,
        status: RequisitionStatus.INITIATED,
    }];

    //Principals Methods for requisitions
    async getRequisitions(): Promise<Requisition[]> {
        return  await this.requisitionRepository.find();
    }

    async createRequisition(tittle: string, description: string, image: string, process: string, currentProcess: string, currentState: RequisitionDepartmentStatus): Promise<CreateRequisitionDto> {
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
        this.requisitionRepository.save(newRequisition)
        return newRequisition;
    }

    updateRequisition(id: number, updatedFields: UpdateRequisitionDto) {
        return this.requisitionRepository.update({id},updatedFields)
    }

    async deleteRequisition(id: number) {
        return await this.requisitionRepository.delete({id})
    }

    async changeProcessRequisition(id: number) {
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
        return await this.requisitionRepository.update(id,{
            currentProcess: resultNewProcess,
            currentState: newProcessStatus.length > 0 ? RequisitionDepartmentStatus[newProcessStatus[0]] : requisition.currentState,
            currentDates: resultNewDates,
            status : newProcessStatus.length == 0 ? RequisitionStatus.PENDING : RequisitionStatus.IN_PROGRESS,

        } )
    }
    
    async aprovedRequisition(id: number) {
        const requisition = await this.getRequisitionById(id);
        if(requisition.status == 'PENDING'){
            return await this.requisitionRepository.update(id,{status : RequisitionStatus.APPROVED})
        }
        return "No esta pendiente de decision.";
        
    }

    async declinedRequisition(id: number) {
        const requisition = await this.getRequisitionById(id);
        if(requisition.status == 'PENDING'){
            return await this.requisitionRepository.update(id,{status : RequisitionStatus.DECLINED})
        }
        return "No esta pendiente de decision.";
    }

    async getRequisitionsByUser(id: number): Promise<Requisition[] | undefined>{
        const user = await this.usersService.findOneById(id);
        return  this.requisitionRepository.find({
            where:{
                currentState: In([user.department])
            }
        })
    }

    // Methods Aux
    async getRequisitionById(id: number): Promise<Requisition> {
        return await this.requisitionRepository.findOne({
            where:{
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
