import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
    imports: [DbModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
