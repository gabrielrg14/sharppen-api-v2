import {
    Reaction as ReactionModel,
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

export class ReactionDTO
    implements Omit<ReactionModel, 'studentId' | 'collegeId'>
{
    id: string;
    createdAt: Date;
    postId: string | null;
    commentId: string | null;
    student: Student | null;
    college: College | null;
}
