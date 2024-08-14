import { ReactionDTO, ReactDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class ReactionRepository {
    abstract reactUnreact(data: ReactDTO): Promise<void>;

    abstract checkReaction(data: ReactDTO): Promise<boolean>;

    abstract getReactionCount(params: {
        where?: Prisma.ReactionWhereInput;
    }): Promise<number>;

    abstract getReactions(params: {
        where?: Prisma.ReactionWhereInput;
    }): Promise<ReactionDTO[]>;

    abstract getReaction(
        where: Prisma.ReactionWhereUniqueInput,
    ): Promise<ReactionDTO>;
}
