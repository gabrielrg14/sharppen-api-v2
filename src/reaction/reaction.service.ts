import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ReactionRepository } from './reaction.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ReactionDTO, ReactDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReactionService implements ReactionRepository {
    constructor(private readonly prisma: PrismaService) {}

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
        where: Prisma.ReactionWhereUniqueInput,
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

    async reactUnreact(data: ReactDTO): Promise<void> {
        const { postId, commentId, studentId, collegeId } = data;

        if (postId) {
            const post = await this.prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post)
                throw new NotFoundException(
                    this.notFoundMessage('Post', { id: postId }),
                );
        }

        if (commentId) {
            const comment = await this.prisma.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment)
                throw new NotFoundException(
                    this.notFoundMessage('Comment', { id: commentId }),
                );
        }

        if (studentId) {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
            });
            if (!student)
                throw new NotFoundException(
                    this.notFoundMessage('Student', { id: studentId }),
                );
        }

        if (collegeId) {
            const college = await this.prisma.college.findUnique({
                where: { id: collegeId },
            });
            if (!college)
                throw new NotFoundException(
                    this.notFoundMessage('College', { id: collegeId }),
                );
        }

        try {
            const reactionFound = await this.prisma.reaction.findFirst({
                where: { postId, commentId, studentId, collegeId },
            });

            if (reactionFound) {
                await this.prisma.reaction.delete({
                    where: { id: reactionFound.id },
                });
            } else {
                await this.prisma.reaction.create({ data });
            }
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async checkReaction(data: ReactDTO): Promise<boolean> {
        const { postId, commentId, studentId, collegeId } = data;

        if (postId) {
            const post = await this.prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post)
                throw new NotFoundException(
                    this.notFoundMessage('Post', { id: postId }),
                );
        }

        if (commentId) {
            const comment = await this.prisma.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment)
                throw new NotFoundException(
                    this.notFoundMessage('Comment', { id: commentId }),
                );
        }

        if (studentId) {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
            });
            if (!student)
                throw new NotFoundException(
                    this.notFoundMessage('Student', { id: studentId }),
                );
        }

        if (collegeId) {
            const college = await this.prisma.college.findUnique({
                where: { id: collegeId },
            });
            if (!college)
                throw new NotFoundException(
                    this.notFoundMessage('College', { id: collegeId }),
                );
        }

        try {
            const reactionFound = await this.prisma.reaction.findFirst({
                where: { postId, commentId, studentId, collegeId },
            });
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

    async getReaction(
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
}
