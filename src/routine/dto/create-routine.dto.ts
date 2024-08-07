import { IsOptional, IsString } from 'class-validator';

export class CreateRoutineDTO {
    @IsOptional()
    @IsString()
    monday: string;

    @IsOptional()
    @IsString()
    tuesday: string;

    @IsOptional()
    @IsString()
    wednesday: string;

    @IsOptional()
    @IsString()
    thursday: string;

    @IsOptional()
    @IsString()
    friday: string;

    @IsOptional()
    @IsString()
    saturday: string;

    @IsOptional()
    @IsString()
    sunday: string;
}
