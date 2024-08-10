import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { PrismaService } from 'src/db/prisma.service';
import { BookDTO, CreateBookDTO, UpdateBookDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService implements BookRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly selectBook = {
        id: true,
        name: true,
        author: true,
        createdAt: true,
        updatedAt: true,
        college: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                active: true,
            },
        },
    };

    private readonly notFoundMessage = (
        subject: string,
        where: Prisma.BookWhereUniqueInput,
    ): string => {
        return `${subject} with ${Object.entries(where)
            .map(([key, value]) => `${key} ${value}`)
            .join(', ')} was not found.`;
    };
    private readonly errorMessage = (
        subject: string,
        adjective: string,
    ): string => {
        return `Something bad happened and the ${subject} was not ${adjective}.`;
    };

    async createBook(data: CreateBookDTO, collegeId: string): Promise<BookDTO> {
        const college = await this.prisma.college.findUnique({
            where: { id: collegeId },
        });
        if (!college)
            throw new NotFoundException(
                this.notFoundMessage('College', { id: collegeId }),
            );

        try {
            return await this.prisma.book.create({
                data: { ...data, collegeId },
                select: this.selectBook,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('book', 'created'),
            );
        }
    }

    async getBooks(params: {
        skip?: number;
        take?: number;
        where?: Prisma.BookWhereInput;
        orderBy?: Prisma.BookOrderByWithRelationInput;
    }): Promise<BookDTO[]> {
        const { skip, take, where, orderBy } = params;

        try {
            return await this.prisma.book.findMany({
                skip,
                take,
                where,
                orderBy,
                select: this.selectBook,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('books', 'found'),
            );
        }
    }

    async getBooksFromFollowedColleges(studentId: string): Promise<BookDTO[]> {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
        });
        if (!student)
            throw new NotFoundException(
                this.notFoundMessage('Student', { id: studentId }),
            );

        try {
            const collegesFollowed = await this.prisma.follower.findMany({
                where: { studentId },
                select: {
                    college: {
                        select: {
                            books: {
                                select: this.selectBook,
                            },
                        },
                    },
                },
            });

            return collegesFollowed
                .map((cf) => cf.college.books)
                .reduce((books, book) => books.concat(book), []);
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('books', 'found'),
            );
        }
    }

    async getBook(where: Prisma.BookWhereUniqueInput): Promise<BookDTO> {
        try {
            const bookFound = await this.prisma.book.findUnique({
                where,
                select: this.selectBook,
            });
            if (!bookFound) throw this.notFoundMessage('Book', where);
            return bookFound;
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async updateBook(params: {
        where: Prisma.BookWhereUniqueInput;
        data: UpdateBookDTO;
    }): Promise<BookDTO> {
        const { where, data } = params;

        await this.getBook(where);

        try {
            return await this.prisma.book.update({
                where,
                data,
                select: this.selectBook,
            });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('book', 'updated'),
            );
        }
    }

    async deleteBook(where: Prisma.BookWhereUniqueInput): Promise<void> {
        await this.getBook(where);

        try {
            await this.prisma.book.delete({ where });
        } catch (err) {
            throw new InternalServerErrorException(
                this.errorMessage('book', 'deleted'),
            );
        }
    }
}