import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Param,
    Query,
    Post,
    Get,
    Put,
    Patch,
    Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    StudentDTO,
    StudentQueryParams,
    CreateStudentDTO,
    UpdateStudentDTO,
    UpdateStudentPasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post()
    createStudent(@Body() studentData: CreateStudentDTO): Promise<StudentDTO> {
        return this.studentService.createStudent(studentData);
    }

    @Get()
    getAllStudents(@Query() query: StudentQueryParams): Promise<StudentDTO[]> {
        const where: Prisma.StudentWhereInput = { active: true };

        if (query.search)
            where.OR = [
                {
                    name: { contains: query.search },
                    email: { contains: query.search },
                    course: { contains: query.search },
                },
            ];

        return this.studentService.getStudents({
            where,
            orderBy: { name: 'asc' },
        });
    }

    @Get('/:uuid')
    getStudentById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
    ): Promise<StudentDTO> {
        return this.studentService.getUniqueStudent({ id: studentId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateStudentById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
        @Body() studentData: UpdateStudentDTO,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudent({
            where: { id: studentId },
            data: studentData,
        });
    }

    @Patch('/:uuid/password')
    @UseGuards(AuthGuard)
    updateStudentPasswordById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
        @Body() studentData: UpdateStudentPasswordDTO,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudentPassword({
            where: { id: studentId },
            data: studentData,
        });
    }

    @Patch('/:uuid/deactivate')
    @UseGuards(AuthGuard)
    deactivateStudentById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudent({
            where: { id: studentId },
            data: { active: false },
        });
    }

    @Patch('/:uuid/reactivate')
    @UseGuards(AuthGuard)
    reactivateStudentById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudent({
            where: { id: studentId },
            data: { active: true },
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteStudentById(
        @Param('uuid', ParseUUIDPipe) studentId: string,
    ): Promise<void> {
        return this.studentService.deleteStudent({ id: studentId });
    }
}
