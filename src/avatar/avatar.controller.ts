import {
    Controller,
    UseGuards,
    UseInterceptors,
    Request,
    UploadedFile,
    Post,
} from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarDTO, UploadAvatarDTO } from './dto';
import { RequestTokenDTO } from 'src/auth/dto';

@Controller('avatar')
export class AvatarController {
    constructor(private readonly avatarService: AvatarService) {}

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    uploadAvatar(
        @Request() req: RequestTokenDTO,
        @UploadedFile() file: UploadAvatarDTO,
    ): Promise<AvatarDTO> {
        return this.avatarService.uploadAvatar(req.token.sub, file);
    }
}
