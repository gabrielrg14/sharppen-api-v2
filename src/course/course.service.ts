import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { CollegeService } from 'src/college/college.service';
import { CourseDTO, CreateCourseDTO, UpdateCourseDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService implements CourseRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
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

    async createCourse(
        collegeId: string,
        data: CreateCourseDTO,
    ): Promise<CourseDTO> {
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            return await this.prisma.course.create({
                data: { ...data, collegeId },
                select: this.selectCourse,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('course', 'created');
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
            this.exceptionService.somethingBadHappened('courses', 'found');
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
            if (!courseFound)
                this.exceptionService.subjectNotFound<Prisma.CourseWhereUniqueInput>(
                    'Course',
                    where,
                );
            return courseFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstCourse(where: Prisma.CourseWhereInput): Promise<CourseDTO> {
        return await this.prisma.course.findFirst({
            where,
            select: this.selectCourse,
        });
    }

    async updateCourse(
        collegeId: string,
        params: {
            where: Prisma.CourseWhereUniqueInput;
            data: UpdateCourseDTO;
        },
    ): Promise<CourseDTO> {
        const { where, data } = params;

        await this.getUniqueCourse({ ...where, collegeId });

        try {
            return await this.prisma.course.update({
                where,
                data,
                select: this.selectCourse,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('course', 'updated');
        }
    }

    async deleteCourse(
        collegeId: string,
        where: Prisma.CourseWhereUniqueInput,
    ): Promise<void> {
        await this.getUniqueCourse({ ...where, collegeId });

        try {
            await this.prisma.course.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('course', 'deleted');
        }
    }
}
