
export enum RequisitionStatus {
    INITIATED = 'INITIATED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED'
}

export enum RequisitionDepartmentStatus{
    DECANATURA = 'DECANATURA',
    CONTABLE = 'CONTABLE',
    REACTORIA = 'RECTORIA',
    QA = 'QA'
}


export class Requisition {
    id : number
    tittle : string
    description : string
    image : string
    process : string
    currentProcess : string
    currentState : RequisitionDepartmentStatus
    status : RequisitionStatus

}
