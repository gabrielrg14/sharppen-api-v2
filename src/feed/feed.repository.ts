import { FeedPostDTO } from './dto';

export abstract class FeedRepository {
    abstract getStudentPostFeed(studentId: string): Promise<FeedPostDTO[]>;
}
