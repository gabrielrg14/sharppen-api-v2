import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommonModule } from 'src/common/common.module';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { FollowerModule } from 'src/follower/follower.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
    imports: [
        DbModule,
        CommonModule,
        StudentModule,
        CollegeModule,
        FollowerModule,
    ],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
