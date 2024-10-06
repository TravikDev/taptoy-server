import { IsEmail, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    idTelegram: string

    @IsString()
    username: string

    // @IsOptional()
    // @IsString()
    // avatar?: string

    // @IsOptional()
    // @IsString()
    // idRefTelegram?: string;
    // @IsNumber()
    // level: number

    // @IsNumber()
    // salary: number

    // @IsNumber()
    // registartionDate: number

    // @IsNumber()
    // rating: number

    // @IsNotEmpty()
    // password: string;
}
