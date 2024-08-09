import {
    Injectable,
    ConflictException,
    BadRequestException,
    InternalServerErrorException,
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
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        where: Prisma.StudentWhereUniqueInput,
    ): string => {
        return `Student with ${Object.entries(where)
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
            throw new InternalServerErrorException(
                this.errorMessage('student', 'created'),
            );
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
            throw new InternalServerErrorException(
                this.errorMessage('students', 'found'),
            );
        }
    }

    async getStudent(
        where: Prisma.StudentWhereUniqueInput,
    ): Promise<StudentDTO> {
        try {
            const studentFound = await this.prisma.student.findUnique({
                where,
                select: this.studentSelect,
            });
            if (!studentFound) throw this.notFoundMessage(where);
            return studentFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async updateStudent(params: {
        where: Prisma.StudentWhereUniqueInput;
        data: UpdateStudentDTO;
    }): Promise<StudentDTO> {
        const { where, data } = params;
        const { email, birthDate } = data;

        const student = await this.getStudent(where);

        if (email) {
            const studentEmail = await this.prisma.student.findUnique({
                where: { email },
            });
            if (studentEmail && studentEmail.id !== student.id)
                throw new ConflictException(this.conflictMessage(email));
        }
        if (birthDate) data.birthDate = new Date(data.birthDate);

        try {
            return await this.prisma.student.update({
                where,
                data,
                select: this.studentSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('student', 'updated'),
            );
        }
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

        try {
            return await this.prisma.student.update({
                where,
                data: { password: passwordHash },
                select: this.studentSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('password', 'changed'),
            );
        }
    }

    async changeStudentState(params: {
        where: Prisma.StudentWhereUniqueInput;
        active: boolean;
    }): Promise<StudentDTO> {
        const { where, active } = params;

        await this.getStudent(where);

        try {
            return await this.prisma.student.update({
                where,
                data: { active },
                select: this.studentSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage(
                    'student',
                    active ? 'reactivated' : 'deactivated',
                ),
            );
        }
    }

    async deleteStudent(where: Prisma.StudentWhereUniqueInput): Promise<void> {
        await this.getStudent(where);

        try {
            await this.prisma.student.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('student', 'deleted'),
            );
        }
    }
}
