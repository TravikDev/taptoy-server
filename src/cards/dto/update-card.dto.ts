import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsOptional } from 'class-validator';

export class UpdateCardDto extends PartialType(CreateCardDto) {
    @IsOptional()
    title?: string

    @IsOptional()
    description?: string

    @IsOptional()
    level?: number

    @IsOptional()
    salary?: number

    @IsOptional()
    rph?: number

    @IsOptional()
    progress?: number

    @IsOptional()
    urlPicture?: string
}
