import { SearchResultDTO } from './dto';

export abstract class SearchRepository {
    abstract searchStudentsColleges(
        field: string,
        query: string,
    ): Promise<SearchResultDTO>;
}
