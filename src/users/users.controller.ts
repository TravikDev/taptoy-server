import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('update/:idRefTelegram?')
  create(@Body() createUserDto: CreateUserDto, @Param('idRefTelegram') idRefTelegram: string,) {

    console.log('BODY + PARAM: ', createUserDto, idRefTelegram)

    if (idRefTelegram) {
      console.log('with ref')
      return this.usersService.createOrUpdate(createUserDto, idRefTelegram);
    }
    console.log('no ref')
    return this.usersService.createOrUpdate(createUserDto);

  }

  

  @Post('tap/:id')
  tap(@Param('id') id: number) {
    return this.usersService.tap(id);
  }

  @Get('getMyRefUsers/:idTelegram')
  updateUsers(@Param('idTelegram') idTelegram: string) {
    return this.usersService.getMyRefUsers(idTelegram);
  }

  // @Post('update/:idTelegram')
  // updateOnline(@Param('idTelegram') idTelegram: string) {
  //   return this.usersService.createOrUpdate(idTelegram);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }


  @Get('telegram/:id')
  findOneByTelegramId(@Param('id') idTelegram: string) {
    return this.usersService.findOneByTelegramId(idTelegram);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }



  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
