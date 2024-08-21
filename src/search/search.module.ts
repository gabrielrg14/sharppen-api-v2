import { Module } from '@nestjs/common';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [StudentModule, CollegeModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
