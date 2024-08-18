import { IsInt, IsNumber, IsString } from "class-validator"

export class CreateCardDto {

    @IsString()
    title: string

    @IsString()
    description: string

    @IsNumber()
    salary: number

    // @IsNumber()
    // rph: number

    @IsString()
    urlPicture: string

    @IsInt()
    price: number

    // @IsNumber()
    // progress: number


}
