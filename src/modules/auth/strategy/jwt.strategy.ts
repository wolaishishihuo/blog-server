import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { defaultUserSelect } from '@/constants/user';
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
        const user = await this.prisma.user.findFirst({
            where: { id },
            select: defaultUserSelect
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return {
            ...user,
            roles: user.userRole.map((role) => role.role),
            userRole: undefined
        };
    }
}
