import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
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

    private readonly badRequestMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };
    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.RoutineWhereUniqueInput,
    ): string => {
        return `${subject} ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
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

        const createdRoutine = await this.prisma.routine.create({
            data: { ...data, studentId },
            select: this.selectRoutine,
        });
        if (!createdRoutine)
            throw new BadRequestException(
                this.badRequestMessage('routine', 'created'),
            );

        return createdRoutine;
    }

    async getRoutines(params: {
        skip?: number;
        take?: number;
        where?: Prisma.RoutineWhereInput;
        orderBy?: Prisma.RoutineOrderByWithRelationInput;
    }): Promise<RoutineDTO[]> {
        const { skip, take, where, orderBy } = params;

        const routinesFound = await this.prisma.routine.findMany({
            skip,
            take,
            where,
            orderBy,
            select: this.selectRoutine,
        });
        if (!routinesFound)
            throw new BadRequestException(
                this.badRequestMessage('routines', 'found'),
            );

        return routinesFound;
    }

    async getRoutine(
        where: Prisma.RoutineWhereUniqueInput,
    ): Promise<RoutineDTO> {
        const routineFound = await this.prisma.routine.findUnique({
            where,
            select: this.selectRoutine,
        });
        if (!routineFound)
            throw new NotFoundException(this.notFoundMessage('Routine', where));
        return routineFound;
    }

    async updateRoutine(params: {
        where: Prisma.RoutineWhereUniqueInput;
        data: UpdateRoutineDTO;
    }): Promise<RoutineDTO> {
        const { where, data } = params;

        await this.getRoutine(where);

        const updatedRoutine = await this.prisma.routine.update({
            where,
            data,
            select: this.selectRoutine,
        });
        if (!updatedRoutine)
            throw new BadRequestException(
                this.badRequestMessage('routine', 'updated'),
            );

        return updatedRoutine;
    }

    async deleteRoutine(where: Prisma.RoutineWhereUniqueInput): Promise<void> {
        await this.getRoutine(where);
        const deletedRoutine = await this.prisma.routine.delete({ where });
        if (!deletedRoutine)
            throw new BadRequestException(
                this.badRequestMessage('routine', 'deleted'),
            );
    }
}
