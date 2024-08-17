import {
    Injectable,
    ConflictException,
    BadRequestException,
    InternalServerErrorException,
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
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        where: Prisma.CollegeWhereUniqueInput,
    ): string => {
        return `College with ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createCollege(data: CreateCollegeDTO): Promise<CollegeDTO> {
        const { email, password, passwordConfirmation } = data;

        const college = await this.getFirstCollege({ email });
        if (college) throw new ConflictException(this.conflictMessage(email));

        if (password !== passwordConfirmation)
            throw new BadRequestException(
                'Password and password confirmation do not match.',
            );
        delete data.passwordConfirmation;

        const passwordHash = await bcrypt.hashSync(password, this.hashSalt);

        try {
            return await this.prisma.college.create({
                data: {
                    ...data,
                    testDate: new Date(data.testDate),
                    password: passwordHash,
                },
                select: this.collegeSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('college', 'created'),
            );
        }
    }

    async getColleges(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CollegeWhereInput;
        orderBy?: Prisma.CollegeOrderByWithRelationInput;
    }): Promise<CollegeDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.college.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.collegeSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('colleges', 'found'),
            );
        }
    }

    async getUniqueCollege(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegeDTO> {
        try {
            const collegeFound = await this.prisma.college.findUnique({
                where,
                select: this.collegeSelect,
            });
            if (!collegeFound) throw this.notFoundMessage(where);
            return collegeFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async getFirstCollege(
        where: Prisma.CollegeWhereInput,
    ): Promise<CollegeDTO> {
        return await this.prisma.college.findFirst({
            where,
            select: this.collegeSelect,
        });
    }

    async updateCollege(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegeDTO;
    }): Promise<CollegeDTO> {
        const { where, data } = params;
        const { email, testDate } = data;

        const college = await this.getUniqueCollege(where);

        if (email) {
            const collegeEmail = await this.getFirstCollege({ email });
            if (collegeEmail && collegeEmail.id !== college.id)
                throw new ConflictException(this.conflictMessage(email));
        }
        if (testDate) data.testDate = new Date(data.testDate);

        try {
            return await this.prisma.college.update({
                where,
                data,
                select: this.collegeSelect,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('college', 'updated'),
            );
        }
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

        try {
            return await this.updateCollege({
                where,
                data: { password: passwordHash },
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('password', 'changed'),
            );
        }
    }

    async updateCollegeState(params: {
        where: Prisma.CollegeWhereUniqueInput;
        active: boolean;
    }): Promise<CollegeDTO> {
        const { where, active } = params;

        await this.getUniqueCollege(where);

        try {
            return await this.updateCollege({
                where,
                data: { active },
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage(
                    'college',
                    active ? 'reactivated' : 'deactivated',
                ),
            );
        }
    }

    async deleteCollege(where: Prisma.CollegeWhereUniqueInput): Promise<void> {
        await this.getUniqueCollege(where);

        try {
            await this.prisma.college.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('college', 'deleted'),
            );
        }
    }
}
