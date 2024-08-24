import { CourseDTO, CreateCourseDTO, UpdateCourseDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class CourseRepository {
    abstract createCourse(
        collegeId: string,
        data: CreateCourseDTO,
    ): Promise<CourseDTO>;

    abstract getCourses(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CourseWhereInput;
        orderBy?: Prisma.CourseOrderByWithRelationInput;
    }): Promise<CourseDTO[]>;

    abstract getUniqueCourse(
        where: Prisma.CourseWhereUniqueInput,
    ): Promise<CourseDTO>;

    abstract getFirstCourse(where: Prisma.CourseWhereInput): Promise<CourseDTO>;

    abstract updateCourse(
        collegeId: string,
        params: {
            where: Prisma.CourseWhereUniqueInput;
            data: UpdateCourseDTO;
        },
    ): Promise<CourseDTO>;

    abstract deleteCourse(
        collegeId: string,
        where: Prisma.CourseWhereUniqueInput,
    ): Promise<void>;
}
