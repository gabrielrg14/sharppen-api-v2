import { CourseDTO, CreateCourseDTO, UpdateCourseDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class CourseRepository {
    abstract createCourse(
        data: CreateCourseDTO,
        collegeId: string,
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

    abstract updateCourse(params: {
        where: Prisma.CourseWhereUniqueInput;
        data: UpdateCourseDTO;
    }): Promise<CourseDTO>;

    abstract deleteCourse(where: Prisma.CourseWhereUniqueInput): Promise<void>;
}
