import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

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
        console.log(id);
        // const user = await this.prisma.user.findFirst({
        //     where: { id }
        // });
        // console.log(user);

        // if (!user) {
        //     throw new UnauthorizedException();
        // }
        // return user;
    }
}
