import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
    const PermissionActionMap = {
        READ: {
            name: 'read',
            description: '读取权限'
        },
        WRITE: {
            name: 'write',
            description: '写入权限'
        },
        MANAGE: {
            name: 'manage',
            description: '管理权限'
        }
    };

    await prisma.permission.createMany({
        data: Object.entries(PermissionActionMap).map(([_, name]) => ({
            name: name.name,
            description: name.description
        }))
    });
    console.log('Permissions seeded');
}
