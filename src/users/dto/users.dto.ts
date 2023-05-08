import { IsString,IsNotEmpty, IsNumber } from 'class-validator'

export class singUpDto {
    
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    department : string

    @IsNotEmpty()
    @IsString()
    firm : string

    @IsNotEmpty()
    @IsString()
    identificacion : string

    @IsNotEmpty()
    @IsString()
    correo : string

}