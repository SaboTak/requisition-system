import { Entity , Column, PrimaryGeneratedColumn,CreateDateColumn} from 'typeorm'

export enum LogAccion {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    REDO = 'REDO'
}

@Entity()
export class Log {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    user_id: number

    @Column()
    requisition_id: number

    @Column()
    description : string

    @CreateDateColumn()
    fechaCreacion: Date;

    @Column()
    accion : LogAccion
}
