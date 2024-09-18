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
    return await this.userCardRepository.findBy({ user })
  }

  async assignCardToUser(cardId: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { _id: userId } });
    const card = await this.cardRepository.findOne({ where: { _id: cardId } });

    console.log('CARD: ', card)

    const cardExist = await this.userCardRepository.findOneBy({ user, card })

    if (cardExist) {
      throw new BadRequestException('Exist')
    }

    if (user.coins >= card.price) {

      user.coins -= card.price

      const userCard = new UserCard();
      userCard.user = user;
      userCard.card = card;
      userCard.salary = card.salary

      // user.userCards = [...user.userCards, userCard]
      await this.userRepository.save(user)

      await this.userCardRepository.save(userCard);

      const userUpdated = await this.userService.recalculateSalary(user._id)

      return userUpdated
    } else {
      throw new BadRequestException('Not enough!')
    }
  }

  async upgradeUserCard(userId: number, userCardId: number): Promise<UserCard> {

    console.log('USERID', userId)

    const user = await this.userRepository.findOne({ where: { _id: userId } });
    const userCard = await this.userCardRepository.findOne({ where: { _id: userCardId, user } });

    console.log('USER', user)
    console.log('USERCARD', userCard)

    if (!userCard || !user) {
      throw new NotFoundException('UserCard or User not found');
    }

    const upgradeCost = this.getUpgradeCost(userCard.level);

    if (user.coins < upgradeCost) {
      throw new BadRequestException('Insufficient coins to upgrade the card');
    }

    user.coins -= upgradeCost;
    await this.userRepository.save(user);

    userCard.level += 1;
    userCard.salary = userCard.level * userCard.salary
    userCard.upgradeCost = upgradeCost;

    return this.userCardRepository.save(userCard);
  }


  private getUpgradeCost(level: number): number {
    return 100 * Math.pow(2, level);
  }

}
