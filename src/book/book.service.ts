import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { PrismaService } from 'src/db/prisma.service';
import { ExceptionService } from 'src/common/exception.service';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { FollowerService } from 'src/follower/follower.service';
import { BookDTO, CreateBookDTO, UpdateBookDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService implements BookRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly exceptionService: ExceptionService,
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
        private readonly followerService: FollowerService,
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

    async createBook(collegeId: string, data: CreateBookDTO): Promise<BookDTO> {
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
            const collegesFollowed = await this.followerService.getFollowers({
                where: { studentId },
            });

            const collegesBooks = await collegesFollowed.map(async (cf) => {
                return await this.getBooks({
                    where: { collegeId: cf.college.id },
                });
            });

            return Promise.all(collegesBooks).then((collegesBooks) =>
                collegesBooks.flat(),
            );
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

    async updateBook(
        collegeId: string,
        params: {
            where: Prisma.BookWhereUniqueInput;
            data: UpdateBookDTO;
        },
    ): Promise<BookDTO> {
        const { where, data } = params;

        await this.getUniqueBook({ ...where, collegeId });

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

    async deleteBook(
        collegeId: string,
        where: Prisma.BookWhereUniqueInput,
    ): Promise<void> {
        await this.getUniqueBook({ ...where, collegeId });

        try {
            await this.prisma.book.delete({ where });
        } catch (err) {
            this.exceptionService.somethingBadHappened('book', 'deleted');
        }
    }
}
