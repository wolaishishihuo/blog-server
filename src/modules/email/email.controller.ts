import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post('send')
    async sendEmail(@Body('address') address: string) {
        // 生成5位数字验证码
        const code = Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, '0');
        await this.emailService.sendEmail(address, '登录验证码', `您的验证码是：${code}`);
        return {
            message: 'Email sent successfully'
        };
    }
}
