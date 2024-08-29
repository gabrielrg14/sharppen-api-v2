import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UploadAvatarDTO {
    @IsNotEmpty()
    @IsString()
    fieldname: string;

    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsNotEmpty()
    @IsString()
    originalname: string;

    @IsNotEmpty()
    @IsString()
    mimetype: string;

    @IsNotEmpty()
    @IsString()
    encoding: string;

    @IsNotEmpty()
    @IsString()
    destination: string;

    @IsNotEmpty()
    @IsString()
    path: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;
}
