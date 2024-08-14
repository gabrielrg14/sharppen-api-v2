import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
    imports: [DbModule],
    controllers: [ReactionController],
    providers: [ReactionService],
})
export class ReactionModule {}
