import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ReactionRepository } from './reaction.repository';
import { PrismaService } from 'src/db/prisma.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';
import { ReactionDTO, ReactDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReactionService implements ReactionRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
        private readonly postService: PostService,
        private readonly commentService: CommentService,
    ) {}

    private readonly selectReaction = {
        id: true,
        createdAt: true,
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
    };

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.ReactionWhereInput,
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

    async reactUnreact(data: ReactDTO, subjectId: string): Promise<void> {
        const { postId, commentId } = data;
        const subjects = {
            postId: null,
            commentId: null,
            studentId: null,
            collegeId: null,
        };

        if (!postId && !commentId)
            throw new BadRequestException(
                'At least one post or comment ID required.',
            );

        if (postId) {
            const post = await this.postService.getUniquePost({ id: postId });
            subjects.postId = post.id;
        }

        if (commentId) {
            const comment = await this.commentService.getUniqueComment({
                id: commentId,
            });
            subjects.commentId = comment.id;
        }

        const student = await this.studentService.getFirstStudent({
            id: subjectId,
        });
        if (student) subjects.studentId = student.id;

        const college = await this.collegeService.getFirstCollege({
            id: subjectId,
        });
        if (college) subjects.collegeId = college.id;

        if (!student && !college)
            throw new NotFoundException(
                this.notFoundMessage('Student or College', { id: subjectId }),
            );

        try {
            const reactionFound = await this.getFirstReaction({ ...subjects });
            if (reactionFound) {
                await this.prisma.reaction.delete({
                    where: { id: reactionFound.id },
                });
            } else {
                await this.prisma.reaction.create({ data: subjects });
            }
        } catch (err) {
            throw err;
        }
    }

    async checkReaction(data: ReactDTO, subjectId: string): Promise<boolean> {
        const { postId, commentId } = data;
        const subjects = {
            postId: null,
            commentId: null,
            studentId: null,
            collegeId: null,
        };

        if (!postId && !commentId)
            throw new NotFoundException(
                this.notFoundMessage('Post or Comment', { postId, commentId }),
            );

        if (postId) {
            const post = await this.postService.getUniquePost({ id: postId });
            subjects.postId = post.id;
        }

        if (commentId) {
            const comment = await this.commentService.getUniqueComment({
                id: commentId,
            });
            subjects.commentId = comment.id;
        }

        const student = await this.studentService.getFirstStudent({
            id: subjectId,
        });
        if (student) subjects.studentId = student.id;

        const college = await this.collegeService.getFirstCollege({
            id: subjectId,
        });
        if (college) subjects.collegeId = college.id;

        if (!student && !college)
            throw new NotFoundException(
                this.notFoundMessage('Student or College', { id: subjectId }),
            );

        try {
            const reactionFound = await this.getFirstReaction({ ...subjects });
            return reactionFound ? true : false;
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('reaction', 'checked'),
            );
        }
    }

    async getReactionCount(params: {
        where?: Prisma.ReactionWhereInput;
    }): Promise<number> {
        const { where } = params;

        try {
            return await this.prisma.reaction.count({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('reaction(s)', 'counted'),
            );
        }
    }

    async getReactions(params: {
        where?: Prisma.ReactionWhereInput;
    }): Promise<ReactionDTO[]> {
        const { where } = params;

        try {
            return await this.prisma.reaction.findMany({
                where,
                select: this.selectReaction,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('reactions', 'found'),
            );
        }
    }

    async getUniqueReaction(
        where: Prisma.ReactionWhereUniqueInput,
    ): Promise<ReactionDTO> {
        try {
            const reactionFound = await this.prisma.reaction.findUnique({
                where,
                select: this.selectReaction,
            });
            if (!reactionFound) throw this.notFoundMessage('Reaction', where);
            return reactionFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async getFirstReaction(
        where: Prisma.ReactionWhereInput,
    ): Promise<ReactionDTO> {
        return await this.prisma.reaction.findFirst({
            where,
            select: this.selectReaction,
        });
    }
}
