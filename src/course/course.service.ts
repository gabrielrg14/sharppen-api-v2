import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { PrismaService } from 'src/db/prisma.service';
import { CollegeService } from 'src/college/college.service';
import { CourseDTO, CreateCourseDTO, UpdateCourseDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService implements CourseRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly collegeService: CollegeService,
    ) {}

    private readonly selectCourse = {
        id: true,
        name: true,
        period: true,
        createdAt: true,
        updatedAt: true,
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
        where: Prisma.CourseWhereUniqueInput,
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

    async createCourse(
        data: CreateCourseDTO,
        collegeId: string,
    ): Promise<CourseDTO> {
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            return await this.prisma.course.create({
                data: { ...data, collegeId },
                select: this.selectCourse,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('course', 'created'),
            );
        }
    }

    async getCourses(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CourseWhereInput;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<CourseDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.course.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectCourse,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('courses', 'found'),
            );
        }
    }

    async getUniqueCourse(
        where: Prisma.CourseWhereUniqueInput,
    ): Promise<CourseDTO> {
        try {
            const courseFound = await this.prisma.course.findUnique({
                where,
                select: this.selectCourse,
            });
            if (!courseFound) throw this.notFoundMessage('Course', where);
            return courseFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async getFirstCourse(where: Prisma.CourseWhereInput): Promise<CourseDTO> {
        return await this.prisma.course.findFirst({
            where,
            select: this.selectCourse,
        });
    }

    async updateCourse(params: {
        where: Prisma.CourseWhereUniqueInput;
        data: UpdateCourseDTO;
    }): Promise<CourseDTO> {
        const { where, data } = params;

        await this.getUniqueCourse(where);

        try {
            return await this.prisma.course.update({
                where,
                data,
                select: this.selectCourse,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('course', 'updated'),
            );
        }
    }

    async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<void> {
        await this.getUniqueCourse(where);

        try {
            await this.prisma.course.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('course', 'deleted'),
            );
        }
    }
}
