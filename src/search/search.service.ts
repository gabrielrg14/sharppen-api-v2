import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { SearchResultDTO } from './dto';

@Injectable()
export class SearchService implements SearchRepository {
    constructor(
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
    ) {}

    async searchStudentsColleges(
        field: string,
        query: string,
    ): Promise<SearchResultDTO> {
        const students = await this.studentService.getStudents({
            where: {
                [field]: {
                    contains: query,
                    mode: 'insensitive',
                },
                active: true,
            },
            orderBy: { name: 'asc' },
        });

        const colleges = await this.collegeService.getColleges({
            where: {
                [field]: {
                    contains: query,
                    mode: 'insensitive',
                },
                active: true,
            },
            orderBy: { name: 'asc' },
        });

        return {
            students,
            colleges,
        };
    }
}
