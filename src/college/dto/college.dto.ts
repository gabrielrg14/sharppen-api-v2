import { College as CollegeModel } from '@prisma/client';

export class CollegeDTO implements Omit<CollegeModel, 'password'> {
    id: string;
    name: string;
    email: string;
    testDate: Date;
    phone: string;
    address: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
