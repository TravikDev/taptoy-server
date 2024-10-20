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

  async createOrUpdate(createUserDto: CreateUserDto, idTelegramRef = ""): Promise<User | { user: User, salary: number }> {

    const dateRegistartion = new Date().valueOf().toString()
    const dateOnline = dateRegistartion

    console.log('USER: ', createUserDto.username, createUserDto.idTelegram)


    const userExist = await this.userRepository.findOneBy({ idTelegram: createUserDto.idTelegram })

    console.log('userExist', userExist)

    // ------------------------- IF USER DOESN'T EXIST

    if (!userExist) {

      const userNew = this.userRepository.create({ ...createUserDto, dateRegistartion, dateOnline });

      console.log('userNew', userNew)

      // ---------------------- REF SIDE

      if (idTelegramRef && idTelegramRef !== "") {

        const userRefExist = await this.userRepository.findOne({ where: { idTelegram: idTelegramRef } })
        console.log('userRefExist', userRefExist)

        // -------------------- IF REF IS GOOD
        if (userRefExist) {

          if (!userRefExist.referralUsersJSON) {
            userRefExist.referralUsersJSON = []
          }


          console.log('userRefExist', userRefExist, userNew)
          userRefExist.referralUsersJSON.push({ idTelegram: userNew.idTelegram, username: userNew.username })
          console.log('userRefExist PUSH')
          // userNew.referralUser = userRefExist
          console.log('userRefExist SETUP')
          userRefExist.coins += 1000
          console.log('userRefExist +1000')
          await this.userRepository.save(userRefExist);

          console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram}) with Ref idTelegram: ${userRefExist.idTelegram}`)

          userNew.coins = 1000
          const user = await this.userRepository.save(userNew);

          return { user, salary: 0 }

          // -------------------- IF REF IS BAD
        } else {

          console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram})`)
          const user = await this.userRepository.save(userNew);
          return { user, salary: 0 }
        }

        // -------------------- NO REF
      } else {

        // const userNew = this.userRepository.create({ ...createUserDto, dateRegistartion, dateOnline });
        console.log(`New User (id: ${userNew._id}; idTelegram: ${userNew.idTelegram})`)
        const user = await this.userRepository.save(userNew);
        return { user, salary: 0 }

      }

    } else {
      console.log(`Update User (id: ${userExist._id}; idTelegram: ${userExist.idTelegram})`)
      return await this.updateOnline(userExist._id)
    }

  }


  async updateOnline(_id: number): Promise<{ user: User, salary: number }> {

    // Update Online

    const dateOnline = new Date().valueOf().toString()

    const userNew = await this.userRepository.findOneBy({ _id })

    const diff = +dateOnline - +userNew.dateOnline
    const diffHour = +(diff / 1000 / 60 / 60) <= 3 ? +(diff / 1000 / 60 / 60) : 3
    console.log('DIFF - 1 HOUR: ', diffHour)

    const salary = +((diffHour * userNew.salary).toFixed(0))
    if (salary < 1) {
      console.log('no salary today!')
      const user = await this.userRepository.save({ ...userNew });
      return { user, salary: 0 }
    }
    console.log('some salary!', salary)
    userNew.coins += salary
    console.log('SALARY - 1 HOUR: ', salary)

    // console.log('SALARY: ', salary)

    // frontSide!
    //return 
    const user = await this.userRepository.save({ ...userNew, dateOnline });
    return { user, salary }
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

    console.log('userRecalculate id: ', _id)
    const user = await this.userRepository.findOneBy({ _id })

    console.log('userRecalculate: ', user)

    const userCards = await this.userCardsRepository.findBy({ user: { _id } })

    console.log('userRecalculate: ', userCards)

    // console.log(userCards)

    const salary = userCards.reduce((acc, item) => { console.log(item); return acc + item.salary }, 0)

    console.log('userCurrentSalary!: ', salary)
    return await this.userRepository.save({ ...user, salary })
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
    console.log('get Friends', idTelegram)
    const user = await this.userRepository.findOne({ where: { idTelegram } })
    console.log('user: ', user)
    return user
  }


  async onClickQuest(idTelegram: string, idQuest: number) {
    console.log('quest: ', idTelegram, idQuest)
    const user = await this.userRepository.findOneBy({ idTelegram })
    console.log('currentUser: ', user)
    user.coins += user.questsUsersJSON.find((q: any) => +q.id === +idQuest).salary
    user.questsUsersJSON = user.questsUsersJSON.map((q: any) => +q.id === +idQuest ? { ...q, isCompleted: true } : q)

    console.log('newUser: ', user)

    return this.userRepository.save(user)
  }

}
