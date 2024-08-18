import { Injectable } from '@nestjs/common';
import { CreateTapDto } from './dto/create-tap.dto';
import { UpdateTapDto } from './dto/update-tap.dto';

@Injectable()
export class TapsService {
  create(createTapDto: CreateTapDto) {
    return 'This action adds a new tap';
  }

  findAll() {
    return `This action returns all taps`;
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
