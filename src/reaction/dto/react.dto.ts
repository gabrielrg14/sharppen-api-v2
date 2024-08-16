import { IsOptional, IsUUID } from 'class-validator';

export class ReactDTO {
    @IsOptional()
    @IsUUID()
    postId: string;

    @IsOptional()
    @IsUUID()
    commentId: string;
}
