import { IsEmail, IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

    @IsNumber()
    @IsNotEmpty()
    _id: number

}