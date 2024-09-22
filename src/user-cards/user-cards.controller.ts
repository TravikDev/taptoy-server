// user-cards.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { UserCardsService } from './user-cards.service';
import { AssignCardDto } from './dto/assign-card.dto';
import { UpgradeCardDto } from './dto/upgrade-card.dto';

@Controller('user-cards')
export class UserCardsController {
  constructor(private readonly userCardsService: UserCardsService) { }

  @Post('assign')
  assignCardToUser(@Body() assignCardDto: AssignCardDto) {
    console.log('dto', assignCardDto)
    const { userId, cardId } = assignCardDto;
    return this.userCardsService.assignCardToUser(cardId, userId);
  }

  @Post('upgrade/:userId/:userCardId')
  upgradeUserCard(@Param('userId') userId: number, @Param('userCardId') userCardId: number) {
    return this.userCardsService.upgradeUserCard(userId, userCardId);
  }

  @Get(':id')
  getUserCards(@Param('id') id: number) {
    return this.userCardsService.getUserCards(id)
  }
}
