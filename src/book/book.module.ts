import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
    imports: [DbModule, StudentModule, CollegeModule],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
