import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Param,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoutineDTO, CreateRoutineDTO, UpdateRoutineDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';

@Controller('routine')
export class RoutineController {
    constructor(private readonly routineService: RoutineService) {}

    @Post()
    @UseGuards(AuthGuard)
    createRoutine(
        @Request() req: RequestTokenDTO,
        @Body() routineData: CreateRoutineDTO,
    ): Promise<RoutineDTO> {
        return this.routineService.createRoutine(req.token.sub, routineData);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllRoutines(): Promise<RoutineDTO[]> {
        return this.routineService.getRoutines({
            orderBy: { createdAt: 'asc' },
        });
    }

    @Get('/student/:uuid')
    getRoutineByStudentId(
        @Param('uuid', ParseUUIDPipe) studentId: string,
    ): Promise<RoutineDTO> {
        return this.routineService.getUniqueRoutine({ studentId });
    }

    @Get('/:uuid')
    getRoutineById(
        @Param('uuid', ParseUUIDPipe) routineId: string,
    ): Promise<RoutineDTO> {
        return this.routineService.getUniqueRoutine({ id: routineId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateRoutineById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) routineId: string,
        @Body() routineData: UpdateRoutineDTO,
    ): Promise<RoutineDTO> {
        return this.routineService.updateRoutine(req.token.sub, {
            where: { id: routineId },
            data: routineData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteRoutineById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) routineId: string,
    ): Promise<void> {
        return this.routineService.deleteRoutine(req.token.sub, {
            id: routineId,
        });
    }
}
