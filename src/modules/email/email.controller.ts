import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from '../redis/redis.service';

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService,
        private readonly redisService: RedisService
    ) {}

    @Post('getEmailCode')
    async getEmailCode(@Body('email') email: string) {
        // 生成5位数字验证码
        const code = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, '0');

        // 将验证码存入redis 5分钟
        await this.redisService.set(`email_code_${email}`, code, 60 * 5);
        await this.emailService.sendEmail(email, '登录验证码', `您的验证码是：${code}, 5分钟内有效`);
        return '验证码发送成功';
    }
}
