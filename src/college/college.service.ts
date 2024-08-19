import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CollegeRepository } from './college.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
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
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
    ) {}

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

    async createCollege(data: CreateCollegeDTO): Promise<CollegeDTO> {
        const { email, password, passwordConfirmation } = data;

        const college = await this.getFirstCollege({ email });
        if (college) this.exceptionService.emailConflict('college', email);

        if (password !== passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();
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
            this.exceptionService.somethingBadHappened('college', 'created');
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
            this.exceptionService.somethingBadHappened('colleges', 'found');
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
            if (!collegeFound)
                this.exceptionService.subjectNotFound<Prisma.CollegeWhereUniqueInput>(
                    'College',
                    where,
                );
            return collegeFound;
        } catch (err) {
            throw err;
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
                this.exceptionService.emailConflict('college', email);
        }
        if (testDate) data.testDate = new Date(data.testDate);

        try {
            return await this.prisma.college.update({
                where,
                data,
                select: this.collegeSelect,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('college', 'updated');
        }
    }

    async updateCollegePassword(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegePasswordDTO;
    }): Promise<CollegeDTO> {
        const { where, data } = params;

        if (data.password !== data.passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();

        const college = await this.prisma.college.findUnique({ where });
        if (!college)
            this.exceptionService.subjectNotFound<Prisma.CollegeWhereUniqueInput>(
                'College',
                where,
            );

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
            this.exceptionService.somethingBadHappened('password', 'changed');
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
            this.exceptionService.somethingBadHappened(
                'college',
                active ? 'reactivated' : 'deactivated',
            );
        }
    }

    async deleteCollege(where: Prisma.CollegeWhereUniqueInput): Promise<void> {
        await this.getUniqueCollege(where);

        try {
            await this.prisma.college.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('college', 'deleted');
        }
    }
}
