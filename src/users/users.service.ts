import { Injectable } from '@nestjs/common';
import { User, UserStatus } from './users.entity'

@Injectable()
export class UsersService {

  private users: User[] = [
    {
      id: 1,
      name: 'jhon',
      username: 'john',
      password: 'changeme',
      department: 'decanatura',
      status:UserStatus.ACTIVE
    },
    {
      id: 2,
      name: 'maria',
      username: 'maria',
      password: 'guess',
      department: 'decanatura',
      status:UserStatus.ACTIVE
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}