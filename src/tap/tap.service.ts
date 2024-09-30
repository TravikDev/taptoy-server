import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTapDto } from './dto/create-tap.dto';
import { UpdateTapDto } from './dto/update-tap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TapService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  create(createTapDto: CreateTapDto) {
    return 'This action adds a new tap';
  }

  async updateUserSocketId(idTelegram: string, socketId: string) {
    const user = await this.userRepository.findOneBy({ idTelegram })
    return await this.userRepository.save({ ...user, socketId });
  }

  async clickTap(idTelegram: string, socketId: string) {
    console.log(idTelegram)
    const user = await this.userRepository.findOneBy({ idTelegram, socketId })
    console.log(user.coins)
    const coins = user.coins + 1
    if (user.energy <= 0) {
      throw new BadRequestException('Not enough!')
    }
    const energy = user.energy - 1
    console.log(user.coins)
    return await this.userRepository.save({ ...user, coins, energy });
  }

  findAll() {
    return `This action returns all tap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tap`;
  }

  update(id: number, updateTapDto: UpdateTapDto) {
    return `This action updates a #${id} tap`;
  }

  remove(id: number) {
    return `This action removes a #${id} tap`;
  }
}
