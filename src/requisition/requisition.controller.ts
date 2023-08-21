import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { CreateRequisitionDto, UpdateRequisitionDto, DeclinedRequisitionDto, AprovedRequisitionDto } from './dto/requisition.dto'
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

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
    getRequisition(@Param('id') id: number, @Request() req) {
        return this.requisitionService.getRequisition(id, req.user.username)
    }

    @Patch('declined/:id')
    declinedRequisition(@Param('id') id: number, @Body() observation: DeclinedRequisitionDto) {
        return this.requisitionService.declinedRequisition(id, observation.observation);
    }

    @Patch('aproved/:id')
    aprovedRequisition(@Param('id') id: number, @Request() req) {
        return this.requisitionService.aprovedRequisition(id, req.observacion);
    }

    @Patch('process/:id')
    changeProcessRequisition(@Param('id') id: number, @Body() observation: AprovedRequisitionDto) {
        return this.requisitionService.changeProcessRequisition(id, observation.observation)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    createRequisition(@Body() newrequisition: CreateRequisitionDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.requisitionService.createRequisition(newrequisition.title, newrequisition.number, newrequisition.reference, newrequisition.description, newrequisition.process, req.user.username, file)
    }

    @Delete(':id')
    deleteRequisition(@Param('id') id: number) {
        return this.requisitionService.deleteRequisition(id)
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    updateRequisition(@Param('id') id: number, @Body() updatedFields: UpdateRequisitionDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.requisitionService.updateRequisition(id, updatedFields.title, updatedFields.description, file, req.user.username)
    }

    @Post('send-mail')
    sendMail() {
        return this.requisitionService.sendMail();
    }

    @Post('send-wp')
    sendWp() {
        return this.requisitionService.sendWp();
    }

    @Post('upload-excel')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return sheetData;
    }

}
