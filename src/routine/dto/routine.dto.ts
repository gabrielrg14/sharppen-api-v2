import {
    Routine as RoutineModel,
    Student as StudentModel,
} from '@prisma/client';

type Student = Pick<
    StudentModel,
    'id' | 'name' | 'email' | 'birthDate' | 'course' | 'active'
>;

export class RoutineDTO implements Omit<RoutineModel, 'studentId'> {
    id: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
}
