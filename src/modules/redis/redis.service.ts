import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClientType) {}

    async set(key: string, value: string, ttl?: number) {
        console.log(key, value, ttl);
        await this.client.set(key, value);
        if (ttl) {
            // 设置过期时间
            await this.client.expire(key, ttl);
        }
    }

    async get(key: string) {
        const value = await this.client.get(key);
        if (value) {
            await this.client.del(key);
        }
        return value;
    }

    // 列表设置
    async listSet(key: string, value: string[], ttl?: number) {
        await this.client.lPush(key, value);
        if (ttl) {
            // 设置过期时间
            await this.client.expire(key, ttl);
        }
    }

    // 列表获取
    async listGet(key: string) {
        return await this.client.lRange(key, 0, -1);
    }
}
