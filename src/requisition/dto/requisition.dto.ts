import { IsString,IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { RequisitionDepartmentStatus, RequisitionStatus } from '../requisition.entity'

export class CreateRequisitionDto {
    
    @IsNotEmpty()
    @IsString()
    tittle: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    image: string

    @IsNotEmpty()
    @IsString()
    process: string

    @IsNotEmpty()
    @IsString()
    currentProcess: string

    @IsNotEmpty()
    @IsString()
    currentState: RequisitionDepartmentStatus
}


export class UpdateRequisitionDto {
    @IsString()
    @IsOptional()
    tittle?: string

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