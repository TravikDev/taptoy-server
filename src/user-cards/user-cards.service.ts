// user-cards.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCard } from './entities/user-card.entity';
import User from 'src/users/entities/user.entity';
import { Card } from 'src/cards/entities/card.entity';

@Injectable()
export class UserCardsService {
  constructor(
    @InjectRepository(UserCard)
    private readonly userCardRepository: Repository<UserCard>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) { }

  async assignCardToUser(cardId: number, userId: number): Promise<UserCard> {
    const user = await this.userRepository.findOne({ where: { _id: userId } });
    const card = await this.cardRepository.findOne({ where: { _id: cardId } });

    const cardExist = await this.userCardRepository.findOneBy({ user, card })

    if (cardExist) {
      throw new BadRequestException('Exist')
    }
    // if he has - do nothing
    // if (user.userCards.some(card))

    // Проверяем, есть ли у пользователя уже эта карточка
    // const userAlreadyHasCard = user.userCards.some(
    //   (userCard) => userCard.card._id === cardId
    // );

    if (user.coins >= card.salary) {

      user.coins -= card.price

      const userCard = new UserCard();
      userCard.user = user;
      userCard.card = card;

      // user.userCards = [...user.userCards, userCard]
      await this.userRepository.save(user)

      return this.userCardRepository.save(userCard);

    } else {
      throw new BadRequestException('No enough!')
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

    // Списываем стоимость улучшения
    user.coins -= upgradeCost;
    await this.userRepository.save(user);

    // Повышаем уровень карточки
    userCard.level += 1;
    userCard.salary = userCard.level * userCard.salary
    // userCard.experience = 0; // Сбрасываем опыт при повышении уровня
    userCard.upgradeCost = upgradeCost; // Обновляем стоимость улучшения

    return this.userCardRepository.save(userCard);
  }


  private getUpgradeCost(level: number): number {
    return 100 * Math.pow(2, level); // Пример: стоимость увеличивается вдвое с каждым уровнем
  }

}
