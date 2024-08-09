import { Book as BookModel, College as CollegeModel } from '@prisma/client';

type College = Pick<
    CollegeModel,
    'id' | 'name' | 'email' | 'phone' | 'address' | 'active'
>;

export class BookDTO implements Omit<BookModel, 'collegeId'> {
    id: string;
    name: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    college: College;
}
