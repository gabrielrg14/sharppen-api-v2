import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AvatarRepository } from './avatar.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { AvatarDTO, UploadAvatarDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AvatarService implements AvatarRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
    ) {}

    private readonly selectAvatar = {
        id: true,
        fieldname: true,
        filename: true,
        originalname: true,
        mimetype: true,
        encoding: true,
        destination: true,
        path: true,
        size: true,
        createdAt: true,
        updatedAt: true,
        studentId: true,
        collegeId: true,
    };

    async uploadAvatar(
        subjectId: string,
        file: UploadAvatarDTO,
    ): Promise<AvatarDTO> {
        const subject = { studentId: null, collegeId: null };

        const student = await this.studentService.getFirstStudent({
            id: subjectId,
        });
        if (student) subject.studentId = student.id;

        const college = await this.collegeService.getFirstCollege({
            id: subjectId,
        });
        if (college) subject.collegeId = college.id;

        if (!student && !college)
            this.exceptionService.subjectNotFound<Prisma.AvatarWhereUniqueInput>(
                'Student or College',
                { id: subjectId },
            );

        try {
            return await this.prisma.avatar.upsert({
                where: subject.studentId
                    ? { studentId: subject.studentId }
                    : { collegeId: subject.collegeId },
                create: { ...file, ...subject },
                update: { ...file },
                select: this.selectAvatar,
            });
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }
}
