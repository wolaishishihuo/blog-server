import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { defaultUserSelect } from '@/constants/user';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
