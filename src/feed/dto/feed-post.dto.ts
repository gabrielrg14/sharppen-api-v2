import { College as CollegeModel } from '@prisma/client';

type College = Pick<
    CollegeModel,
    'id' | 'name' | 'email' | 'phone' | 'address' | 'active'
>;

export class FeedPostDTO {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    college: College;
}
