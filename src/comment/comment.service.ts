import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { PrismaService } from 'src/db/prisma.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { PostService } from 'src/post/post.service';
import { CreateCommentDTO, CommentDTO, UpdateCommentDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService implements CommentRepository {
    constructor(
        private readonly prisma: PrismaService,
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

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.CommentWhereInput,
    ): string => {
        return `${subject} with ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };

    async createComment(
        data: CreateCommentDTO,
        subjectId: string,
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
            throw new NotFoundException(
                this.notFoundMessage('Student or College', { id: subjectId }),
            );

        try {
            return await this.prisma.comment.create({
                data: { ...data, ...subject },
                select: this.selectComment,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('comment', 'created'),
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
            throw new InternalServerErrorException(
                this.errorMessage('comments', 'found'),
            );
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
            if (!commentFound) throw this.notFoundMessage('Comment', where);
            return commentFound;
        } catch (err) {
            throw new NotFoundException(err);
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

    async updateComment(params: {
        where: Prisma.CommentWhereUniqueInput;
        data: UpdateCommentDTO;
    }): Promise<CommentDTO> {
        const { where, data } = params;

        await this.getUniqueComment(where);

        try {
            return await this.prisma.comment.update({
                where,
                data,
                select: this.selectComment,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('comment', 'updated'),
            );
        }
    }

    async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<void> {
        await this.getUniqueComment(where);

        try {
            await this.prisma.comment.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('comment', 'deleted'),
            );
        }
    }
}
