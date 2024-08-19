import { Injectable, ConflictException } from '@nestjs/common';
import { RoutineRepository } from './routine.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CreateRoutineDTO, RoutineDTO, UpdateRoutineDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutineService implements RoutineRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
    ) {}

    private readonly selectRoutine = {
        id: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
        createdAt: true,
        updatedAt: true,
        student: {
            select: {
                id: true,
                name: true,
                email: true,
                birthDate: true,
                course: true,
                active: true,
            },
        },
    };

    async createRoutine(
        data: CreateRoutineDTO,
        studentId: string,
    ): Promise<RoutineDTO> {
        await this.studentService.getUniqueStudent({ id: studentId });

        const routine = await this.getFirstRoutine({ studentId });
        if (routine)
            throw new ConflictException(
                `A routine for the student with id ${studentId} has already been created.`,
            );

        try {
            return await this.prisma.routine.create({
                data: { ...data, studentId },
                select: this.selectRoutine,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('routine', 'created');
        }
    }

    async getRoutines(params: {
        skip?: number;
        take?: number;
        where?: Prisma.RoutineWhereInput;
        orderBy?: Prisma.RoutineOrderByWithRelationInput;
    }): Promise<RoutineDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.routine.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectRoutine,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('routines', 'found');
        }
    }

    async getUniqueRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<RoutineDTO> {
        try {
            const routineFound = await this.prisma.routine.findUnique({
                where,
                select: this.selectRoutine,
            });
            if (!routineFound)
                this.exceptionService.subjectNotFound<Prisma.RoutineWhereUniqueInput>(
                    'Routine',
                    where,
                );
            return routineFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<RoutineDTO> {
        return await this.prisma.routine.findFirst({
            where,
            select: this.selectRoutine,
        });
    }

    async updateRoutine(params: {
        where: Prisma.RoutineWhereUniqueInput;
        data: UpdateRoutineDTO;
    }): Promise<RoutineDTO> {
        const { where, data } = params;

        await this.getUniqueRoutine(where);

        try {
            return await this.prisma.routine.update({
                where,
                data,
                select: this.selectRoutine,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('routine', 'updated');
        }
    }

    async deleteRoutine(where: Prisma.RoutineWhereUniqueInput): Promise<void> {
        await this.getUniqueRoutine(where);

        try {
            await this.prisma.routine.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('routine', 'deleted');
        }
    }
}
