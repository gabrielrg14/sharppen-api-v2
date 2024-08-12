import { IsOptional, IsUUID } from 'class-validator';

export class PostQueryParams {
    @IsOptional()
    @IsUUID()
    collegeId: string;
}
