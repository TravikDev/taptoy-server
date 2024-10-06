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
    this.bot = new TelegramBot('7513402778:AAF_BPgTuuWeo25gJ8xDiwrVKElkune5l0I', { polling: true });

    // Ожидание команды /start
    this.bot.onText(/\/start/, async (msg) => {

      const chatId = (msg.chat.id).toString();

      console.log(chatId)

      const userExist = await userService.findOneByTelegramId(chatId)

      console.log(userExist)

      if (userExist) {
        this.sendStartMessage(chatId, 'Вы вернулись!');
      } else {
        // const result = userService.create({ idTelegram: chatId, username: 'Guest', avatar: 'google.com' })
        this.sendStartMessage(chatId, 'Добро пожаловать!');
      }

    });

    // // Ожидание команды /start
    // this.bot.onText(/\/start/, async (msg) => {

    //   const chatId = (msg.chat.id).toString();

    //   console.log(chatId)

    //   const userExist = await userService.findOneByTelegramId(chatId)

    //   console.log(userExist)

    //   if (userExist) {
    //     this.sendStartMessage(chatId, 'Вы вернулись!');
    //   } else {
    //     // const result = userService.updateOrCreate({ idTelegram: chatId, username: 'Guest', avatar: 'google.com' })
    //     this.sendStartMessage(chatId, 'Добро пожаловать!');
    //   }

    // });

    this.bot.on('message', async (msg: any) => {
      if (msg.web_app_data) {
        const webAppData = msg.web_app_data.data; // Получаем данные от Web App
        const referralId = webAppData.referral_id;

        if (referralId) {
          this.bot.sendMessage(msg.chat.id, `Вы пришли по реферальной ссылке с ID ${referralId}`);
        } else {
          this.bot.sendMessage(msg.chat.id, 'Запуск Web App без реферальной ссылки');
        }
      }
    });

  }


  // \n Если вас кто-то пригласил, пожалуйста, введите его telegram ID

  // Функция отправки сообщения с Web App кнопкой (синяя кнопка)
  sendStartMessage(chatId: string, msg = '') {

    console.log('ID!: ', chatId)

    const webAppUrl = `https://paradoxlive.pro`; // URL вашего Web App

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
        // keyboard: [
        //   [{ text: 'Меня пригласили' }], // Two buttons side by side
        // ],
        resize_keyboard: true, // Automatically resize the keyboard
        one_time_keyboard: true, // Keyboard disappears after one use
      },
    };

    console.log('id: ', chatId)

    !msg
      ? this.bot.sendMessage(chatId, msg, options)
      : this.bot.sendMessage(chatId, msg, options)
  }
}