import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// 添加类型定义

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
        private readonly redis: RedisService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const roleIds = user.roles.map((role) => role.id);

        const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
            context.getHandler(),
            context.getClass()
        ]);

        // 如果没有定义权限要求，默认允许访问
        if (!requiredPermissions?.length) {
            return true;
        }
        const redisKey = `${user.username}_${user.id}_permissions`;
        let userPermissions = await this.redis.listGet(redisKey);
        console.log(userPermissions);

        if (userPermissions.length === 0) {
            const rolePermissions = await this.prisma.rolePermission.findMany({
                where: {
                    roleId: {
                        in: roleIds
                    }
                },
                select: {
                    permission: {
                        select: {
                            name: true
                        }
                    }
                }
            });
            userPermissions = rolePermissions.map((rp) => rp.permission.name);
            await this.redis.listSet(redisKey, userPermissions);
        }
        return requiredPermissions.every((permission) => userPermissions.includes(permission));
    }
}
