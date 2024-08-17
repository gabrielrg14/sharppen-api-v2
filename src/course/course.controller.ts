import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Query,
    Param,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    CourseDTO,
    CourseQueryParams,
    CreateCourseDTO,
    UpdateCourseDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    @UseGuards(AuthGuard)
    createCourse(
        @Body() courseData: CreateCourseDTO,
        @Request() req: RequestTokenDTO,
    ): Promise<CourseDTO> {
        return this.courseService.createCourse(courseData, req.token?.sub);
    }

    @Get()
    getAllCourses(@Query() query: CourseQueryParams): Promise<CourseDTO[]> {
        const where: Prisma.CourseWhereInput = {};

        if (query.collegeId) where.collegeId = query.collegeId;

        return this.courseService.getCourses({
            where,
            orderBy: { name: 'asc' },
        });
    }

    @Get('/:uuid')
    getCourseById(
        @Param('uuid', ParseUUIDPipe) courseId: string,
    ): Promise<CourseDTO> {
        return this.courseService.getUniqueCourse({ id: courseId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateCourseById(
        @Param('uuid', ParseUUIDPipe) courseId: string,
        @Body() courseData: UpdateCourseDTO,
    ): Promise<CourseDTO> {
        return this.courseService.updateCourse({
            where: { id: courseId },
            data: courseData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteCourseById(
        @Param('uuid', ParseUUIDPipe) courseId: string,
    ): Promise<void> {
        return this.courseService.deleteCourse({ id: courseId });
    }
}
