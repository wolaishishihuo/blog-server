import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(readonly configService: ConfigService) {
        const logLevel = configService.get('appConfig.logLevel');
        super({
            log: (() => {
                switch (logLevel) {
                    case 'debug':
                    case 'verbose':
                        return ['query', 'info', 'warn', 'error'];
                    case 'info':
                        return ['info', 'warn', 'error'];
                    case 'warn':
                        return ['warn', 'error'];
                    case 'error':
                        return ['error'];
                    default:
                        return ['error']; // 默认只显示错误日志
                }
            })(),
            errorFormat: 'pretty'
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
