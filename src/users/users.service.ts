import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { singUpDto } from "./dto/users.dto";
import { Repository } from "typeorm";

import * as bcrypt from 'bcrypt';
import { ValidateDataRequest } from 'src/dto/global.dto';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

  async findOne(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: username
      }
    });
  }

  async createUser(name: string, username: string, password: string, department: string, firm: string, identificacion: string, correo: string): Promise<ValidateDataRequest> {
    try {

      const HashPassword = await this.verifyPass(password);

      const user = {
        name,
        username,
        password: HashPassword,
        department,
        firm,
        identificacion,
        correo,
        status: UserStatus.ACTIVE,
      };
      const newUser = this.userRepository.create(user);
      const createuserSuccs =await  this.userRepository.save(newUser)
      return { message: "Usuario creado con exito ", data: createuserSuccs, valid: true }
    } catch (error) {
      return { message: "Error creando Usuario: " + error, data: null, valid: false }
    }
  }

  // Aux Method
  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }

  //Hash Pass
  async verifyPass(pass): Promise<string> {
    const SALT = parseInt(process.env.SALTHASH);
    const hash = bcrypt.hash(pass, SALT);
    return hash;
  }

}