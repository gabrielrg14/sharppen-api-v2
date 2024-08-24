import { PostDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class PostRepository {
    abstract createPost(
        collegeId: string,
        data: CreatePostDTO,
    ): Promise<PostDTO>;

    abstract getPosts(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<PostDTO[]>;

    abstract getUniquePost(
        where: Prisma.PostWhereUniqueInput,
    ): Promise<PostDTO>;

    abstract getFirstPost(where: Prisma.PostWhereInput): Promise<PostDTO>;

    abstract updatePost(
        collegeId: string,
        params: {
            where: Prisma.PostWhereUniqueInput;
            data: UpdatePostDTO;
        },
    ): Promise<PostDTO>;

    abstract deletePost(
        collegeId: string,
        where: Prisma.PostWhereUniqueInput,
    ): Promise<void>;
}
