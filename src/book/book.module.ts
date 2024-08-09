import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
    imports: [DbModule],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule {}
