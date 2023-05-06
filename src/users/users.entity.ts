
export enum UserStatus {
    ACTIVE = 'ACTIVED',
    DISABLED = 'DISABLED',
    BLOCK = 'BLOCK',
    PROTECTED = 'PROTECTED',
}



export class User {
    id : number
    name: string
    username : string
    password : string
    department : string
    firm : string
    status : UserStatus
}
