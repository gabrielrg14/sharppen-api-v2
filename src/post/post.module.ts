import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [DbModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
