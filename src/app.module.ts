import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { CollegeModule } from './college/college.module';
import { AvatarModule } from './avatar/avatar.module';
import { FollowerModule } from './follower/follower.module';
import { RoutineModule } from './routine/routine.module';
import { BookModule } from './book/book.module';
import { CourseModule } from './course/course.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReactionModule } from './reaction/reaction.module';
import { SearchModule } from './search/search.module';
import { FeedModule } from './feed/feed.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CommonModule,
        AuthModule,
        StudentModule,
        CollegeModule,
        AvatarModule,
        FollowerModule,
        RoutineModule,
        BookModule,
        CourseModule,
        PostModule,
        CommentModule,
        ReactionModule,
        SearchModule,
        FeedModule,
    ],
})
export class AppModule {}
