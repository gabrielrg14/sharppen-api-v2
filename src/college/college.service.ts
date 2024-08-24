import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CollegeRepository } from './college.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import {
    CollegeDTO,
    CollegePasswordDTO,
    CreateCollegeDTO,
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

    async getCollegePassword(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegePasswordDTO> {
        return await this.prisma.college.findUnique({
            where,
            select: {
                id: true,
                password: true,
            },
        });
    }

    async updateCollege(
        collegeId: string,
        data: UpdateCollegeDTO,
    ): Promise<CollegeDTO> {
        const { email, testDate } = data;

        const college = await this.getUniqueCollege({ id: collegeId });

        if (email) {
            const collegeEmail = await this.getFirstCollege({ email });
            if (collegeEmail && collegeEmail.id !== college.id)
                this.exceptionService.emailConflict('college', email);
        }
        if (testDate) data.testDate = new Date(data.testDate);

        try {
            return await this.prisma.college.update({
                where: { id: college.id },
                data,
                select: this.collegeSelect,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('college', 'updated');
        }
    }

    async updateCollegePassword(
        collegeId: string,
        data: UpdateCollegePasswordDTO,
    ): Promise<CollegeDTO> {
        if (data.password !== data.passwordConfirmation)
            this.exceptionService.passwordConfirmationNotMatch();

        const college = await this.getCollegePassword({ id: collegeId });
        if (!college)
            this.exceptionService.subjectNotFound<Prisma.CollegeWhereUniqueInput>(
                'College',
                { id: collegeId },
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
            return await this.updateCollege(college.id, {
                password: passwordHash,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('password', 'changed');
        }
    }

    async deleteCollege(collegeId: string): Promise<void> {
        await this.getUniqueCollege({ id: collegeId });

        try {
            await this.prisma.college.delete({ where: { id: collegeId } });
        } catch (err) {
            this.exceptionService.somethingBadHappened('college', 'deleted');
        }
    }
}
