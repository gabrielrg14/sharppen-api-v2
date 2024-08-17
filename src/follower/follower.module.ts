import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';

@Module({
    imports: [DbModule, StudentModule, CollegeModule],
    controllers: [FollowerController],
    providers: [FollowerService],
})
export class FollowerModule {}
