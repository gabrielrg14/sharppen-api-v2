import { IsOptional, IsString } from 'class-validator';

export class CollegeQueryParams {
    @IsOptional()
    @IsString()
    search: string;
}
