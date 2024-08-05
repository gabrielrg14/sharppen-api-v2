import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
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
        return this.collegeService.getCollege({ id: collegeId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateCollegeById(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
        @Body() collegeData: UpdateCollegeDTO,
    ): Promise<CollegeDTO> {
        return this.collegeService.updateCollege({
            where: { id: collegeId },
            data: collegeData,
        });
    }

    @Patch('/:uuid/password')
    @UseGuards(AuthGuard)
    updateCollegePasswordById(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
        @Body() collegeData: UpdateCollegePasswordDTO,
    ): Promise<CollegeDTO> {
        return this.collegeService.updateCollegePassword({
            where: { id: collegeId },
            data: collegeData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteCollegeById(
        @Param('uuid', ParseUUIDPipe) collegeId: string,
    ): Promise<void> {
        return this.collegeService.deleteCollege({ id: collegeId });
    }
}
