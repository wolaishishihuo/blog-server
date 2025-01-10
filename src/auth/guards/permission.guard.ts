import { PrismaService } from '@/prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// 添加类型定义

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService
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

        // 优化数据库查询
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

        const userPermissions = new Set(rolePermissions.map((rp) => rp.permission.name));
        // 检查是否具有所有必需的权限
        return requiredPermissions.every((permission) => userPermissions.has(permission));
    }
}
