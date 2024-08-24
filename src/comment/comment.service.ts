import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { PostService } from 'src/post/post.service';
import { CommentDTO, CreateCommentDTO, UpdateCommentDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService implements CommentRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
        private readonly postService: PostService,
    ) {}

    private readonly selectComment = {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        postId: true,
        commentId: true,
        student: {
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                course: true,
                active: true,
            },
        },
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
        _count: {
            select: {
                reactions: true,
                comments: true,
            },
        },
    };

    async createComment(
        subjectId: string,
        data: CreateCommentDTO,
    ): Promise<CommentDTO> {
        const { postId, commentId } = data;
        const subject = {
            studentId: null,
            collegeId: null,
        };

        await this.postService.getUniquePost({ id: postId });

        if (commentId) await this.getUniqueComment({ id: commentId });

        const student = await this.studentService.getFirstStudent({
            id: subjectId,
        });
        if (student) subject.studentId = student.id;

        const college = await this.collegeService.getFirstCollege({
            id: subjectId,
        });
        if (college) subject.collegeId = college.id;

        if (!student && !college)
            this.exceptionService.subjectNotFound<Prisma.CommentWhereUniqueInput>(
                'Student or College',
                { id: subjectId },
            );

        try {
            return await this.prisma.comment.create({
                data: { ...data, ...subject },
                select: this.selectComment,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('comment', 'created');
        }
    }

    async getCommentCount(where: Prisma.CommentWhereInput): Promise<number> {
        try {
            return await this.prisma.comment.count({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened(
                'comment count',
                'counted',
            );
        }
    }

    async getComments(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CommentWhereInput;
        orderBy?: Prisma.CommentOrderByWithRelationInput;
    }): Promise<CommentDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.comment.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectComment,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('comments', 'found');
        }
    }

    async getUniqueComment(
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<CommentDTO> {
        try {
            const commentFound = await this.prisma.comment.findUnique({
                where,
                select: this.selectComment,
            });
            if (!commentFound)
                this.exceptionService.subjectNotFound<Prisma.CommentWhereUniqueInput>(
                    'Comment',
                    where,
                );
            return commentFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstComment(
        where: Prisma.CommentWhereInput,
    ): Promise<CommentDTO> {
        return await this.prisma.comment.findFirst({
            where,
            select: this.selectComment,
        });
    }

    async updateComment(
        subjectId: string,
        params: {
            where: Prisma.CommentWhereUniqueInput;
            data: UpdateCommentDTO;
        },
    ): Promise<CommentDTO> {
        const { where, data } = params;

        await this.getUniqueComment({
            ...where,
            OR: [{ studentId: subjectId }, { collegeId: subjectId }],
        });

        try {
            return await this.prisma.comment.update({
                where,
                data,
                select: this.selectComment,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('comment', 'updated');
        }
    }

    async deleteComment(
        subjectId: string,
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<void> {
        await this.getUniqueComment({
            ...where,
            OR: [{ studentId: subjectId }, { collegeId: subjectId }],
        });

        try {
            await this.prisma.comment.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('comment', 'deleted');
        }
    }
}
