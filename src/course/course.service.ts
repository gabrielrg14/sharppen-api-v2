import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { PrismaService } from 'src/db/prisma.service';
import { CourseDTO, CreateCourseDTO, UpdateCourseDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService implements CourseRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.CourseWhereUniqueInput,
    ): string => {
        return `${subject} ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };

    async createCourse(
        data: CreateCourseDTO,
        collegeId: string,
    ): Promise<CourseDTO> {
        const college = await this.prisma.college.findUnique({
            where: { id: collegeId },
        });
        if (!college)
            throw new NotFoundException(
                this.notFoundMessage('College', { id: collegeId }),
            );

        const courseCreated = await this.prisma.course.create({
            data: { ...data, collegeId },
            select: this.selectCourse,
        });
        if (!courseCreated)
            throw new BadRequestException(
                this.badRequestMessage('course', 'created'),
            );

        return courseCreated;
    }

    async getCourses(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CourseWhereInput;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<CourseDTO[]> {
        const { skip, take, where, orderBy } = params;

        const coursesFound = await this.prisma.course.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.selectCourse,
        });
        if (!coursesFound)
            throw new BadRequestException(
                this.badRequestMessage('courses', 'found'),
            );

        return coursesFound;
    }

    async getCourse(where: Prisma.CourseWhereUniqueInput): Promise<CourseDTO> {
        const courseFound = await this.prisma.course.findUnique({
            where,
            select: this.selectCourse,
        });
        if (!courseFound)
            throw new NotFoundException(this.notFoundMessage('Course', where));
        return courseFound;
    }

    async updateCourse(params: {
        where: Prisma.CourseWhereUniqueInput;
        data: UpdateCourseDTO;
    }): Promise<CourseDTO> {
        const { where, data } = params;

        await this.getCourse(where);

        const updatedCourse = await this.prisma.course.update({
            where,
            data,
            select: this.selectCourse,
        });
        if (!updatedCourse)
            throw new BadRequestException(
                this.badRequestMessage('course', 'updated'),
            );

        return updatedCourse;
    }

    async deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<void> {
        await this.getCourse(where);
        const deletedCourse = await this.prisma.course.delete({ where });
        if (!deletedCourse)
            throw new BadRequestException(
                this.badRequestMessage('course', 'deleted'),
            );
    }
}
