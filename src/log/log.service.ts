import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserStatus } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidateDataRequest } from 'src/dto/global.dto';
import { Log } from './log.entity';
import { In, Repository } from "typeorm";

@Injectable()
export class LogService {

    constructor(private usersService: UsersService, @InjectRepository(Log) private logRepository: Repository<Log>) { }

    async createLog(requisition_id: number, description: string, accion: string, username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const log = {
                    user_id: user.id,
                    requisition_id,
                    description,
                    accion,
                }
                const newRequisition = this.logRepository.create(log);
                const createrequisition = await this.logRepository.save(newRequisition)
                return { message: "Requisicion creada con exito ", data: createrequisition, valid: true }

            } else {
                return { message: "Usuario invalido para crear Requisicion ", data: null, valid: false }
            }

        } catch (error) {
            return { message: "Error creando Logs: " + error, data: null, valid: false }
        }
    }

    async getLogs(): Promise<ValidateDataRequest> {
        try {
            const data = await this.logRepository.find();
            return { message: "Logs ", data: data, valid: true }
        } catch (error) {
            return { message: "Error obteniendo Logs: " + error, data: null, valid: false }
        }
    }

    async getLog(id: number, username: string): Promise<ValidateDataRequest> {
        try {
            const user = await this.usersService.findOne(username);
            if (user.status === UserStatus.ACTIVE) {
                const data = await this.logRepository.findOne({
                    where: {
                        id: id
                    }
                });
                return { message: "Requisicion ", data: data, valid: true }
            } else {
                return { message: "Usuario invalido para ver Logs ", data: null, valid: false }
            }
        } catch (error) {
            return { message: "Error obteniendo Logs: " + error, data: null, valid: false }
        }
    }

}
