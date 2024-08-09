import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    author: string;
}
