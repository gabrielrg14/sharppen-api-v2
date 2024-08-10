import { IsNotEmpty, IsUUID } from 'class-validator';

export class FollowDTO {
    @IsNotEmpty()
    @IsUUID()
    studentId: string;

    @IsNotEmpty()
    @IsUUID()
    collegeId: string;
}
