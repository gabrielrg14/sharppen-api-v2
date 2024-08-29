import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommonModule } from 'src/common/common.module';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';

@Module({
    imports: [DbModule, CommonModule],
    controllers: [CollegeController],
    providers: [CollegeService],
    exports: [CollegeService],
})
export class CollegeModule {}
