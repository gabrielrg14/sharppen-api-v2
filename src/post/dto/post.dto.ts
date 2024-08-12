import { Post as PostModel, College as CollegeModel } from '@prisma/client';

type College = Pick<
    CollegeModel,
    'id' | 'name' | 'email' | 'phone' | 'address' | 'active'
>;

export class PostDTO implements Omit<PostModel, 'collegeId'> {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    college: College;
    _count: {
        reactions: number;
        comments: number;
    };
}
