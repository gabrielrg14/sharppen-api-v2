import { Avatar as AvatarModel } from '@prisma/client';

export class AvatarDTO implements AvatarModel {
    id: string;
    fieldname: string;
    filename: string;
    originalname: string;
    mimetype: string;
    encoding: string;
    destination: string;
    path: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
    studentId: string | null;
    collegeId: string | null;
}
