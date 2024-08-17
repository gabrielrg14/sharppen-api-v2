import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { FollowerRepository } from './follower.repository';
import { PrismaService } from 'src/db/prisma.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { FollowerDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FollowerService implements FollowerRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
    ) {}

    private readonly selectFollower = {
        id: true,
        student: {
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                course: true,
                active: true,
            },
        },
        college: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                active: true,
            },
        },
    };

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.FollowerWhereUniqueInput,
    ): string => {
        return `${subject} with ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };

    async followUnfollow(studentId: string, collegeId: string): Promise<void> {
        await this.studentService.getUniqueStudent({ id: studentId });
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            const followerFound = await this.getFirstFollower({
                studentId,
                collegeId,
            });
            if (followerFound) {
                await this.prisma.follower.delete({
                    where: { id: followerFound.id },
                });
            } else {
                await this.prisma.follower.create({
                    data: { studentId, collegeId },
                });
            }
        } catch (err) {
            throw err;
        }
    }

    async checkFollower(
        studentId: string,
        collegeId: string,
    ): Promise<boolean> {
        await this.studentService.getUniqueStudent({ id: studentId });
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            const followerFound = await this.getFirstFollower({
                studentId,
                collegeId,
            });
            return followerFound ? true : false;
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('follower', 'checked'),
            );
        }
    }

    async getFollowers(params: {
        where?: Prisma.FollowerWhereInput;
    }): Promise<FollowerDTO[]> {
        const { where } = params;

        try {
            return await this.prisma.follower.findMany({
                where,
                select: this.selectFollower,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('followers', 'found'),
            );
        }
    }

    async getUniqueFollower(
        where: Prisma.FollowerWhereUniqueInput,
    ): Promise<FollowerDTO> {
        try {
            const followerFound = await this.prisma.follower.findUnique({
                where,
                select: this.selectFollower,
            });
            if (!followerFound) throw this.notFoundMessage('Follower', where);
            return followerFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async getFirstFollower(
        where: Prisma.FollowerWhereInput,
    ): Promise<FollowerDTO> {
        return await this.prisma.follower.findFirst({
            where,
            select: this.selectFollower,
        });
    }
}
