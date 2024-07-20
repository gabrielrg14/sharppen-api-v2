import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { PrismaService } from 'src/db/prisma.service';
import {
    StudentDTO,
    CreateStudentDTO,
    UpdateStudentDTO,
    UpdateStudentPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService implements StudentRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    private readonly conflictMessage = (email: string): string => {
        return `A student with the email ${email} is already registered.`;
    };
    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        where: Prisma.StudentWhereUniqueInput,
    ): string => {
        return `Student ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createStudent(data: CreateStudentDTO): Promise<StudentDTO> {
        const { email, password, passwordConfirmation } = data;

        const student = await this.prisma.student.findUnique({
            where: { email },
        });
        if (student) throw new ConflictException(this.conflictMessage(email));

        if (password !== passwordConfirmation)
            throw new BadRequestException(
                'Password and password confirmation do not match.',
            );
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        const studentCreated = await this.prisma.student.create({
            data: {
                ...data,
                birthDate: new Date(data.birthDate),
                password: passwordHash,
            },
            select: this.studentSelect,
        });
        if (!studentCreated)
            throw new BadRequestException(
                this.badRequestMessage('student', 'created'),
            );

        return studentCreated;
    }

    async getStudents(params: {
        skip?: number;
        take?: number;
        where?: Prisma.StudentWhereInput;
        orderBy?: Prisma.StudentOrderByWithRelationInput;
    }): Promise<StudentDTO[]> {
        const { skip, take, where, orderBy } = params;

        const studentsFound = await this.prisma.student.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.studentSelect,
        });
        if (!studentsFound)
            throw new BadRequestException(
                this.badRequestMessage('students', 'found'),
            );

        return studentsFound;
    }

    async getStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentDTO> {
        const studentFound = await this.prisma.student.findUnique({
            where,
            select: this.studentSelect,
        });
        if (!studentFound)
            throw new NotFoundException(this.notFoundMessage(where));
        return studentFound;
    }

    async updateStudent(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentDTO;
    }): Promise<StudentDTO> {
        const { where, data } = params;
        const { email, birthDate } = data;

        const student = await this.prisma.student.findUnique({ where });
        if (!student) throw new NotFoundException(this.notFoundMessage(where));

        if (email) {
            const studentEmail = await this.prisma.student.findUnique({
                where: { email },
            });
            if (studentEmail && studentEmail.id !== student.id)
                throw new ConflictException(this.conflictMessage(email));
        }
        if (birthDate) data.birthDate = new Date(data.birthDate);

        const updatedStudent = await this.prisma.student.update({
            where,
            data,
            select: this.studentSelect,
        });
        if (!updatedStudent)
            throw new BadRequestException(
                this.badRequestMessage('student', 'updated'),
            );

        return updatedStudent;
    }

    async updateStudentPassword(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentPasswordDTO;
    }): Promise<StudentDTO> {
        const { where, data } = params;

        if (data.password !== data.passwordConfirmation)
            throw new BadRequestException(
                'Password and password confirmation do not match.',
            );

        const student = await this.prisma.student.findUnique({ where });
        if (!student) throw new NotFoundException(this.notFoundMessage(where));

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

        const updatedStudent = await this.prisma.student.update({
            where,
            data: { password: passwordHash },
            select: this.studentSelect,
        });
        if (!updatedStudent)
            throw new BadRequestException(
                this.badRequestMessage('password', 'changed'),
            );

        return updatedStudent;
    }

    async deleteStudent(where: Prisma.StudentWhereUniqueInput): Promise<void> {
        const student = await this.prisma.student.findUnique({ where });
        if (!student) throw new NotFoundException(this.notFoundMessage(where));

        const deletedStudent = await this.prisma.student.delete({ where });
        if (!deletedStudent)
            throw new BadRequestException(
                this.badRequestMessage('student', 'deleted'),
            );
    }
}
