import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { BookDTO, CreateBookDTO, UpdateBookDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService implements BookRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
    ) {}

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

    async createBook(data: CreateBookDTO, collegeId: string): Promise<BookDTO> {
        await this.collegeService.getUniqueCollege({ id: collegeId });

        try {
            return await this.prisma.book.create({
                data: { ...data, collegeId },
                select: this.selectBook,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('book', 'created');
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
            this.exceptionService.somethingBadHappened('books', 'found');
        }
    }

    async getBooksFromFollowedColleges(studentId: string): Promise<BookDTO[]> {
        await this.studentService.getUniqueStudent({ id: studentId });

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
            this.exceptionService.somethingBadHappened('books', 'found');
        }
    }

    async getUniqueBook(where: Prisma.BookWhereUniqueInput): Promise<BookDTO> {
        try {
            const bookFound = await this.prisma.book.findUnique({
                where,
                select: this.selectBook,
            });
            if (!bookFound)
                this.exceptionService.subjectNotFound<Prisma.BookWhereUniqueInput>(
                    'Book',
                    where,
                );
            return bookFound;
        } catch (err) {
            throw err;
        }
    }

    async getFirstBook(where: Prisma.BookWhereInput): Promise<BookDTO> {
        return await this.prisma.book.findFirst({
            where,
            select: this.selectBook,
        });
    }

    async updateBook(params: {
        where: Prisma.BookWhereUniqueInput;
        data: UpdateBookDTO;
    }): Promise<BookDTO> {
        const { where, data } = params;

        await this.getUniqueBook(where);

        try {
            return await this.prisma.book.update({
                where,
                data,
                select: this.selectBook,
            });
        } catch (err) {
            this.exceptionService.somethingBadHappened('book', 'updated');
        }
    }

    async deleteBook(where: Prisma.BookWhereUniqueInput): Promise<void> {
        await this.getUniqueBook(where);

        try {
            await this.prisma.book.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('book', 'deleted');
        }
    }
}
