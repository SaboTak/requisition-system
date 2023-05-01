import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus,RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto } from './dto/requisition.dto';

@Injectable()
export class RequisitionService {


    //Create the firt obj of the requisition array (it is while you connect the db)
    private requisitions: Requisition[] = [{
        id: 1,
        tittle: 'Prueba 1',
        description: 'Prueba body 1',
        image: 'zzz',
        process: '{iniciando}',
        currentProcess: '{prueba}',
        currentState: RequisitionDepartmentStatus.DECANATURA,
        status: RequisitionStatus.PENDING,
    }];

    //Principals Methods for requisitions
    getRequisitions() :Requisition[] {
        return this.requisitions
    }

    createRequisition(id: number,tittle: string,description: string,image: string,process: string, currentProcess: string , currentState: RequisitionDepartmentStatus): Requisition { 
        const requisition = {
            id,
            tittle,
            description,
            image,
            process,
            currentProcess,
            currentState,
            status: RequisitionStatus.INITIATED,
        }
        this.requisitions.push(requisition);
        return requisition;
    }

    updateRequisition(id: number, updatedFields: UpdateRequisitionDto) : Requisition { 
        const requisition = this.getRequisitionById(id);
        const newrequisition =  Object.assign(requisition,updatedFields);
        this.requisitions =  this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    deleteRequisition(id: number): Requisition[] { 
        this.requisitions = this.requisitions.filter(requisition => requisition.id !== id);
        return this.requisitions;
    }

    changeProcessRequisition() {}

    aprovedRequisition(id:number) : Requisition {
        const requisition = this.getRequisitionById(id);
        const newrequisition =  Object.assign(requisition,{ status: RequisitionStatus.APPROVED });
        this.requisitions =  this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    declinedRequisition(id: number) : Requisition {
        const requisition = this.getRequisitionById(id);
        const newrequisition =  Object.assign(requisition,{ status: RequisitionStatus.DECLINED });
        this.requisitions =  this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    // Methods Aux
    getRequisitionById(id: number): Requisition {
        return this.requisitions.find(requisition => requisition.id == id)
    }


}
