import { Injectable } from '@nestjs/common';
import { FeedRepository } from './feed.repository';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { FollowerService } from 'src/follower/follower.service';
import { PostService } from 'src/post/post.service';
import { FeedPostDTO } from './dto';

@Injectable()
export class FeedService implements FeedRepository {
    constructor(
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly followerService: FollowerService,
        private readonly postService: PostService,
    ) {}

    async getStudentPostFeed(studentId: string): Promise<FeedPostDTO[]> {
        await this.studentService.getUniqueStudent({ id: studentId });

        const studentFollowers = await this.followerService.getFollowers({
            where: { studentId },
        });

        try {
            return await this.postService.getPosts({
                where: {
                    OR: studentFollowers.map((follower) => ({
                        collegeId: follower.college.id,
                    })),
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('feed', 'obtained');
        }
    }
}
