import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { envFilePath } from './utils/env';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true, load: [...config], envFilePath: envFilePath })
    ]
})
export class AppModule {}
