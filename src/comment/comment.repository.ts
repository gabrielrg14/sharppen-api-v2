import { CommentDTO, CreateCommentDTO, UpdateCommentDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class CommentRepository {
    abstract createComment(
        data: CreateCommentDTO,
        subjectId: string,
    ): Promise<CommentDTO>;

    abstract getComments(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CommentWhereInput;
        orderBy?: Prisma.CommentOrderByWithRelationInput;
    }): Promise<CommentDTO[]>;

    abstract getComment(
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<CommentDTO>;

    abstract updateComment(params: {
        where: Prisma.CommentWhereUniqueInput;
        data: UpdateCommentDTO;
    }): Promise<CommentDTO>;

    abstract deleteComment(
        where: Prisma.CommentWhereUniqueInput,
    ): Promise<void>;
}
