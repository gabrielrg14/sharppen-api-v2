import { Module } from '@nestjs/common';
import { StudentModule } from 'src/student/student.module';
import { CollegeModule } from 'src/college/college.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        StudentModule,
        CollegeModule,
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
