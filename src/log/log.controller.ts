import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogsDto } from './dto/log.dto';

@Controller('log')
export class LogController {
    constructor(
        private logService: LogService
    ) { }

    @Post()
    createLog(@Body() newlog: CreateLogsDto, @Request() req) {
        console.log('aaaaaaaaaaaaaaaa');
        return this.logService.createLog(newlog.requisition_id, newlog.description, newlog.accion, req.user.username)
    }

    @Get()
    getRequisitions() {
        return this.logService.getLogs()
    }

    @Get(':id')
    getRequisition(@Param('id') id: number, @Request() req) {
        return this.logService.getLog(id, req.user.username)
    }
}

