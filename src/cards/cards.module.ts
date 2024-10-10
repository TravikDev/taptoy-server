import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UsersModule } from 'src/users/users.module';
import { UserCardsModule } from 'src/user-cards/user-cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    UsersModule,
    UserCardsModule
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule { }
