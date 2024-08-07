import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { CollegeModule } from './college/college.module';
import { CourseModule } from './course/course.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        StudentModule,
        CollegeModule,
        CourseModule,
    ],
})
export class AppModule {}
