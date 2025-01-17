import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { envFilePath } from './utils/env';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { ThirdPartyModule } from './modules/third-party/third-party.module';
import { EmailModule } from './modules/email/email.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        ThirdPartyModule,
        RedisModule,
        HttpModule.register({
            global: true,
            // 请求超时时间
            timeout: 3000
        }),
        EmailModule,
        ConfigModule.forRoot({ isGlobal: true, load: [...config], envFilePath: envFilePath })
    ]
})
export class AppModule {}
