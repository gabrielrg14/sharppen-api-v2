import {
    Controller,
    UseGuards,
    UseInterceptors,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    Request,
    UploadedFile,
    StreamableFile,
    Param,
    Post,
    Get,
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
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('file'))
    uploadAvatarFile(
        @Request() req: RequestTokenDTO,
        @UploadedFile() file: UploadAvatarDTO,
    ): Promise<AvatarDTO> {
        return this.avatarService.uploadAvatarFile(req.token.sub, file);
    }

    @Get('/:uuid')
    @UseGuards(AuthGuard)
    getAvatarById(
        @Param('uuid', ParseUUIDPipe) avatarId: string,
    ): Promise<AvatarDTO> {
        return this.avatarService.getUniqueAvatar({ id: avatarId });
    }

    @Get('/file/:uuid')
    getAvatarFileById(
        @Param('uuid', ParseUUIDPipe) avatarId: string,
    ): Promise<StreamableFile> {
        return this.avatarService.getAvatarFile({ id: avatarId });
    }
}
