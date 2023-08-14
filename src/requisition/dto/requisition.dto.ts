import { IsString,IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { RequisitionDepartmentStatus, RequisitionStatus } from '../requisition.entity'

export class CreateRequisitionDto {
    
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    process: string
    
    @IsNotEmpty()
    @IsString()
    number: number
    
    @IsNotEmpty()
    @IsString()
    reference: string

}


export class UpdateRequisitionDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    image?: string
}

export class UpdateProcessRequisitionDtop{
    @IsString()
    @IsOptional()
    currentProcess?:string

    @IsString()
    @IsOptional()
    currentState?:string
    
    @IsString()
    @IsOptional()
    currentDates?:string

    @IsString()
    @IsOptional()
    status?: RequisitionStatus
}

export class DeclinedRequisitionDto {
    @IsNotEmpty()
    @IsString()
    observation?: string
}

export class AprovedRequisitionDto {
    @IsString()
    @IsOptional()
    observation?: string
}