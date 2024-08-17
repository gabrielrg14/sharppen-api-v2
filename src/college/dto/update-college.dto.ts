import { PartialType } from '@nestjs/mapped-types';
import { CreateCollegeDTO } from './create-college.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateCollegeDTO extends PartialType(CreateCollegeDTO) {
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
