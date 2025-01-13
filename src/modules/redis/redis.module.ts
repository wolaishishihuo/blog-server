import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [
        RedisService,
        {
            provide: 'REDIS_CLIENT',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const client = createClient({
                    socket: {
                        host: configService.get('appConfig.redisHost'),
                        port: configService.get('appConfig.redisPort')
                    }
                });
                await client.connect();
                return client;
            }
        }
    ],
    exports: [RedisService]
})
export class RedisModule {}
