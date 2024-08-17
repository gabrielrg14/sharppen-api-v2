import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDTO } from './create-student.dto';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateStudentDTO extends PartialType(CreateStudentDTO) {
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
