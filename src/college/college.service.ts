import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CollegeRepository } from './college.repository';
import { PrismaService } from 'src/db/prisma.service';
import {
    CreateCollegeDTO,
    CollegeDTO,
    UpdateCollegeDTO,
    UpdateCollegePasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CollegeService implements CollegeRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly hashSalt = 10;
    private readonly collegeSelect = {
        id: true,
        name: true,
        email: true,
        testDate: true,
        phone: true,
        address: true,
        imagePath: true,
        active: true,
        createdAt: true,
        updatedAt: true,
    };

    private readonly conflictMessage = (email: string): string => {
        return `A college with the email ${email} is already registered.`;
    };
    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        where: Prisma.CollegeWhereUniqueInput,
    ): string => {
        return `College ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createCollege(data: CreateCollegeDTO): Promise<CollegeDTO> {
        const { email, password, passwordConfirmation } = data;

        const college = await this.prisma.college.findUnique({
            where: { email },
        });
        if (college) throw new ConflictException(this.conflictMessage(email));

        if (password !== passwordConfirmation)
            throw new BadRequestException(
                'Password and password confirmation do not match.',
            );
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        const collegeCreated = await this.prisma.college.create({
            data: {
                ...data,
                testDate: new Date(data.testDate),
                password: passwordHash,
            },
            select: this.collegeSelect,
        });
        if (!collegeCreated)
            throw new BadRequestException(
                this.badRequestMessage('college', 'created'),
            );

        return collegeCreated;
    }

    async getColleges(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CollegeWhereInput;
        orderBy?: Prisma.CollegeOrderByWithRelationInput;
    }): Promise<CollegeDTO[]> {
        const { skip, take, where, orderBy } = params;

        const collegesFound = await this.prisma.college.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.collegeSelect,
        });
        if (!collegesFound)
            throw new BadRequestException(
                this.badRequestMessage('colleges', 'found'),
            );

        return collegesFound;
    }

    async getCollege(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegeDTO> {
        const collegeFound = await this.prisma.college.findUnique({
            where,
            select: this.collegeSelect,
        });
        if (!collegeFound)
            throw new NotFoundException(this.notFoundMessage(where));
        return collegeFound;
    }

    async updateCollege(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegeDTO;
    }): Promise<CollegeDTO> {
        const { where, data } = params;
        const { email, testDate } = data;

        const college = await this.prisma.college.findUnique({ where });
        if (!college) throw new NotFoundException(this.notFoundMessage(where));

        if (email) {
            const collegeEmail = await this.prisma.college.findUnique({
                where: { email },
            });
            if (collegeEmail && collegeEmail.id !== college.id)
                throw new ConflictException(this.conflictMessage(email));
        }
        if (testDate) data.testDate = new Date(data.testDate);

        const updatedCollege = await this.prisma.college.update({
            where,
            data,
            select: this.collegeSelect,
        });
        if (!updatedCollege)
            throw new BadRequestException(
                this.badRequestMessage('college', 'updated'),
            );

        return updatedCollege;
    }

    async updateCollegePassword(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegePasswordDTO;
    }): Promise<CollegeDTO> {
        const { where, data } = params;

        if (data.password !== data.passwordConfirmation)
            throw new BadRequestException(
                'Password and password confirmation do not match.',
            );

        const college = await this.prisma.college.findUnique({ where });
        if (!college) throw new NotFoundException(this.notFoundMessage(where));

        const isMatch = bcrypt.compareSync(
            data.currentPassword,
            college.password,
        );
        if (!isMatch)
            throw new UnauthorizedException('Invalid current password!');

        const passwordHash = await bcrypt.hashSync(
            data.password,
            this.hashSalt,
        );

        const updatedCollege = await this.prisma.college.update({
            where,
            data: { password: passwordHash },
            select: this.collegeSelect,
        });
        if (!updatedCollege)
            throw new BadRequestException(
                this.badRequestMessage('password', 'changed'),
            );

        return updatedCollege;
    }

    async deleteCollege(where: Prisma.CollegeWhereUniqueInput): Promise<void> {
        const college = await this.prisma.college.findUnique({ where });
        if (!college) throw new NotFoundException(this.notFoundMessage(where));

        const deletedCollege = await this.prisma.college.delete({ where });
        if (!deletedCollege)
            throw new BadRequestException(
                this.badRequestMessage('college', 'deleted'),
            );
    }
}
