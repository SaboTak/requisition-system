import { Module } from '@nestjs/common';
import { RequisitionController } from './requisition.controller';
import { RequisitionService } from './requisition.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Requisition } from './requisition.entity';
import { EmailModule } from '../modules/nodemailer/nodemailer.module'
import { TwilioModule } from '../modules/twilio/twilio.module'
// import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Requisition]), UsersModule, EmailModule, TwilioModule],
  controllers: [RequisitionController],
  providers: [RequisitionService],
})
export class RequisitionModule { }
