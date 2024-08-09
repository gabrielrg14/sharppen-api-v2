import {
    Injectable,
    ConflictException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { RoutineRepository } from './routine.repository';
import { PrismaService } from 'src/db/prisma.service';
import { CreateRoutineDTO, RoutineDTO, UpdateRoutineDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutineService implements RoutineRepository {
    constructor(private readonly prisma: PrismaService) {}

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

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.RoutineWhereUniqueInput,
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

    async createRoutine(
        data: CreateRoutineDTO,
        studentId: string,
    ): Promise<RoutineDTO> {
        const routine = await this.prisma.routine.findUnique({
            where: { studentId },
        });
        if (routine)
            throw new ConflictException(
                `A routine for the student with id ${studentId} has already been created.`,
            );

        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
        });
        if (!student)
            throw new NotFoundException(
                this.notFoundMessage('Student', { id: studentId }),
            );

        try {
            return await this.prisma.routine.create({
                data: { ...data, studentId },
                select: this.selectRoutine,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('routine', 'created'),
            );
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
            throw new InternalServerErrorException(
                this.errorMessage('routines', 'found'),
            );
        }
    }

    async getRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<RoutineDTO> {
        try {
            const routineFound = await this.prisma.routine.findUnique({
                where,
                select: this.selectRoutine,
            });
            if (!routineFound) throw this.notFoundMessage('Routine', where);
            return routineFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async updateRoutine(params: {
        where: Prisma.RoutineWhereUniqueInput;
        data: UpdateRoutineDTO;
    }): Promise<RoutineDTO> {
        const { where, data } = params;

        await this.getRoutine(where);

        try {
            return await this.prisma.routine.update({
                where,
                data,
                select: this.selectRoutine,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('routine', 'updated'),
            );
        }
    }

    async deleteRoutine(where: Prisma.RoutineWhereUniqueInput): Promise<void> {
        await this.getRoutine(where);

        try {
            await this.prisma.routine.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('routine', 'deleted'),
            );
        }
    }
}
