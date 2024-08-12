import { PostDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class PostRepository {
    abstract createPost(
        data: CreatePostDTO,
        collegeId: string,
    ): Promise<PostDTO>;

    abstract getPosts(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<PostDTO[]>;

    abstract getPost(where: Prisma.PostWhereUniqueInput): Promise<PostDTO>;

    abstract updatePost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: UpdatePostDTO;
    }): Promise<PostDTO>;

    abstract deletePost(where: Prisma.PostWhereUniqueInput): Promise<void>;
}
