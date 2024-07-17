import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
})
export class AppModule {}
