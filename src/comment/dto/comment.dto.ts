import {
    Comment as CommentModel,
    Student as StudentModel,
    College as CollegeModel,
} from '@prisma/client';

type Student = Pick<
    StudentModel,
    'id' | 'name' | 'email' | 'birthDate' | 'course' | 'active'
>;

type College = Pick<
    CollegeModel,
    'id' | 'name' | 'email' | 'phone' | 'address' | 'active'
>;

export class CommentDTO
    implements Omit<CommentModel, 'studentId' | 'collegeId'>
{
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    postId: string;
    commentId: string | null;
    student: Student | null;
    college: College | null;
    _count: {
        reactions: number;
        comments: number;
    };
}
