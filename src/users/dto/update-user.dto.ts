import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsNumber()
    idTelegram?: string

    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsNumber()
    level?: number

    @IsOptional()
    @IsNumber()
    salary?: number

    @IsOptional()
    @IsNumber()
    energy?: number

    @IsOptional()
    @IsNumber()
    dateRegistartion?: string

    @IsOptional()
    @IsNumber()
    dateSalary?: string

    @Column()
    @IsNumber()
    dateUpdated?: string

    @Column()
    @IsNumber()
    dateOnline?: string

    @IsOptional()
    @IsNumber()
    rating?: number

    // @IsOptional()
    // @IsNumber()

}
