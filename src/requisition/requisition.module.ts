import { Module } from '@nestjs/common';
import { RequisitionController } from './requisition.controller';
import { RequisitionService } from './requisition.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Requisition } from './requisition.entity';
// import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports:[TypeOrmModule.forFeature([Requisition]),UsersModule],
  controllers: [RequisitionController],
  providers: [RequisitionService],
})
export class RequisitionModule {}
