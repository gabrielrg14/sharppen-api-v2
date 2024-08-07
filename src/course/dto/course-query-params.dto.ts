import { IsOptional, IsUUID } from 'class-validator';

export class CourseQueryParams {
    @IsOptional()
    @IsUUID()
    collegeId: string;
}
