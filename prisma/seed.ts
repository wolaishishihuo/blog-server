import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 基础权限定义
const PermissionActionMap = {
    READ: 'read',
    WRITE: 'write',
    MANAGE: 'manage'
};
const ResourceMap = {
    USER: 'user',
    OPERATOR: 'operator',
    ADMIN: 'admin'
};

type PermissionAction = (typeof PermissionActionMap)[keyof typeof PermissionActionMap];

const ResourcePermissions = {
    [ResourceMap.ADMIN]: [PermissionActionMap.READ, PermissionActionMap.WRITE, PermissionActionMap.MANAGE],
    [ResourceMap.OPERATOR]: [PermissionActionMap.READ, PermissionActionMap.WRITE],
    [ResourceMap.USER]: [PermissionActionMap.READ]
};

// 简化的角色配置
const roleConfigs = [
    {
        name: 'admin',
        description: '超级管理员',
        permissionFilter: (action: PermissionAction) => {
            // 超级管理员可以执行所有允许的操作
            return ResourcePermissions[ResourceMap.ADMIN].includes(action);
        }
    },
    {
        name: 'operator',
        description: '操作员',
        permissionFilter: (action: PermissionAction) => {
            // 操作员可以读写所有资源，但不能管理
            return ResourcePermissions[ResourceMap.OPERATOR].includes(action);
        }
    },
    {
        name: 'user',
        description: '普通用户',
        permissionFilter: (action: PermissionAction) => {
            // 普通用户只能读取
            return ResourcePermissions[ResourceMap.USER].includes(action);
        }
    }
] as const;

async function main() {
    // 清理现有数据
    await prisma.$transaction([
        prisma.rolePermission.deleteMany(),
        prisma.userRole.deleteMany(),
        prisma.permission.deleteMany(),
        prisma.role.deleteMany(),
        prisma.user.deleteMany()
    ]);

    // 创建权限
    await prisma.permission.createMany({
        data: Object.entries(PermissionActionMap).map(([_, name]) => ({
            name,
            description: `Permission to ${name}`
        }))
    });

    // 创建角色
    const roles = [];
    for (const config of roleConfigs) {
        const role = await prisma.role.create({
            data: {
                name: config.name,
                description: config.description
            }
        });
        roles.push(role);
    }

    // 获取所有权限并创建角色权限关联
    const allPermissions = await prisma.permission.findMany();
    for (let index = 0; index < roles.length; index++) {
        const role = roles[index];
        const roleConfig = roleConfigs[index];
        const rolePermissions = allPermissions
            .filter((permission) => {
                const action = permission.name as PermissionAction;
                return roleConfig.permissionFilter(action);
            })
            .map((permission) => ({
                roleId: role.id,
                permissionId: permission.id
            }));

        await prisma.rolePermission.createMany({
            data: rolePermissions
        });
    }

    // 创建默认用户
    const defaultUsers = [
        {
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            nickname: '超级管理员',
            roleIndex: 0 // admin role
        },
        {
            username: 'user',
            password: 'user123',
            email: 'user@example.com',
            nickname: '测试用户',
            roleIndex: 2 // user role
        }
    ];

    // 创建用户和角色关联
    await Promise.all(
        defaultUsers.map((userData) =>
            prisma.user.create({
                data: {
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    nickname: userData.nickname,
                    userRole: {
                        create: {
                            roleId: roles[userData.roleIndex].id
                        }
                    }
                }
            })
        )
    );

    console.log('Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
