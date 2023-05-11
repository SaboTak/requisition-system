import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/auth.dto'
import { Public } from './auth.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: signInDto) {
    try {
      return this.authService.signIn(signInDto.username, signInDto.password);
    } catch (error) {
      return "Error: " + error
    }
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('verifyAdm')
  verifyAdm(@Request() req) {
    return this.authService.verifyAdm(req.user.username)
  }



}