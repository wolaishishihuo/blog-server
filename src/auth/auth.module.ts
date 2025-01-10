import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                console.log(configService.get('appConfig.jwtSecret'));
                console.log(configService.get('appConfig.jwtExpirationTime'));
                return {
                    secret: configService.get('appConfig.jwtSecret'),
                    signOptions: { expiresIn: configService.get('appConfig.jwtExpirationTime') }
                };
            }
        })
    ]
})
export class AuthModule {}
