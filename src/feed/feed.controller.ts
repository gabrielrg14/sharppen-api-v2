import { Controller, UseGuards, Request, Get } from '@nestjs/common';
import { FeedService } from './feed.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FeedPostDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) {}

    @Get()
    @UseGuards(AuthGuard)
    getStudentFeed(@Request() req: RequestTokenDTO): Promise<FeedPostDTO[]> {
        return this.feedService.getStudentPostFeed(req.token?.sub);
    }
}
