import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('appConfig.jwtSecret'),
                signOptions: { expiresIn: configService.get('appConfig.jwtExpirationTime') }
            })
        })
    ]
})
export class AuthModule {}
