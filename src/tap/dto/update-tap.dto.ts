import { PartialType } from '@nestjs/mapped-types';
import { CreateTapDto } from './create-tap.dto';

export class UpdateTapDto extends PartialType(CreateTapDto) {
  id: number;
}
