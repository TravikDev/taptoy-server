// user-cards.controller.ts
import { Controller, Post, Param, Body } from '@nestjs/common';
import { UserCardsService } from './user-cards.service';
import { AssignCardDto } from './dto/assign-card.dto';
import { UpgradeCardDto } from './dto/upgrade-card.dto';

@Controller('user-cards')
export class UserCardsController {
  constructor(private readonly userCardsService: UserCardsService) { }

  @Post('assign')
  assignCardToUser(@Body() assignCardDto: AssignCardDto) {
    const { userId, cardId } = assignCardDto;
    return this.userCardsService.assignCardToUser(cardId, userId);
  }

  @Post('upgrade/:userId/:userCardId')
  upgradeUserCard(@Param('userId') userId: number, @Param('userCardId') userCardId: number) {
    // const { experience } = upgradeCardDto;
    return this.userCardsService.upgradeUserCard(userId, userCardId);
  }
}
