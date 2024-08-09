import { BookDTO, CreateBookDTO, UpdateBookDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class BookRepository {
    abstract createBook(
        data: CreateBookDTO,
        collegeId: string,
    ): Promise<BookDTO>;

    abstract getBooks(params: {
        skip?: number;
        take?: number;
        where?: Prisma.BookWhereInput;
        orderBy?: Prisma.BookOrderByWithRelationInput;
    }): Promise<BookDTO[]>;

    abstract getBooksFromFollowedColleges(
        studentId: string,
    ): Promise<BookDTO[]>;

    abstract getBook(where: Prisma.BookWhereUniqueInput): Promise<BookDTO>;

    abstract updateBook(params: {
        where: Prisma.BookWhereUniqueInput;
        data: UpdateBookDTO;
    }): Promise<BookDTO>;

    abstract deleteBook(where: Prisma.BookWhereUniqueInput): Promise<void>;
}
