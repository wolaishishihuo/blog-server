import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from 'argon2';
import { UserRole } from '@/enum/user';
@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    async register(registerAuthDto: RegisterAuthDto) {
        const { username, password, email, nickname, confirmPassword } = registerAuthDto;

        if (password !== confirmPassword) {
            throw new HttpException('两次密码不一致!', HttpStatus.OK);
        }

        const foundUser = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        if (foundUser) {
            throw new HttpException('用户名已存在!', HttpStatus.OK);
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
        return {
            message: '注册成功!',
            code: HttpStatus.OK
        };
    }
}
