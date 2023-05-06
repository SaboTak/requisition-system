import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequisitionModule } from './requisition/requisition.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [AuthModule, RequisitionModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
