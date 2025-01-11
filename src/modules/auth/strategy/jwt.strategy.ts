import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 是否忽略过期时间
            ignoreExpiration: false,
            secretOrKey: configService.get('appConfig.jwtSecret')
        });
    }

    async validate({ sub: id }) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
