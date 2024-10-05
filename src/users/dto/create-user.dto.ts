import { IsEmail, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsNumber()
    @IsNotEmpty()
    idTelegram: string

    @IsString()
    username: string

    @IsString()
    avatar: string

    @IsOptional()
    @IsString()
    idRefTelegram?: string;
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
