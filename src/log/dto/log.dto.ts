import { IsString,IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { LogAccion  } from '../log.entity'

export class CreateLogsDto {
    
    @IsNotEmpty()
    @IsString()
    requisition_id: number

    @IsNotEmpty()
    @IsString()
    description: string
    
    @IsNotEmpty()
    @IsString()
    accion: string

}