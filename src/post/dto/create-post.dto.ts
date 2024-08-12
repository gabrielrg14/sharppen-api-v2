import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDTO {
    @IsNotEmpty()
    @IsString()
    content: string;
}
