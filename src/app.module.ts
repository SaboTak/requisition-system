import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequisitionModule } from './requisition/requisition.module';


@Module({
  imports: [AuthModule, RequisitionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
