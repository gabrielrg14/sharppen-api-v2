import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsDateString,
    IsStrongPassword,
} from 'class-validator';

export class CreateStudentDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsDateString()
    birthDate: Date;

    @IsNotEmpty()
    @IsString()
    course: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    passwordConfirmation: string;
}
