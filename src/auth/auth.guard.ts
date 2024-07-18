import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const [type, token] =
            request.headers['authorization']?.split(' ') ?? [];
        if (type !== 'Bearer')
            throw new UnauthorizedException('Authorization token is required.');

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            request.token = payload;
        } catch {
            throw new UnauthorizedException('Invalid authorization token.');
        }

        return true;
    }
}
