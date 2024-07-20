import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
    imports: [DbModule],
    controllers: [StudentController],
    providers: [StudentService],
})
export class StudentModule {}
