import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUsers() {
    const defaultUsers = [
        {
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            nickname: '超级管理员',
            roleName: 'admin'
        },
        {
            username: 'user',
            password: 'user123',
            email: 'user@example.com',
            nickname: '测试用户',
            roleName: 'user'
        }
    ];

    for (const userData of defaultUsers) {
        const role = await prisma.role.findUnique({
            where: { name: userData.roleName }
        });

        if (role) {
            await prisma.user.create({
                data: {
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    nickname: userData.nickname,
                    userRole: {
                        create: {
                            roleId: role.id
                        }
                    }
                }
            });
        }
    }
    console.log('Users seeded');
}
