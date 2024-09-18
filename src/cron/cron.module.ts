import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  providers: [CronService],
})
export class CronModule { }
