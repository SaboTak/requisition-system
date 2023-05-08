import { Module } from '@nestjs/common';
import { RequisitionController } from './requisition.controller';
import { RequisitionService } from './requisition.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[UsersModule],
  controllers: [RequisitionController],
  providers: [RequisitionService],
})
export class RequisitionModule {}
