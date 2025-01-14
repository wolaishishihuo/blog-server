import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter;

    constructor(private readonly configService: ConfigService) {
        console.log(this.configService.get('appConfig.emailPass'));
        this.transporter = createTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: this.configService.get('appConfig.emailUser'),
                pass: this.configService.get('appConfig.emailPass')
            }
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        try {
            const mailOptions = {
                from: {
                    name: '系统邮件',
                    address: this.configService.get('appConfig.emailUser')
                },
                to,
                subject,
                text
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }
}
