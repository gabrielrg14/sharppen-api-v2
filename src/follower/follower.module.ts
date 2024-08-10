import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';

@Module({
    imports: [DbModule],
    controllers: [FollowerController],
    providers: [FollowerService],
})
export class FollowerModule {}
