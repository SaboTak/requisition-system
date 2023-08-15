import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from 'src/users/users.module';
import { Log } from './log.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Log]),UsersModule],
  controllers: [LogController],
  providers: [LogService]
})
export class LogModule {}
