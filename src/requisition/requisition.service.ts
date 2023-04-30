import { Injectable } from '@nestjs/common';
import { Requisition, RequisitionStatus } from './requisition.entity'

@Injectable()
export class RequisitionService {


    //Create the firt obj of the requisition array (it is while you connect the db)
    private requisitions: Requisition[] = [{
        id: 1,
        tittle: 'Prueba 1',
        description: 'Prueba body 1',
        image: 'zzz',
        process: '{iniciando}',
        status: RequisitionStatus.PENDING,
    }];

    //Methods for requisitions
    getRequisitions() {
        return this.requisitions
    }

    getRequisition() { }

    createRequisition(id: number,tittle: string,description: string,image: string,process: string) { 
        const requisition = {
            id,
            tittle,
            description,
            image,
            process,
            status: RequisitionStatus.INITIATED,
        }
        this.requisitions.push(requisition);
        return requisition;
    }

    updateRequisition() { }

    deleteRequisition(id: number) { 
        this.requisitions = this.requisitions.filter(requisition => requisition.id !== id)
    }

    changeProcessRequisition() { }

    aprovedRequisition() { }

    declinedRequisition() { }

}
