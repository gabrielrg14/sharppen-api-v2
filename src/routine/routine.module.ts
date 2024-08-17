import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { StudentModule } from 'src/student/student.module';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

@Module({
    imports: [DbModule, StudentModule],
    controllers: [RoutineController],
    providers: [RoutineService],
})
export class RoutineModule {}
