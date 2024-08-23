import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { StudentModule } from 'src/student/student.module';
import { FollowerModule } from 'src/follower/follower.module';
import { PostModule } from 'src/post/post.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
    imports: [CommonModule, StudentModule, FollowerModule, PostModule],
    controllers: [FeedController],
    providers: [FeedService],
})
export class FeedModule {}
