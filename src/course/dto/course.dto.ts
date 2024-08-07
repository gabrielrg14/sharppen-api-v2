import { Course as CourseModel, College as CollegeModel } from '@prisma/client';

type College = Pick<
    CollegeModel,
    'id' | 'email' | 'name' | 'phone' | 'address' | 'active'
>;

export class CourseDTO implements Omit<CourseModel, 'collegeId'> {
    id: string;
    name: string;
    period: string;
    createdAt: Date;
    updatedAt: Date;
    college: College;
}
