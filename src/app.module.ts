import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequisitionModule } from './requisition/requisition.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'
// import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port:parseInt(process.env.DB_PORT),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    dropSchema:false,
    synchronize : false,
    ssl: {
      rejectUnauthorized: false,
    }
  }),AuthModule, RequisitionModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
