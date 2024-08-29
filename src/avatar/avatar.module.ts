import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DbModule } from 'src/db/db.module';
import { CommonModule } from 'src/common/common.module';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
    imports: [
        MulterModule.register({ dest: './upload' }),
        DbModule,
        CommonModule,
        StudentModule,
        CollegeModule,
    ],
    controllers: [AvatarController],
    providers: [AvatarService],
})
export class AvatarModule {}
