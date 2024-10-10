import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { UserCardsService } from 'src/user-cards/user-cards.service';

@Injectable()
export class CardsService {

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    private readonly userCardService: UserCardsService
  ) { }

  async create(createCardDto: CreateCardDto): Promise<Card> {

    const dateCreation = new Date().valueOf().toString()

    // console.log('USER: ', createCardDto.username, createCardDto.idTelegram)

    const user = this.cardRepository.create({ ...createCardDto, dateCreation });
    return this.cardRepository.save(user);
  }

  // async create(createCardDto: createCardDto) {

  //   const dateCurrent = new Date().valueOf()

  //   const userNew = {
  //     ...createCardDto,
  //     dateRegistartion: dateCurrent.toString(),
  //   }

  //   return await this.cardRepository.save(userNew)
  // }

  async findAll() {
    return await this.cardRepository.find();
  }

  async findAllByCategory(category: string) {
    return await this.cardRepository.findBy({ category });
  }


  async findAllByCategoryAndId(category: string, id: number) {

    const userCards = await this.userCardService.getUserCardsByCategory(id, category)

    const allCards = await this.cardRepository.findBy({ category });

    return allCards.filter(card => Boolean(userCards.findIndex(userCard => userCard.card._id === card._id) + 1))
  }
  // async findOne(_id: number) {
  //   return await this.cardRepository.findOneBy({ _id });
  // }

  async update(_id: number, updateUserDto: UpdateCardDto): Promise<Card> {

    // _ Initialization

    const dateUpdated = new Date().valueOf().toString()

    // console.log(_id, updateUserDto)
    // try {
    //   const userCurrent = await this.cardRepository.findOneBy({ _id })


    //   // Business Logic

    //   // const userUpdated: User = {
    //   //   // idTelegram: updateUserDto.idTelegram,
    //   //   ...updateUserDto,
    //   //   dateUpdated: dateCurrent,
    //   // }

    //   // const userUpdatedStatus = await this.cardRepository.save(userUpdated);

    //   if (userUpdatedStatus.dateUpdated !== dateCurrent) {
    //     throw new BadRequestException('Update failed')
    //   }

    //   // _ Deinitialization
    //   return userUpdatedStatus

    // } catch (err) {
    //   return err
    // }

    return await this.cardRepository.save({ ...updateUserDto, dateUpdated, });


  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
