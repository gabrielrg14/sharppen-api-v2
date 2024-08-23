import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { StudentService } from 'src/student/student.service';
import { CollegeService } from 'src/college/college.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO, AuthTokenDTO } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthRepository {
    constructor(
        private readonly studentService: StudentService,
        private readonly collegeService: CollegeService,
        private readonly jwtService: JwtService,
    ) {}

    private readonly invalidCredentialsMessage = 'Invalid credentials.';

    async authenticate(authData: AuthDTO): Promise<AuthTokenDTO> {
        const { email, password } = authData;

        const student = await this.studentService.getStudentPassword({ email });
        const college = await this.collegeService.getCollegePassword({ email });

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
