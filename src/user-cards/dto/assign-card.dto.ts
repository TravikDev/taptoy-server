// dto/assign-card.dto.ts
import { IsInt } from 'class-validator';

export class AssignCardDto {
  @IsInt()
  readonly cardId: number;

  @IsInt()
  readonly userId: number;
}