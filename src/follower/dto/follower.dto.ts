import {
    Follower as FollowerModel,
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

export class FollowerDTO
    implements Omit<FollowerModel, 'studentId' | 'collegeId'>
{
    id: string;
    student: Student;
    college: College;
}
