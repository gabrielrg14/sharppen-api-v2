import {
    CollegeDTO,
    CollegePasswordDTO,
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

    abstract getUniqueCollege(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegeDTO>;

    abstract getFirstCollege(
        where: Prisma.CollegeWhereInput,
    ): Promise<CollegeDTO>;

    abstract getCollegePassword(
        where: Prisma.CollegeWhereUniqueInput,
    ): Promise<CollegePasswordDTO>;

    abstract updateCollege(
        collegeId: string,
        data: UpdateCollegeDTO,
    ): Promise<CollegeDTO>;

    abstract updateCollegePassword(
        collegeId: string,
        data: UpdateCollegePasswordDTO,
    ): Promise<CollegeDTO>;

    abstract deleteCollege(collegeId: string): Promise<void>;
}
