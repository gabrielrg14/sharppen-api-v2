import { PartialType } from '@nestjs/mapped-types';
import { CreateCollegeDTO } from './create-college.dto';
import { IsEmpty } from 'class-validator';

export class UpdateCollegeDTO extends PartialType(CreateCollegeDTO) {
    @IsEmpty()
    password?: string;

    @IsEmpty()
    passwordConfirmation?: string;
}
