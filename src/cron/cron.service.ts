import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  private readonly logger = new Logger(CronService.name);

  @Cron('0 0 12,0 * * *')
  // @Cron('0 23,0 * * * *')
  async handleCron() {

    const users = await this.userRepository.find()
    const updatedUsers = users.map(user => ({ ...user, energy: 100 }))

    await this.userRepository.save(updatedUsers)

    console.log('Called')
    this.logger.debug('Called');
  }

}
