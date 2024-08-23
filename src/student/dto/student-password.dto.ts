import { Student as StudentModel } from '@prisma/client';

export class StudentPasswordDTO
    implements Pick<StudentModel, 'id' | 'password'>
{
    id: string;
    password: string;
}
