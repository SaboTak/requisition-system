
export enum RequisitionStatus {
    INITIATED = 'INITIATED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED'
}


export class Requisition {
    id : number
    tittle : string
    description : string
    image : string
    process : string
    status : RequisitionStatus

}
