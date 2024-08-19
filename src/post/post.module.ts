import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { CommonModule } from 'src/common/common.module';
import { CollegeModule } from 'src/college/college.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [DbModule, CommonModule, CollegeModule],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
