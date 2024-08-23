import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import {
    StudentDTO,
    StudentPasswordDTO,
    CreateStudentDTO,
    UpdateStudentDTO,
    UpdateStudentPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService implements StudentRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
    ) {}

    private readonly hashSalt = 10;
    private readonly studentSelect = {
        id: true,
        name: true,
        email: true,
        birthDate: true,
        course: true,
        imagePath: true,
        active: true,
        createdAt: true,
        updatedAt: true,
    };

    async createStudent(data: CreateStudentDTO): Promise<StudentDTO> {
        const { email, password, passwordConfirmation } = data;

        const student = await this.getFirstStudent({ email });
        if (student) this.exceptionService.emailConflict('student', email);

        if (password !== passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        try {
            return await this.prisma.student.create({
                data: {
                    ...data,
                    birthDate: new Date(data.birthDate),
                    password: passwordHash,
                },
                select: this.studentSelect,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('student', 'created');
        }
    }

    async getStudents(params: {
        skip?: number;
        take?: number;
        where?: Prisma.StudentWhereInput;
        orderBy?: Prisma.StudentOrderByWithRelationInput;
    }): Promise<StudentDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.student.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.studentSelect,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('students', 'found');
        }
    }

    async getUniqueStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentDTO> {
        try {
            const studentFound = await this.prisma.student.findUnique({
                where,
                select: this.studentSelect,
            });
            if (!studentFound)
                this.exceptionService.subjectNotFound<Prisma.StudentWhereUniqueInput>(
                    'Student',
                    where,
                );
            return studentFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstStudent(
        where: Prisma.StudentWhereInput,
    ): Promise<StudentDTO> {
        return await this.prisma.student.findFirst({
            where,
            select: this.studentSelect,
        });
    }

    async getStudentPassword(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentPasswordDTO> {
        return await this.prisma.student.findUnique({
            where,
            select: {
                id: true,
                password: true,
            },
        });
    }

    async updateStudent(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentDTO;
    }): Promise<StudentDTO> {
        const { where, data } = params;
        const { email, birthDate } = data;

        const student = await this.getUniqueStudent(where);

        if (email) {
            const studentEmail = await this.getFirstStudent({ email });
            if (studentEmail && studentEmail.id !== student.id)
                this.exceptionService.emailConflict('student', email);
        }
        if (birthDate) data.birthDate = new Date(data.birthDate);

        try {
            return await this.prisma.student.update({
                where,
                data,
                select: this.studentSelect,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('student', 'updated');
        }
    }

    async updateStudentPassword(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentPasswordDTO;
    }): Promise<StudentDTO> {
        const { where, data } = params;

        if (data.password !== data.passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();

        const student = await this.prisma.student.findUnique({ where });
        if (!student)
            this.exceptionService.subjectNotFound<Prisma.StudentWhereUniqueInput>(
                'Student',
                where,
            );

        const isMatch = bcrypt.compareSync(
            data.currentPassword,
            student.password,
        );
        if (!isMatch)
            throw new UnauthorizedException('Invalid current password!');

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        try {
            return await this.updateStudent({
                where,
                data: { password: passwordHash },
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('password', 'changed');
        }
    }

    async deleteStudent(where: Prisma.StudentWhereUniqueInput): Promise<void> {
        await this.getUniqueStudent(where);

        try {
            await this.prisma.student.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('student', 'deleted');
        }
    }
}
