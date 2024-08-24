import { BookDTO, CreateBookDTO, UpdateBookDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class BookRepository {
    abstract createBook(
        collegeId: string,
        data: CreateBookDTO,
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

    abstract getUniqueBook(
        where: Prisma.BookWhereUniqueInput,
    ): Promise<BookDTO>;

    abstract getFirstBook(where: Prisma.BookWhereInput): Promise<BookDTO>;

    abstract updateBook(
        collegeId: string,
        params: {
            where: Prisma.BookWhereUniqueInput;
            data: UpdateBookDTO;
        },
    ): Promise<BookDTO>;

    abstract deleteBook(
        collegeId: string,
        where: Prisma.BookWhereUniqueInput,
    ): Promise<void>;
}
