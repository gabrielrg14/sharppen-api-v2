import { IsOptional, IsUUID } from 'class-validator';

export class ReactionQueryParams {
    @IsOptional()
    @IsUUID()
    postId: string;

    @IsOptional()
    @IsUUID()
    commentId: string;

    @IsOptional()
    @IsUUID()
    studentId: string;

    @IsOptional()
    @IsUUID()
    collegeId: string;
}
