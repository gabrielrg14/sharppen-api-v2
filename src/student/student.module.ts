import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { MulterModule } from '@nestjs/platform-express';
import { CommonModule } from 'src/common/common.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
    imports: [
        DbModule,
        MulterModule.register({ dest: './upload/student' }),
        CommonModule,
    ],
    controllers: [StudentController],
    providers: [StudentService],
    exports: [StudentService],
})
export class StudentModule {}
