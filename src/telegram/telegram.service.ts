import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot('7419941967:AAGWQH1vtImV_1Sl1ritgGVXX0cbUwjUxVI', { polling: true });

    // Ожидание команды /start
    this.bot.onText(/\/start/, (msg) => {
      this.sendStartMessage(msg.chat.id);
    });
  }

  // Функция отправки сообщения с Web App кнопкой (синяя кнопка)
  sendStartMessage(chatId: number) {
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

    this.bot.sendMessage(chatId, 'Нажмите на синюю кнопку для открытия приложения:', options);
  }
}