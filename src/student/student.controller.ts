import {
    Controller,
    UseGuards,
    UseInterceptors,
    ParseUUIDPipe,
    Body,
    Request,
    UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import {
    StudentDTO,
    StudentQueryParams,
    CreateStudentDTO,
    UpdateStudentDTO,
    UpdateStudentPasswordDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
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

    @Put()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    updateStudent(
        @Request() req: RequestTokenDTO,
        @Body() studentData: UpdateStudentDTO,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudent(req.token.sub, studentData);
    }

    @Patch('/password')
    @UseGuards(AuthGuard)
    updateStudentPassword(
        @Request() req: RequestTokenDTO,
        @Body() studentData: UpdateStudentPasswordDTO,
    ): Promise<StudentDTO> {
        return this.studentService.updateStudentPassword(
            req.token.sub,
            studentData,
        );
    }

    @Patch('/deactivate')
    @UseGuards(AuthGuard)
    deactivateStudent(@Request() req: RequestTokenDTO): Promise<StudentDTO> {
        return this.studentService.updateStudent(req.token.sub, {
            active: false,
        });
    }

    @Patch('/reactivate')
    @UseGuards(AuthGuard)
    reactivateStudent(@Request() req: RequestTokenDTO): Promise<StudentDTO> {
        return this.studentService.updateStudent(req.token.sub, {
            active: true,
        });
    }

    @Delete()
    @UseGuards(AuthGuard)
    deleteStudent(@Request() req: RequestTokenDTO): Promise<void> {
        return this.studentService.deleteStudent(req.token.sub);
    }
}
