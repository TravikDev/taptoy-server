import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-userNew.dto';
// import { UpdateUserDto } from './dto/update-userNew.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { UserCard } from 'src/user-cards/entities/user-card.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import User, { IRefUser } from './entities/userNew.entity';
// import { UserCard } from 'src/userNew-cards/entities/userNew-card.entity';

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

  async createOrUpdate(createUserDto: CreateUserDto, idTelegramRef = ""): Promise<User> {

    const dateRegistartion = new Date().valueOf().toString()
    const dateOnline = dateRegistartion

    console.log('USER: ', createUserDto.username, createUserDto.idTelegram)

    
    const userExist = await this.userRepository.findOneBy({ idTelegram: createUserDto.idTelegram })
    
    console.log('userExist', userExist)

    const userNew = this.userRepository.create({ ...createUserDto, dateRegistartion, dateOnline });

    console.log('userNew', userNew)

    // ------------------------- IF USER DOESN'T EXIST

    if (!userExist) {

      // ---------------------- REF SIDE

      if (idTelegramRef && idTelegramRef !== "") {

        const userRefExist = await this.userRepository.findOne({ where: { idTelegram: idTelegramRef } })
        console.log('userRefExist', userRefExist)

        // -------------------- IF REF IS GOOD
        if (userRefExist) {

          if (!userRefExist.referralUsers) {
            userRefExist.referralUsers = []; // Инициализируем как пустой массив, если он undefined
          }

          console.log('userRefExist', userRefExist, userNew)
          userRefExist.referralUsers.push(userNew.idTelegram)
          console.log('userRefExist PUSH')
          // userNew.referralUser = userRefExist
          console.log('userRefExist SETUP')
          userRefExist.coins += 1000
          console.log('userRefExist +1000')
          await this.userRepository.save(userRefExist);

          console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram}) with Ref idTelegram: ${userRefExist.idTelegram}`)
          return await this.userRepository.save(userNew);

          // -------------------- IF REF IS BAD
        } else {

          console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram})`)
          return await this.userRepository.save(userNew);
        }

        // -------------------- NO REF
      } else {

        // const userNew = this.userRepository.create({ ...createUserDto, dateRegistartion, dateOnline });
        console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram})`)
        return await this.userRepository.save(userNew);

      }

    } else {
      console.log(`Update User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram})`)
      return await this.updateOnline(userExist._id)
    }

  }


  async updateOnline(_id: number): Promise<User> {

    // Update Online

    const dateOnline = new Date().valueOf().toString()

    const userNew = await this.userRepository.findOneBy({ _id })

    const diff = +dateOnline - +userNew.dateOnline
    const diffHour = diff / 1000 / 60 / 60
    console.log('DIFF - 1 HOUR: ', diffHour)

    const salary = +(diffHour * userNew.salary).toFixed(0)
    userNew.coins += salary
    console.log('SALARY - 1 HOUR: ', salary)

    // console.log('SALARY: ', salary)

    // frontSide!
    return await this.userRepository.save({ ...userNew, dateOnline });

  }

  // async createRef(idTelegram: string, refId: string): Promise<User> {

  //   // const dateRegistartion = new Date().valueOf().toString()
  //   // const dateOnline = dateRegistartion

  //   const userNew = await this.userRepository.findOneBy({ idTelegram });
  //   const refUser = await this.userRepository.findOneBy({ idTelegram: refId });

  //   if (userNew && refUser) {

  //   } else {
  //     throw new BadRequestException('User doesn\'t exist');
  //   }
  //   // if (!userExist) {
  //   return await this.userRepository.save({ ...userNew, });
  //   // }

  // }

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





  // async create(createUserDto: CreateUserDto) {

  //   const dateCurrent = new Date().valueOf()

  //   const userNew = {
  //     ...createUserDto,
  //     dateRegistartion: dateCurrent.toString(),
  //   }

  //   return await this.userRepository.save(userNew)
  // }

  async recalculateSalary(_id: number) {
    const userNew = await this.userRepository.findOneBy({ _id })
    const userCards = await this.userCardsRepository.findBy({ user: userNew })

    console.log(userCards)

    const salary = userCards.reduce((acc, item) => { console.log(item); return acc + item.salary }, 0)

    return await this.userRepository.save({ ...userNew, salary })
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: number) {
    return await this.userRepository.findOneBy({ _id });
  }

  async findOneByTelegramId(idTelegram: string) {

    console.log('CURRENT TG ID: ', idTelegram)
    const currentUser = await this.userRepository.findOneBy({ idTelegram });
    console.log('CURRENT USER: ', currentUser)

    return currentUser
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
  //   return `This action removes a #${id} userNew`;
  // }





  // ----------------------- OTHERS



  async getMyRefUsers(idTelegram: string): Promise<User> {
    return await this.userRepository.findOne({ where: { idTelegram }, relations: ['referralUsers'] })
  }




}
