import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    Request,
    Query,
    Param,
    Post,
    Get,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FollowerDTO, FollowerQueryParams } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('follower')
export class FollowerController {
    constructor(private readonly followerService: FollowerService) {}

    @Post('/:uuid')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    followOrUnfollow(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
        @Request() req: RequestTokenDTO,
    ): Promise<void> {
        return this.followerService.followUnfollow(req.token?.sub, collegeId);
    }

    @Get('/check/:uuid')
    @UseGuards(AuthGuard)
    checkIfFollowing(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
        @Request() req: RequestTokenDTO,
    ): Promise<boolean> {
        return this.followerService.checkFollower(req.token?.sub, collegeId);
    }

    @Get()
    getFollowers(@Query() query: FollowerQueryParams): Promise<FollowerDTO[]> {
        const where: Prisma.FollowerWhereInput = {};

        if (query.studentId) where.studentId = query.studentId;
        if (query.collegeId) where.collegeId = query.collegeId;

        return this.followerService.getFollowers({
            where,
        });
    }

    @Get('/:uuid')
    @UseGuards(AuthGuard)
    getFollowerById(
        @Param('uuid', ParseUUIDPipe) followerId: string,
    ): Promise<FollowerDTO> {
        return this.followerService.getFollower({ id: followerId });
    }
}
