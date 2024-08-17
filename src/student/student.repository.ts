import {
    StudentDTO,
    CreateStudentDTO,
    UpdateStudentDTO,
    UpdateStudentPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';
export abstract class StudentRepository {
    abstract createStudent(data: CreateStudentDTO): Promise<StudentDTO>;

    abstract getStudents(params: {
        skip?: number;
        take?: number;
        where?: Prisma.StudentWhereInput;
        orderBy?: Prisma.StudentOrderByWithRelationInput;
    }): Promise<StudentDTO[]>;

    abstract getUniqueStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentDTO>;

    abstract getFirstStudent(
        where: Prisma.StudentWhereInput,
    ): Promise<StudentDTO>;

    abstract updateStudent(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentDTO;
    }): Promise<StudentDTO>;

    abstract updateStudentPassword(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentPasswordDTO;
    }): Promise<StudentDTO>;

    abstract updateStudentState(params: {
        where: Prisma.StudentWhereUniqueInput;
        active: boolean;
    }): Promise<StudentDTO>;

    abstract deleteStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<void>;
}
