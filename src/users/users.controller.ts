import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { singUpDto } from './dto/users.dto'
import { UsersService } from './users.service';
import { Public } from 'src/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('Register')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    signIn(@Body() singUpDto: singUpDto,@UploadedFile() file: Express.Multer.File) {
        return this.usersService.createUser( singUpDto.name, singUpDto.username,singUpDto.password,singUpDto.department,singUpDto.firm, singUpDto.identificacion, singUpDto.correo,file);
    }

    @Get('profile')
    getUser(@Request() req){        
        return this.usersService.getUser(req.user.username)
    }


}
