import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDTO {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsUUID()
    postId: string;

    @IsOptional()
    @IsUUID()
    commentId: string;
}
