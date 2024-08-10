import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    Body,
    Query,
    Param,
    Post,
    Get,
} from '@nestjs/common';
import { FollowerService } from './follower.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FollowerDTO, FollowerQueryParams, FollowDTO } from './dto';
import { Prisma } from '@prisma/client';

@Controller('follower')
export class FollowerController {
    constructor(private readonly followerService: FollowerService) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    followOrUnfollow(@Body() followData: FollowDTO): Promise<void> {
        return this.followerService.followUnfollow(followData);
    }

    @Get('/check')
    @UseGuards(AuthGuard)
    checkIfFollowing(@Body() followData: FollowDTO): Promise<boolean> {
        return this.followerService.checkFollower(followData);
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
