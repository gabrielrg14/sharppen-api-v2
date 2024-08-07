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

    abstract getStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentDTO>;

    abstract updateStudent(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentDTO;
    }): Promise<StudentDTO>;

    abstract updateStudentPassword(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentPasswordDTO;
    }): Promise<StudentDTO>;

    abstract changeStudentState(params: {
        where: Prisma.StudentWhereUniqueInput;
        active: boolean;
    }): Promise<StudentDTO>;

    abstract deleteStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<void>;
}
