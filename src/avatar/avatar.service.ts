import {
    Injectable,
    InternalServerErrorException,
    StreamableFile,
} from '@nestjs/common';
import { AvatarRepository } from './avatar.repository';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { createClient } from '@supabase/supabase-js';
import { AvatarDTO, UploadAvatarDTO } from './dto';
import { createReadStream } from 'fs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AvatarService implements AvatarRepository {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
    ) {}

    private readonly supabase = createClient(
        this.configService.get<string>('SUPABASE_URL'),
        this.configService.get<string>('SUPABASE_KEY'),
        { auth: { persistSession: false } },
    );

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

    async uploadAvatarFile(
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
            await this.supabase.storage
                .from('sharppen')
                .upload(file.originalname, file.buffer, { upsert: true });

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

    async getUniqueAvatar(
        where: Prisma.AvatarWhereUniqueInput,
    ): Promise<AvatarDTO> {
        try {
            const avatarFound = await this.prisma.avatar.findUnique({
                where,
                select: this.selectAvatar,
            });
            if (!avatarFound)
                this.exceptionService.subjectNotFound<Prisma.AvatarWhereUniqueInput>(
                    'Avatar',
                    where,
                );
            return avatarFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstAvatar(where: Prisma.AvatarWhereInput): Promise<AvatarDTO> {
        return await this.prisma.avatar.findFirst({
            where,
            select: this.selectAvatar,
        });
    }

    async getAvatarFile(
        where: Prisma.AvatarWhereUniqueInput,
    ): Promise<StreamableFile> {
        const avatar = await this.getUniqueAvatar(where);

        try {
            const file = createReadStream(avatar.path);
            return new StreamableFile(file, {
                type: avatar.mimetype,
                disposition: `attachment; filename="${avatar.originalname}"`,
            });
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }
}
