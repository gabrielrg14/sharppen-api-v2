import { Student as StudentModel } from '@prisma/client';

export class StudentDTO implements Omit<StudentModel, 'password'> {
    id: string;
    name: string;
    email: string;
    birthDate: Date;
    course: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
