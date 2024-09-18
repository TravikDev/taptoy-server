import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { UserCard } from 'src/user-cards/entities/user-card.entity';

// type IUser = {
//   idTelegram?: number
//   username?: string
//   level?: number
//   salary?: number
//   rating?: number
//   registartionDate?: number
// }

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserCard)
    private userCardsRepository: Repository<UserCard>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const dateRegistartion = new Date().valueOf().toString()
    const dateOnline = dateRegistartion

    console.log('USER: ', createUserDto.username, createUserDto.idTelegram)

    const user = this.userRepository.create({ ...createUserDto, dateRegistartion, dateOnline });
    return this.userRepository.save(user);
  }

  async tap(_id: number): Promise<User> {

    const currentUser = await this.userRepository.findOneBy({ _id })

    if (currentUser.energy <= 0) {
      throw new BadRequestException('No energy')
    }

    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + 1,
      energy: --currentUser.energy,
    }

    return this.userRepository.save(updatedUser);
  }

  async updateOnline(_id: number): Promise<User> {

    const dateOnline = new Date().valueOf().toString()

    const user = await this.userRepository.findOneBy({ _id })

    const diff = +dateOnline - +user.dateOnline
    const diffHour = diff / 1000 / 60 / 60
    console.log('DIFF - 1 HOUR: ', diffHour)

    const salary = +(diffHour * user.salary).toFixed(0)
    user.coins += salary
    console.log('SALARY - 1 HOUR: ', salary)

    // console.log('SALARY: ', salary)

    return this.userRepository.save({ ...user, dateOnline });
  }

  // async create(createUserDto: CreateUserDto) {

  //   const dateCurrent = new Date().valueOf()

  //   const userNew = {
  //     ...createUserDto,
  //     dateRegistartion: dateCurrent.toString(),
  //   }

  //   return await this.userRepository.save(userNew)
  // }

  async recalculateSalary(_id: number) {
    const user = await this.userRepository.findOneBy({ _id })
    const userCards = await this.userCardsRepository.findBy({ user })

    console.log(userCards)
    
    const salary = userCards.reduce((acc, item) => { console.log(item); return acc + item.salary }, 0)

    return await this.userRepository.save({ ...user, salary })
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: number) {
    return await this.userRepository.findOneBy({ _id });
  }

  async update(_id: number, updateUserDto: UpdateUserDto): Promise<User> {

    // _ Initialization

    const dateUpdated = new Date().valueOf().toString()

    // console.log(_id, updateUserDto)
    // try {
    //   const userCurrent = await this.userRepository.findOneBy({ _id })


    //   // Business Logic

    //   // const userUpdated: User = {
    //   //   // idTelegram: updateUserDto.idTelegram,
    //   //   ...updateUserDto,
    //   //   dateUpdated: dateCurrent,
    //   // }

    //   // const userUpdatedStatus = await this.userRepository.save(userUpdated);

    //   if (userUpdatedStatus.dateUpdated !== dateCurrent) {
    //     throw new BadRequestException('Update failed')
    //   }

    //   // _ Deinitialization
    //   return userUpdatedStatus

    // } catch (err) {
    //   return err
    // }

    return await this.userRepository.save({ ...updateUserDto, dateUpdated });


  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
