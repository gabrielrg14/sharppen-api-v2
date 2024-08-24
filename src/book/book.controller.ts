import {
    Controller,
    UseGuards,
    ParseUUIDPipe,
    Body,
    Request,
    Query,
    Param,
    Post,
    Get,
    Put,
    Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookDTO, BookQueryParams, CreateBookDTO, UpdateBookDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';
import { Prisma } from '@prisma/client';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @UseGuards(AuthGuard)
    createBook(
        @Request() req: RequestTokenDTO,
        @Body() bookData: CreateBookDTO,
    ): Promise<BookDTO> {
        return this.bookService.createBook(req.token.sub, bookData);
    }

    @Get()
    getAllBooks(@Query() query: BookQueryParams): Promise<BookDTO[]> {
        if (query.studentId) {
            return this.bookService.getBooksFromFollowedColleges(
                query.studentId,
            );
        }

        const where: Prisma.BookWhereInput = {};
        if (query.collegeId) where.collegeId = query.collegeId;

        return this.bookService.getBooks({
            where,
            orderBy: { name: 'asc' },
        });
    }

    @Get('/:uuid')
    getBookById(
        @Param('uuid', ParseUUIDPipe) bookId: string,
    ): Promise<BookDTO> {
        return this.bookService.getUniqueBook({ id: bookId });
    }

    @Put('/:uuid')
    @UseGuards(AuthGuard)
    updateBookById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) bookId: string,
        @Body() bookData: UpdateBookDTO,
    ): Promise<BookDTO> {
        return this.bookService.updateBook(req.token.sub, {
            where: { id: bookId },
            data: bookData,
        });
    }

    @Delete('/:uuid')
    @UseGuards(AuthGuard)
    deleteBookById(
        @Request() req: RequestTokenDTO,
        @Param('uuid', ParseUUIDPipe) bookId: string,
    ): Promise<void> {
        return this.bookService.deleteBook(req.token.sub, { id: bookId });
    }
}
