import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
    const roleConfigs = [
        { name: 'admin', description: '超级管理员' },
        { name: 'operator', description: '操作员' },
        { name: 'user', description: '普通用户' }
    ];

    for (const config of roleConfigs) {
        await prisma.role.create({
            data: {
                name: config.name,
                description: config.description
            }
        });
    }
    console.log('Roles seeded');
}
