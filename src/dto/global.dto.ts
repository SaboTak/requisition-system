import { IsString,IsNotEmpty, IsBoolean } from 'class-validator'


export class ValidateDataRequest{
    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    data: unknown

    @IsNotEmpty()
    @IsBoolean()
    valid: boolean

}