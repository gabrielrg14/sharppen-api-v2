import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommonModule } from 'src/common/common.module';
import { CollegeModule } from 'src/college/college.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
    imports: [DbModule, CommonModule, CollegeModule],
    controllers: [CourseController],
    providers: [CourseService],
})
export class CourseModule {}
