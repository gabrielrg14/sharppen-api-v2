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
import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostDTO, PostQueryParams, CreatePostDTO, UpdatePostDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseGuards(AuthGuard)
    createPost(
        @Body() postData: CreatePostDTO,
        @Request() req: RequestTokenDTO,
    ): Promise<PostDTO> {
        return this.postService.createPost(postData, req.token?.sub);
    }

    @Get()
    getAllPosts(@Query() query: PostQueryParams): Promise<PostDTO[]> {
        const where: Prisma.PostWhereInput = {};

        if (query.collegeId) where.collegeId = query.collegeId;

        return this.postService.getPosts({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    @Get('/:uuid')
    getPostById(
        @Param('uuid', ParseUUIDPipe) postId: string,
    ): Promise<PostDTO> {
        return this.postService.getPost({ id: postId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updatePostById(
        @Param('uuid', ParseUUIDPipe) postId: string,
        @Body() postData: UpdatePostDTO,
    ): Promise<PostDTO> {
        return this.postService.updatePost({
            where: { id: postId },
            data: postData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deletePostById(
        @Param('uuid', ParseUUIDPipe) postId: string,
    ): Promise<void> {
        return this.postService.deletePost({ id: postId });
    }
}
