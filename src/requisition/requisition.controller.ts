import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { CreateRequisitionDto, UpdateRequisitionDto } from './dto/requisition.dto'

@Controller('requisition')
export class RequisitionController {

    constructor(
        private requisitionService : RequisitionService
    ){}

    @Get()
    getRequisitions(){
        return this.requisitionService.getRequisitions()
    }

    @Post()
    createRequisition(@Body() newrequisition: CreateRequisitionDto){
        return this.requisitionService.createRequisition(newrequisition.id, newrequisition.tittle, newrequisition.description, newrequisition.image, newrequisition.process)
    }

    @Delete(':id')
    deleteRequisition(@Param('id') id: number){
        return this.requisitionService.deleteRequisition(id)
    }

    @Patch(':id')
    updateRequisition(@Param('id') id: number, @Body() updatedFields: UpdateRequisitionDto){
        return this.requisitionService.updateRequisition(id, updatedFields)
    }


}
