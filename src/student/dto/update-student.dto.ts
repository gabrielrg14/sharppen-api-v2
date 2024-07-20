import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDTO } from './create-student.dto';
import { IsEmpty } from 'class-validator';

export class UpdateStudentDTO extends PartialType(CreateStudentDTO) {
    @IsEmpty()
    password?: string;

    @IsEmpty()
    passwordConfirmation?: string;
}
