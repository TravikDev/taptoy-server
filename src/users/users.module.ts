import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';
import { UserCard } from 'src/user-cards/entities/user-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserCard])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
