import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ValidateDataRequest } from 'src/dto/global.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  // Login
  async signIn(username: string, pass: string): Promise<ValidateDataRequest> {
    try {
      const user = await this.usersService.findOne(username);
      if (user) {
        const isMatch = await this.verifyPass(pass, user.password);

        if (!isMatch) {
          throw new UnauthorizedException();
        }

        const payload = { username: user.username, sub: user.id };
        const access_token= await this.jwtService.signAsync(payload);
        
        return {
          message: "Usuario encontrado", data: access_token, valid: true
        };
      } else {
        return { message: "Usuario no encontrado", data: null, valid: false };
      }

    } catch (error) {
      return {message: "Error encontrando usuario: " + error, data: null, valid:false}
    }
  }

  // Verify the correct login User and Password
  async verifyPass(pass: string, hashedPass: string): Promise<boolean> {
    return bcrypt.compare(pass, hashedPass);
  }

}