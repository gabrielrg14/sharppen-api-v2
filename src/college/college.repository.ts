import {
    CollegeDTO,
    CreateCollegeDTO,
    UpdateCollegeDTO,
    UpdateCollegePasswordDTO,
} from './dto';
import { Prisma } from '@prisma/client';

export abstract class CollegeRepository {
    abstract createCollege(data: CreateCollegeDTO): Promise<CollegeDTO>;

    abstract getColleges(params: {
        skip?: number;
        take?: number;
        where?: Prisma.CollegeWhereInput;
        orderBy?: Prisma.CollegeOrderByWithRelationInput;
    }): Promise<CollegeDTO[]>;

    abstract getCollege(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegeDTO>;

    abstract updateCollege(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegeDTO;
    }): Promise<CollegeDTO>;

    abstract updateCollegePassword(params: {
        where: Prisma.CollegeWhereUniqueInput;
        data: UpdateCollegePasswordDTO;
    }): Promise<CollegeDTO>;

    abstract changeCollegeState(params: {
        where: Prisma.CollegeWhereUniqueInput;
        active: boolean;
    }): Promise<CollegeDTO>;

    abstract deleteCollege(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<void>;
}
