import { Module } from '@nestjs/common';
import { TapService } from './tap.service';
import { TapGateway } from './tap.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TapGateway, TapService],
})
export class TapModule { }
