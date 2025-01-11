import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { envFilePath } from './utils/env';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true, load: [...config], envFilePath: envFilePath }),
        RedisModule
    ]
})
export class AppModule {}
