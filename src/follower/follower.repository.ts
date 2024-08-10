import { FollowerDTO, FollowDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class FollowerRepository {
    abstract followUnfollow(data: FollowDTO): Promise<void>;

    abstract checkFollower(data: FollowDTO): Promise<boolean>;

    abstract getFollowers(params: {
        where?: Prisma.FollowerWhereInput;
    }): Promise<FollowerDTO[]>;

    abstract getFollower(
        where: Prisma.FollowerWhereUniqueInput,
    ): Promise<FollowerDTO>;
}
