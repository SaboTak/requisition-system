import { IsString,IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
export class CreateRequisitionDto {
    @IsNotEmpty()
    @IsNumber()
    id: number
    
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

    @IsString()
    @IsOptional()
    process?: string
}