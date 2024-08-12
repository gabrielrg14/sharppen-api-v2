import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PrismaService } from 'src/db/prisma.service';
import { CreatePostDTO, PostDTO, UpdatePostDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService implements PostRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly selectPost = {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        college: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                active: true,
            },
        },
        _count: {
            select: {
                reactions: true,
                comments: true,
            },
        },
    };

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.PostWhereUniqueInput,
    ): string => {
        return `${subject} with ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };

    async createPost(data: CreatePostDTO, collegeId: string): Promise<PostDTO> {
        const college = await this.prisma.college.findUnique({
            where: { id: collegeId },
        });
        if (!college)
            throw new NotFoundException(
                this.notFoundMessage('College', { id: collegeId }),
            );

        try {
            return await this.prisma.post.create({
                data: { ...data, collegeId },
                select: this.selectPost,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('post', 'created'),
            );
        }
    }

    async getPosts(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput;
    }): Promise<PostDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.post.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectPost,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('posts', 'found'),
            );
        }
    }

    async getPost(where: Prisma.PostWhereUniqueInput): Promise<PostDTO> {
        try {
            const postFound = await this.prisma.post.findUnique({
                where,
                select: this.selectPost,
            });
            if (!postFound) throw this.notFoundMessage('Post', where);
            return postFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async updatePost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: UpdatePostDTO;
    }): Promise<PostDTO> {
        const { where, data } = params;

        await this.getPost(where);

        try {
            return await this.prisma.post.update({
                where,
                data,
                select: this.selectPost,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('post', 'updated'),
            );
        }
    }

    async deletePost(where: Prisma.PostWhereUniqueInput): Promise<void> {
        await this.getPost(where);

        try {
            await this.prisma.post.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('post', 'deleted'),
            );
        }
    }
}
