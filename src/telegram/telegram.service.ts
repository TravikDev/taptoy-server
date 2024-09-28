import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { UsersService } from 'src/users/users.service';
// import User from 'src/users/entities/user.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    private readonly userService: UsersService
    // @InjectRepository(User)
    // private readonly userService: Repository<User>
  ) {
    this.bot = new TelegramBot('7419941967:AAGWQH1vtImV_1Sl1ritgGVXX0cbUwjUxVI', { polling: true });

    // Ожидание команды /start
    this.bot.onText(/\/start/, (msg) => {

      const chatId = msg.chat.id;

      const result = userService.create({ idTelegram: chatId, username: 'Guest', avatar: 'google.com' })

      if (result) {
        this.sendStartMessage(chatId, 'Привет!');        
      } else {
        this.sendStartMessage(chatId, 'Пользователь уже зарегестрирован!');
      }

    });
  }

  // Функция отправки сообщения с Web App кнопкой (синяя кнопка)
  sendStartMessage(chatId: number, msg = '') {
    const webAppUrl = 'https://paradoxlive.pro'; // URL вашего Web App

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Open Web App',
              web_app: { url: webAppUrl }, // Web App синяя кнопка
            },
          ],
        ],
      },
    };

    !msg 
      ? this.bot.sendMessage(chatId, msg, options)
      : this.bot.sendMessage(chatId, msg, options) 
  }
}