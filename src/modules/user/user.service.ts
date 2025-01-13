import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // 获取当前登录人角色信息
    async findUserRole(userId: number) {
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: {
                role: true
            }
        });
        return userRoles?.map((item) => item.role);
    }

    // 获取用户列表
    async findUserList() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                nickname: true,
                avatar: true,
                createdAt: true
            }
        });
    }
}
