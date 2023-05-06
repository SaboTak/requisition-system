import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './users.entity'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  private users: User[] = [
    {
      id: 1,
      name: 'jhon',
      username: 'john',
      password: '$2b$10$.RZYmoEz3HLC42.tfG544.9TUXt3WskJyE7nm/c5UcCW3TEsCpu3y',
      department: 'DECANATURA',
      firm : '',
      status:UserStatus.ACTIVE
    },
    {
      id: 2,
      name: 'maria',
      username: 'maria',
      password: 'guess',
      department: 'DECANATURA',
      firm: '',
      status:UserStatus.ACTIVE
    },
  ];

  async findOne(username: string): Promise<User> {
    return this.users.find(user => user.username === username);
  }

  async createUser(id : number,name: string,username : string,password : string,department : string,firm : string): Promise<User>{
    
    const HashPassword = await this.verifyPass(password);

    const user = {
      id,
      name,
      username,
      password: HashPassword,
      department,
      firm,
      status: UserStatus.ACTIVE,
  }
  this.users.push(user);
  return user;
  }

  //Hash Pass
  async verifyPass(pass): Promise<string> {
    const SALT = parseInt(process.env.SALTHASH);    
    const hash =  bcrypt.hash(pass, SALT);
    return hash;
  }

}