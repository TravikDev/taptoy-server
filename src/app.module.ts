import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { CardsModule } from './cards/cards.module';
import { QuestsModule } from './quests/quests.module';
import { TeamsModule } from './teams/teams.module';
import { UserCardsModule } from './user-cards/user-cards.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { TapModule } from './tap/tap.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      })
    }),
    DatabaseModule,
    CardsModule,
    QuestsModule,
    TeamsModule,
    UserCardsModule,
    ScheduleModule.forRoot(),
    CronModule,
    TapModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }