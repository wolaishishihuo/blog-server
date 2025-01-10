import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { envFilePath } from './utils/env';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot({ isGlobal: true, load: [...config], envFilePath: envFilePath })
    ]
})
export class AppModule {}
