import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { CreateRequisitionDto, UpdateRequisitionDto } from './dto/requisition.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

@Controller('requisition')
export class RequisitionController {

    constructor(
        private requisitionService: RequisitionService
    ) { }

    @Get()
    getRequisitions() {
        return this.requisitionService.getRequisitions()
    }

    @Get('bydepartment')
    getRequisitionsByUser(@Request() req) {
        return this.requisitionService.getRequisitionsByUser(req.user.username)
    }

    @Get('departments')
    getDepartments(@Request() req) {
        return this.requisitionService.getDepartments(req.user.username)
    }

    @Get(':id')
    getRequisition(@Param('id') id: number,) {
        return this.requisitionService.getRequisition(id)
    }

    @Patch('declined/:id')
    declinedRequisition(@Param('id') id: number, @Param('observacion') observacion: string) {
        return this.requisitionService.declinedRequisition(id, observacion);
    }

    @Patch('aproved/:id')
    aprovedRequisition(@Param('id') id: number, @Param('observacion') observacion: string) {
        return this.requisitionService.aprovedRequisition(id, observacion);
    }

    @Patch('process/:id')
    changeProcessRequisition(@Param('id') id: number, @Request() req) {
        return this.requisitionService.changeProcessRequisition(id, req.user.username)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    createRequisition(@Body() newrequisition: CreateRequisitionDto, @Request() req,@UploadedFile() file: Express.Multer.File) {
        return this.requisitionService.createRequisition(newrequisition.title, newrequisition.description, newrequisition.process, req.user.username,file)
    }

    @Delete(':id')
    deleteRequisition(@Param('id') id: number) {
        return this.requisitionService.deleteRequisition(id)
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    updateRequisition(@Param('id') id: number, @Body() updatedFields: UpdateRequisitionDto,@Request() req,@UploadedFile() file: Express.Multer.File) {
        return this.requisitionService.updateRequisition(id, updatedFields.title,updatedFields.description,file,req.user.username)
    }

}
