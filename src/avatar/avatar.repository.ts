import { StreamableFile } from '@nestjs/common';
import { AvatarDTO, UploadAvatarDTO } from './dto';
import { Prisma } from '@prisma/client';

export abstract class AvatarRepository {
    abstract uploadAvatarFile(
        subjectId: string,
        file: UploadAvatarDTO,
    ): Promise<AvatarDTO>;

    abstract getUniqueAvatar(
        where: Prisma.AvatarWhereUniqueInput,
    ): Promise<AvatarDTO>;

    abstract getFirstAvatar(where: Prisma.AvatarWhereInput): Promise<AvatarDTO>;

    abstract getAvatarFile(
        where: Prisma.AvatarWhereUniqueInput,
    ): Promise<StreamableFile>;
}
