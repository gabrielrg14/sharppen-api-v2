import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './dto/auth.dto';
import { AuthTokenDTO } from './dto/auth-token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly invalidCredentialsMessage = 'Invalid credentials.';

    async authenticate(authData: AuthDTO): Promise<AuthTokenDTO> {
        const { email, password } = authData;

        const student = await this.prisma.student.findUnique({
            where: { email },
        });

        const college = await this.prisma.college.findUnique({
            where: { email },
        });

        if (!student && !college)
            throw new UnauthorizedException(this.invalidCredentialsMessage);

        const passwordMatch = await bcrypt.compareSync(
            password,
            student?.password || college?.password,
        );
        if (!passwordMatch)
            throw new UnauthorizedException(this.invalidCredentialsMessage);

        const payload = { sub: student?.id || college?.id };
        return {
            token: await this.jwtService.signAsync(payload),
        };
    }
}
