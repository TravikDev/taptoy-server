import { IsInt, IsNumber, IsOptional, IsString } from "class-validator"

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

    @IsOptional()
    @IsString()
    category?: string
    // @IsNumber()
    // progress: number


}
