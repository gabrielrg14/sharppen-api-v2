import { IsOptional, IsUUID } from 'class-validator';

export class BookQueryParams {
    @IsOptional()
    @IsUUID()
    studentId: string;

    @IsOptional()
    @IsUUID()
    collegeId: string;
}
