import { CommentDTO, CreateCommentDTO, UpdateCommentDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class CommentRepository {
    abstract createComment(
        subjectId: string,
        data: CreateCommentDTO,
    ): Promise<CommentDTO>;

    abstract getCommentCount(where: Prisma.CommentWhereInput): Promise<number>;

    abstract getComments(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CommentWhereInput;
        orderBy?: Prisma.CommentOrderByWithRelationInput;
    }): Promise<CommentDTO[]>;

    abstract getUniqueComment(
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<CommentDTO>;

    abstract getFirstComment(
        where: Prisma.CommentWhereInput,
    ): Promise<CommentDTO>;

    abstract updateComment(
        subjectId: string,
        params: {
            where: Prisma.CommentWhereUniqueInput;
            data: UpdateCommentDTO;
        },
    ): Promise<CommentDTO>;

    abstract deleteComment(
        subjectId: string,
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<void>;
}
