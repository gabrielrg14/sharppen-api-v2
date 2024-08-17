import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { PostModule } from 'src/post/post.module';
import { CommentModule } from 'src/comment/comment.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
    imports: [
        DbModule,
        StudentModule,
        CollegeModule,
        PostModule,
        CommentModule,
    ],
    controllers: [ReactionController],
    providers: [ReactionService],
})
export class ReactionModule {}
