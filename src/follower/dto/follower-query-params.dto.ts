import { IsOptional, IsUUID } from 'class-validator';

export class FollowerQueryParams {
    @IsOptional()
    @IsUUID()
    studentId: string;

    @IsOptional()
    @IsUUID()
    collegeId: string;
}
