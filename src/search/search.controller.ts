import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResultDTO } from './dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/:query')
    searchStudentsCollegesByName(
        @Param('query') query: string,
    ): Promise<SearchResultDTO> {
        return this.searchService.searchStudentsColleges('name', query);
    }
}
