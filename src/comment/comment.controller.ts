import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Query,
    Param,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    CommentDTO,
    CommentQueryParams,
    CreateCommentDTO,
    UpdateCommentDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(AuthGuard)
    createComment(
        @Body() commentData: CreateCommentDTO,
        @Request() req: RequestTokenDTO,
    ): Promise<CommentDTO> {
        return this.commentService.createComment(commentData, req.token?.sub);
    }

    @Get()
    getAllComments(@Query() query: CommentQueryParams): Promise<CommentDTO[]> {
        const where: Prisma.CommentWhereInput = {};

        if (query.postId) {
            where.postId = query.postId;
            where.commentId = null; // does not get related comments
        }
        if (query.commentId) where.commentId = query.commentId;
        if (query.studentId) where.studentId = query.studentId;
        if (query.collegeId) where.collegeId = query.collegeId;

        return this.commentService.getComments({
            where,
            orderBy: { createdAt: 'asc' },
        });
    }

    @Get('/:uuid')
    getCommentById(
        @Param('uuid', ParseUUIDPipe) commentId: string,
    ): Promise<CommentDTO> {
        return this.commentService.getUniqueComment({ id: commentId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateCommentById(
        @Param('uuid', ParseUUIDPipe) commentId: string,
        @Body() commentData: UpdateCommentDTO,
    ): Promise<CommentDTO> {
        return this.commentService.updateComment({
            where: { id: commentId },
            data: commentData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteCommentById(
        @Param('uuid', ParseUUIDPipe) commentId: string,
    ): Promise<void> {
        return this.commentService.deleteComment({ id: commentId });
    }
}
