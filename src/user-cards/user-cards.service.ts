// user-cards.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCard } from './entities/user-card.entity';
import User from 'src/users/entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserCardsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(UserCard)
    private readonly userCardRepository: Repository<UserCard>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) { }

  async getUserCards(_id: number) {
    const user = await this.userRepository.findOneBy({ _id })
    const userCards = await this.userCardRepository.find({ where: { user }, relations: ['card'] });
    return userCards
  }

  async getUserCardsByCategory(_id: number, category: string) {

    console.log('by category', category, _id)

    const user = await this.userRepository.findOneBy({ _id })
    const userCards = await this.userCardRepository.find({ where: { user }, relations: ['card'] });

    console.log('userCards: ', userCards)

    const userCardsFiltered = userCards.filter(card => card.card.category === category)

    console.log('userCards filtered: ', userCardsFiltered)

    return userCardsFiltered
  }

  async assignCardToUser(cardId: number, userId: number) {
    console.log('userId: ', userId)
    const user = await this.userRepository.findOne({ where: { _id: userId } });
    console.log('current User: ', user)
    const card = await this.cardRepository.findOne({ where: { _id: cardId } });

    console.log('CARD: ', card)

    const cardExist = await this.userCardRepository.findOneBy({ user: { _id: userId }, card: { _id: cardId } })

    console.log('CardExist: ', cardExist)

    if (cardExist) {
      throw new BadRequestException('Exist')
    }

    if (user.coins >= card.price) {

      user.coins -= card.price

      const userCard = new UserCard();
      userCard.user = user;
      userCard.card = card;
      userCard.salary = card.salary

      console.log('updatedUser: ', user)

      // user.userCards = [...user.userCards, userCard]
      await this.userRepository.save(user)

      console.log('updatedUserCard: ', userCard)

      await this.userCardRepository.save(userCard);

      const userUpdated = await this.userService.recalculateSalary(user._id)

      return userUpdated
    } else {
      throw new BadRequestException('Not enough!')
    }
  }

  async upgradeUserCard(userId: number, userCardId: number): Promise<User> {

    console.log('USERID', userId, userCardId)

    const user = await this.userRepository.findOne({ where: { _id: userId }, relations: ['userCards'] });
    const card = await this.cardRepository.findOneBy({ _id: userCardId })
    const userCard = await this.userCardRepository.findOne({ where: { user, card } });

    console.log('USER', user)
    console.log('USERCARD', userCard)

    if (!userCard || !user) {
      throw new NotFoundException('UserCard or User not found');
    }


    const upgradeCost = this.getUpgradeCost(userCard.level);

    console.log('USERCARD2', upgradeCost)

    if (user.coins < upgradeCost) {
      throw new BadRequestException('Insufficient coins to upgrade the card');
    }

    user.coins -= upgradeCost;

    console.log('USERCARD3', user)


    console.log('USERCARD4', user)

    userCard.level += 1;

    user.salary -= userCard.salary
    userCard.salary = userCard.level * userCard.salary
    user.salary += userCard.salary

    userCard.upgradeCost = upgradeCost;


    console.log('USERCARD5', userCard)

    await this.userRepository.save(user);
    await this.userCardRepository.save(userCard);
    return user
  }


  private getUpgradeCost(level: number): number {
    return 100 * Math.pow(2, level);
  }

}
