import { Entity , Column, PrimaryGeneratedColumn} from 'typeorm'

export enum UserStatus {
    ACTIVE = 'ACTIVED',
    DISABLED = 'DISABLED',
    BLOCK = 'BLOCK',
    PROTECTED = 'PROTECTED',
}


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id : number

    @Column()
    name: string

    @Column({unique:true})
    username : string

    @Column()
    password : string

    @Column()
    department : string

    @Column()
    firm : string

    @Column({unique:true})
    identificacion : string

    @Column({unique:true})
    correo : string

    @Column()
    status : UserStatus
}
