import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { CollegeService } from 'src/college/college.service';
import { PostDTO, CreatePostDTO, UpdatePostDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService implements PostRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly collegeService: CollegeService,
    ) {}

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

    async createPost(collegeId: string, data: CreatePostDTO): Promise<PostDTO> {
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            return await this.prisma.post.create({
                data: { ...data, collegeId },
                select: this.selectPost,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('post', 'created');
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
            this.exceptionService.somethingBadHappened('posts', 'found');
        }
    }

    async getUniquePost(where: Prisma.PostWhereUniqueInput): Promise<PostDTO> {
        try {
            const postFound = await this.prisma.post.findUnique({
                where,
                select: this.selectPost,
            });
            if (!postFound)
                this.exceptionService.subjectNotFound<Prisma.PostWhereUniqueInput>(
                    'Post',
                    where,
                );
            return postFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstPost(where: Prisma.PostWhereInput): Promise<PostDTO> {
        return await this.prisma.post.findFirst({
            where,
            select: this.selectPost,
        });
    }

    async updatePost(
        collegeId: string,
        params: {
            where: Prisma.PostWhereUniqueInput;
            data: UpdatePostDTO;
        },
    ): Promise<PostDTO> {
        const { where, data } = params;

        await this.getUniquePost({ ...where, collegeId });

        try {
            return await this.prisma.post.update({
                where,
                data,
                select: this.selectPost,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('post', 'updated');
        }
    }

    async deletePost(
        collegeId: string,
        where: Prisma.PostWhereUniqueInput,
    ): Promise<void> {
        await this.getUniquePost({ ...where, collegeId });

        try {
            await this.prisma.post.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('post', 'deleted');
        }
    }
}
