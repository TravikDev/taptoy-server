import { Controller, Get, Query } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('telegram')
  async telegramAuth(@Query() query: any) {
    // Здесь вы получите данные от Telegram
    const { id, first_name, username, hash } = query;

    // Можно добавить проверку хэша для безопасности
    console.log('Telegram User ID:', id);

    // Обрабатываем данные (сохраняем пользователя в базе данных, создаём сессию и т.д.)
    return { message: 'User authenticated', userId: id };
  }
}
