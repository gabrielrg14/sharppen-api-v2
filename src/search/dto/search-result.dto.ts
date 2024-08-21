import {
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

export class SearchResultDTO {
    students: Student[];
    colleges: College[];
}
