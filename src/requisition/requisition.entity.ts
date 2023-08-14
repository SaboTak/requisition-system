import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

export enum RequisitionStatus {
    INITIATED = 'INITIATED',
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED'
}

export enum RequisitionDepartmentStatus {
    // DEVELOPER = "DEVELOPER",
    SINDICATURA = 'SINDICATURA',
    PRESIDENCIA = 'PRESIDENCIA',
    COMPRA = 'COMPRA',
    DECANATURA = 'DECANATURA',
    RECURSO_HUMANOS = 'RECURSO_HUMANOS',
}

@Entity()
export class Requisition {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    observation: string

    @Column()
    image: string

    @Column()
    process: string

    @Column()
    firms: string

    @Column()
    currentDates: string

    @Column()
    currentProcess: string

    @Column()
    currentState: RequisitionDepartmentStatus

    @Column()
    reference: number

    @CreateDateColumn()
    number: number

    @CreateDateColumn()
    status: RequisitionStatus

    @CreateDateColumn()
    fechaCreacion: Date;

}
