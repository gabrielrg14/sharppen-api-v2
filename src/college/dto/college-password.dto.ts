import { College as CollegeModel } from '@prisma/client';

export class CollegePasswordDTO
    implements Pick<CollegeModel, 'id' | 'password'>
{
    id: string;
    password: string;
}
