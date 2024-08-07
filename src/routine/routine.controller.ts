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
        @Body() routineData: CreateRoutineDTO,
        @Request() req: RequestTokenDTO,
    ): Promise<RoutineDTO> {
        return this.routineService.createRoutine(routineData, req.token?.sub);
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
        return this.routineService.getRoutine({ studentId });
    }

    @Get('/:uuid')
    getRoutineById(
        @Param('uuid', ParseUUIDPipe) routineId: string,
    ): Promise<RoutineDTO> {
        return this.routineService.getRoutine({ id: routineId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateRoutineById(
        @Param('uuid', ParseUUIDPipe) routineId: string,
        @Body() routineData: UpdateRoutineDTO,
    ): Promise<RoutineDTO> {
        return this.routineService.updateRoutine({
            where: { id: routineId },
            data: routineData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteRoutineById(
        @Param('uuid', ParseUUIDPipe) routineId: string,
    ): Promise<void> {
        return this.routineService.deleteRoutine({ id: routineId });
    }
}
