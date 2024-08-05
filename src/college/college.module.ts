import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';

@Module({
    imports: [DbModule],
    controllers: [CollegeController],
    providers: [CollegeService],
})
export class CollegeModule {}
