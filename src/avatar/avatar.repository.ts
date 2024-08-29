import { AvatarDTO, UploadAvatarDTO } from './dto';

export abstract class AvatarRepository {
    abstract uploadAvatar(
        subjectId: string,
        file: UploadAvatarDTO,
    ): Promise<AvatarDTO>;
}
