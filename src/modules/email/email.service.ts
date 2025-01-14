import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    transporter: Transporter;
    constructor(private readonly configService: ConfigService) {
        this.transporter = createTransport({
            host: 'smtp.qq.com',
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get('emailUser'),
                pass: this.configService.get('emailPass')
            }
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: this.configService.get('emailUser'),
            to,
            subject,
            text
        });
    }
}
