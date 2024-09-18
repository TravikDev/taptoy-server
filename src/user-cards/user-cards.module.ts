import { Module } from '@nestjs/common';
import { UserCardsService } from './user-cards.service';
import { UserCardsController } from './user-cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCard } from './entities/user-card.entity';
import { Card } from 'src/cards/entities/card.entity';
import User from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Card, UserCard]), UsersModule],
  controllers: [UserCardsController],
  providers: [UserCardsService],
  exports: [UserCardsService]
})
export class UserCardsModule { }
