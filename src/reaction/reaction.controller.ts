import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    Body,
    Request,
    Query,
    Param,
    Post,
    Get,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReactionDTO, ReactionQueryParams, ReactDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('reaction')
export class ReactionController {
    constructor(private readonly reactionService: ReactionService) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    reactOrUnreact(
        @Request() req: RequestTokenDTO,
        @Body() reactData: ReactDTO,
    ): Promise<void> {
        return this.reactionService.reactUnreact(req.token.sub, reactData);
    }

    @Get('/check')
    @UseGuards(AuthGuard)
    checkIfReacting(
        @Request() req: RequestTokenDTO,
        @Body() reactData: ReactDTO,
    ): Promise<boolean> {
        return this.reactionService.checkReaction(req.token.sub, reactData);
    }

    @Get('/count')
    getReactionCount(@Query() query: ReactionQueryParams): Promise<number> {
        const where: Prisma.ReactionWhereInput = {};

        if (query.postId) where.postId = query.postId;
        if (query.commentId) where.commentId = query.commentId;
        if (query.studentId) where.studentId = query.studentId;
        if (query.collegeId) where.collegeId = query.collegeId;

        return this.reactionService.getReactionCount(where);
    }

    @Get()
    getReactions(@Query() query: ReactionQueryParams): Promise<ReactionDTO[]> {
        const where: Prisma.ReactionWhereInput = {};

        if (query.postId) where.postId = query.postId;
        if (query.commentId) where.commentId = query.commentId;
        if (query.studentId) where.studentId = query.studentId;
        if (query.collegeId) where.collegeId = query.collegeId;

        return this.reactionService.getReactions({ where });
    }

    @Get('/:uuid')
    @UseGuards(AuthGuard)
    getReactionById(
        @Param('uuid', ParseUUIDPipe) reactionId: string,
    ): Promise<ReactionDTO> {
        return this.reactionService.getUniqueReaction({ id: reactionId });
    }
}
