import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  // Login
  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    const isMatch = await this.verifyPass(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Verify the correct login User and Password
  async verifyPass(pass: string, hashedPass: string): Promise<boolean> {
    return bcrypt.compare(pass, hashedPass);
  }

}