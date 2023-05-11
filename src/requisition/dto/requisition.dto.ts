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