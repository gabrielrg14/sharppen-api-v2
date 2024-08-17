import { RoutineDTO, CreateRoutineDTO, UpdateRoutineDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class RoutineRepository {
    abstract createRoutine(
        data: CreateRoutineDTO,
        studentId: string,
    ): Promise<RoutineDTO>;

    abstract getRoutines(params: {
        skip?: number;
        take?: number;
        where?: Prisma.RoutineWhereInput;
        orderBy?: Prisma.RoutineOrderByWithRelationInput;
    }): Promise<RoutineDTO[]>;

    abstract getUniqueRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<RoutineDTO>;

    abstract getFirstRoutine(
        where: Prisma.RoutineWhereInput,
    ): Promise<RoutineDTO>;

    abstract updateRoutine(params: {
        where: Prisma.RoutineWhereUniqueInput;
        data: UpdateRoutineDTO;
    }): Promise<RoutineDTO>;

    abstract deleteRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<void>;
}
