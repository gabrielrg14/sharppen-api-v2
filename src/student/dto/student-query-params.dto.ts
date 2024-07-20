import { IsOptional, IsString } from 'class-validator';

export class StudentQueryParams {
    @IsOptional()
    @IsString()
    search: string;
}
