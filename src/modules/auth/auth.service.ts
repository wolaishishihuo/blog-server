import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import * as argon2 from 'argon2';
import { LoginType, UserRole } from '@/enum/user';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import appConfig from '@/config/app';
import { RedisService } from '../redis/redis.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService
    ) {}

    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>;

    async register(registerAuthDto: RegisterAuthDto) {
        const { username, password, email, nickname, confirmPassword } = registerAuthDto;
        if (password !== confirmPassword) {
            throw new HttpException('两次密码不一致!', HttpStatus.OK);
        }

        const foundUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });
        if (foundUser) {
            throw new HttpException('用户名或邮箱已存在!', HttpStatus.OK);
        }
        const hashedPassword = await argon2.hash(password);

        await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                nickname,
                avatar: 'https://picsum.photos/200/300',
                userRole: {
                    create: {
                        role: {
                            connect: {
                                id: UserRole.USER
                            }
                        }
                    }
                }
            }
        });
        return;
    }

    private async validatePasswordLogin(user: User, password: string): Promise<void> {
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            throw new HttpException('用户名或密码错误!', HttpStatus.OK);
        }
    }

    private async validateCodeLogin(email: string, code: string): Promise<void> {
        const redisCode = await this.redisService.get(`email_code_${email}`);
        if (code !== redisCode) {
            throw new HttpException('验证码错误或已过期!', HttpStatus.OK);
        }
    }

    async login(loginAuthDto: LoginAuthDto) {
        const { username, password, loginType, emailCode, email } = loginAuthDto;

        const foundUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }]
            }
        });

        if (!foundUser) {
            throw new HttpException('用户名或邮箱或密码错误!', HttpStatus.OK);
        }

        if (loginType === LoginType.PASSWORD) {
            await this.validatePasswordLogin(foundUser, password);
        } else {
            await this.validateCodeLogin(email, emailCode);
        }

        const payload = {
            username: foundUser.username,
            sub: foundUser.id
        };
        return await this.getToken(payload);
    }

    async getToken(payload) {
        const accessToken = await this.jwtService.signAsync(
            {
                username: payload.username,
                sub: payload.sub
            },
            {
                expiresIn: this.config.jwtExpirationTime
            }
        );
        const refreshToken = await this.jwtService.signAsync(
            {
                username: payload.username,
                sub: payload.sub
            },
            {
                expiresIn: this.config.jwtRefreshExpirationTime
            }
        );
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    async refreshToken(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken);
        return await this.getToken(payload);
    }
}
