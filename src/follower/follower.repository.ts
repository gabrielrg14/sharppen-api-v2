import { FollowerDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class FollowerRepository {
    abstract followUnfollow(
        studentId: string,
        collegeId: string,
    ): Promise<void>;

    abstract checkFollower(
        studentId: string,
        collegeId: string,
    ): Promise<boolean>;

    abstract getFollowers(params: {
        where?: Prisma.FollowerWhereInput;
    }): Promise<FollowerDTO[]>;

    abstract getUniqueFollower(
        where: Prisma.FollowerWhereUniqueInput,
    ): Promise<FollowerDTO>;

    abstract getFirstFollower(
        where: Prisma.FollowerWhereInput,
    ): Promise<FollowerDTO>;
}
