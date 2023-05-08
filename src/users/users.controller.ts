import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { singUpDto } from './dto/users.dto'
import { UsersService } from './users.service';
import { Public } from 'src/auth/auth.decorator';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('Register')
    signIn(@Body() singUpDto: singUpDto) {
        return this.usersService.createUser( singUpDto.name, singUpDto.username,singUpDto.password,singUpDto.department,singUpDto.firm, singUpDto.identificacion, singUpDto.correo);
    }


}
