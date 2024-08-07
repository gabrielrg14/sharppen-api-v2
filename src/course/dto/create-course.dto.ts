import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    period: string;
}
