import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './users.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { singUpDto } from "./dto/users.dto";
import { Repository } from "typeorm";

import * as bcrypt from 'bcrypt';
import { ValidateDataRequest } from 'src/dto/global.dto';

@Injectable()
export class UsersService {

  constructor( @InjectRepository(User) private userRepository: Repository<User>) { }

  async findOne(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username: username
      }
    });
  }

  async createUser(name: string, username: string, password: string, department: string, firm: string, identificacion: string, correo: string, file: Express.Multer.File): Promise<ValidateDataRequest> {
    try {

      const HashPassword = await this.verifyPass(password);

      const upImage = await this.uploadImageToCloudinary(file);
      
      if (upImage.valid == true) {
        const user = {
          name,
          username,
          image: upImage.data.toString(),
          password: HashPassword,
          department,
          firm,
          identificacion,
          correo,
          status: UserStatus.ACTIVE,
        };
        const newUser = this.userRepository.create(user);
        const createuserSuccs = await this.userRepository.save(newUser)
        return { message: "Usuario creado con exito ", data: createuserSuccs, valid: true }
      } else {
        return { message: "Error subiendo Imagen ", data: null, valid: false }
      }
    } catch (error) {
      return { message: "Error creando Usuario: " + error, data: null, valid: false }
    }
  }

  async getUser(username: string) {
    try {
      const user = await this.findOne(username);
      if (user.status === UserStatus.ACTIVE) {
        const dataUser = {
          username: user.username,
          name: user.name,
          department: user.department,
          firm: user.firm,
          identificacion: user.identificacion,
          correo: user.correo
        }
        return { message: "Usuario encontrado con exito ", data: dataUser, valid: true }
      } else {
        return { message: "Error usuario invalido: ", data: null, valid: false }
      }
    } catch (error) {
      return { message: "Error obteniendo Usuario: " + error, data: null, valid: false }
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

  async uploadImageToCloudinary(file: Express.Multer.File): Promise<ValidateDataRequest> {
    const cloudinary = require('cloudinary').v2;
    const fs = require('fs');
    // Return "https" URLs by setting secure: true
    cloudinary.config({
        secure: true
    });
    
    // Ruta temporal del archivo cargado
    const imagePath = file.path;
    try {
        // Subir el archivo a Cloudinary
        const datenow = new Date();
        const result = await cloudinary.uploader.upload(imagePath, {
            public_id: "Unilibre-" + datenow,
            folder: "Unilibre"
        });
        // La imagen se ha subido exitosamente a Cloudinary
        const imageUrl = result.secure_url;
        // Elimina la carpeta ./uploads/
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        return { message: "Imagen subida con exito", data: imageUrl, valid: true }
    } catch (error) {
        return { message: "Error con Cloudinary" + error, data: null, valid: false }
    }
}

}