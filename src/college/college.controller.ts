import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Param,
    Query,
    Post,
    Get,
    Put,
    Patch,
    Delete,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    CollegeDTO,
    CollegeQueryParams,
    CreateCollegeDTO,
    UpdateCollegeDTO,
    UpdateCollegePasswordDTO,
} from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('college')
export class CollegeController {
    constructor(private readonly collegeService: CollegeService) {}

    @Post()
    createCollege(@Body() collegeData: CreateCollegeDTO): Promise<CollegeDTO> {
        return this.collegeService.createCollege(collegeData);
    }

    @Get()
    getAllColleges(@Query() query: CollegeQueryParams): Promise<CollegeDTO[]> {
        const where: Prisma.CollegeWhereInput = { active: true };

        if (query.search)
            where.OR = [
                {
                    name: { contains: query.search },
                    email: { contains: query.search },
                    address: { contains: query.search },
                },
            ];

        return this.collegeService.getColleges({
            where,
            orderBy: { name: 'asc' },
        });
    }

    @Get('/:uuid')
    getCollegeById(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
    ): Promise<CollegeDTO> {
        return this.collegeService.getUniqueCollege({ id: collegeId });
    }

    @Put()
    @UseGuards(AuthGuard)
    updateCollege(
        @Request() req: RequestTokenDTO,
        @Body() collegeData: UpdateCollegeDTO,
    ): Promise<CollegeDTO> {
        return this.collegeService.updateCollege(req.token.sub, collegeData);
    }

    @Patch('/password')
    @UseGuards(AuthGuard)
    updateCollegePassword(
        @Request() req: RequestTokenDTO,
        @Body() collegeData: UpdateCollegePasswordDTO,
    ): Promise<CollegeDTO> {
        return this.collegeService.updateCollegePassword(
            req.token.sub,
            collegeData,
        );
    }

    @Patch('/deactivate')
    @UseGuards(AuthGuard)
    deactivateCollege(@Request() req: RequestTokenDTO): Promise<CollegeDTO> {
        return this.collegeService.updateCollege(req.token.sub, {
            active: false,
        });
    }

    @Patch('/reactivate')
    @UseGuards(AuthGuard)
    reactivateCollege(@Request() req: RequestTokenDTO): Promise<CollegeDTO> {
        return this.collegeService.updateCollege(req.token.sub, {
            active: true,
        });
    }

    @Delete()
    @UseGuards(AuthGuard)
    deleteCollege(@Request() req: RequestTokenDTO): Promise<void> {
        return this.collegeService.deleteCollege(req.token.sub);
    }
}
