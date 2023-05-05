import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus, RequisitionDepartmentStatus } from './requisition.entity'
import { UpdateRequisitionDto } from './dto/requisition.dto';

@Injectable()
export class RequisitionService {


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
    getRequisitions(): Requisition[] {
        return this.requisitions
    }

    createRequisition(id: number, tittle: string, description: string, image: string, process: string, currentProcess: string, currentState: RequisitionDepartmentStatus): Requisition {
        const requisition = {
            id,
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
        this.requisitions.push(requisition);
        return requisition;
    }

    updateRequisition(id: number, updatedFields: UpdateRequisitionDto): Requisition {
        const requisition = this.getRequisitionById(id);
        const newrequisition = Object.assign(requisition, updatedFields);
        this.requisitions = this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    deleteRequisition(id: number): Requisition[] {
        this.requisitions = this.requisitions.filter(requisition => requisition.id !== id);
        return this.requisitions;
    }

    changeProcessRequisition(id: number): Requisition {
        //Logic for new state of the Requisition
        const requisition = this.getRequisitionById(id);
        const newProcessStatus = requisition.currentProcess.split(",");
        newProcessStatus.shift();
        const resultNewProcess = newProcessStatus.join(",");

        //Logic record for the changes process
        const fechaActualTexto = this.fechaActual();
        const newRecordDates = requisition.currentDates.split(",");

        if(newProcessStatus.length >0){
            newRecordDates.push(fechaActualTexto);
        }

        const resultNewDates = newRecordDates.join(",");

        // Set new data
        const newrequisition = Object.assign(requisition,
            {
                "currentProcess": resultNewProcess,
                "currentState": newProcessStatus.length > 0 ? newProcessStatus[0]  : requisition.currentState,
                "currentDates": resultNewDates,
                "status": newProcessStatus.length == 0 ? "PENDING"  : "IN_PROGRESS", 
            });
        return newrequisition;
    }

    aprovedRequisition(id: number): Requisition {
        const requisition = this.getRequisitionById(id);
        const newrequisition = Object.assign(requisition, { status: RequisitionStatus.APPROVED });
        this.requisitions = this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    declinedRequisition(id: number): Requisition {
        const requisition = this.getRequisitionById(id);
        const newrequisition = Object.assign(requisition, { status: RequisitionStatus.DECLINED });
        this.requisitions = this.requisitions.map(requisition => requisition.id === id ? newrequisition : requisition);
        return newrequisition;
    }

    // Methods Aux
    getRequisitionById(id: number): Requisition {
        return this.requisitions.find(requisition => requisition.id == id)
    }

    fechaActual(): string {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();        
        return `${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}/${year},`;
    }


}
