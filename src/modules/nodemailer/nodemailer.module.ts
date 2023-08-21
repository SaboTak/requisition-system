import { Module } from '@nestjs/common';
import { EmailService } from './nodemailer.service';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}