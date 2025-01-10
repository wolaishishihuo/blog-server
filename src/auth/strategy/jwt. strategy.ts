import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('appConfig.jwtSecret')
        });
    }

    async validate({ sub }) {
        const user = await this.prisma.user.findUnique({
            where: { id: sub }
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
