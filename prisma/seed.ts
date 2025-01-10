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
    ROLE: 'role',
    SYSTEM: 'system'
};

type PermissionAction = (typeof PermissionActionMap)[keyof typeof PermissionActionMap];
type Resource = (typeof ResourceMap)[keyof typeof ResourceMap];

// 定义每个资源允许的操作权限
const ResourcePermissions = {
    [ResourceMap.USER]: [PermissionActionMap.READ],
    [ResourceMap.ROLE]: [PermissionActionMap.READ, PermissionActionMap.WRITE],
    [ResourceMap.SYSTEM]: [PermissionActionMap.READ, PermissionActionMap.WRITE, PermissionActionMap.MANAGE]
};

// 简化的角色配置
const roleConfigs = [
    {
        name: 'admin',
        description: '超级管理员',
        permissionFilter: (resource: Resource, action: PermissionAction) => {
            // 超级管理员可以执行所有允许的操作
            return ResourcePermissions[resource].includes(action);
        }
    },
    {
        name: 'operator',
        description: '操作员',
        permissionFilter: (resource: Resource, action: PermissionAction) => {
            // 操作员可以读写所有资源，但不能管理
            return resource === ResourceMap.ROLE && ResourcePermissions[resource].includes(action);
        }
    },
    {
        name: 'user',
        description: '普通用户',
        permissionFilter: (resource: Resource, action: PermissionAction) => {
            // 普通用户只能读取
            return resource === ResourceMap.USER && ResourcePermissions[resource].includes(action);
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
        data: Object.entries(ResourcePermissions).flatMap(([resource, allowedActions]) =>
            allowedActions.map((action) => ({
                name: `${resource}:${action}`,
                description: `Permission to ${action} ${resource}`
            }))
        )
    });

    // 创建角色
    const roles = await Promise.all(
        roleConfigs.map((config) =>
            prisma.role.create({
                data: {
                    name: config.name,
                    description: config.description
                }
            })
        )
    );

    // 获取所有权限并创建角色权限关联
    const allPermissions = await prisma.permission.findMany();
    await Promise.all(
        roles.map((role, index) => {
            const roleConfig = roleConfigs[index];
            const rolePermissions = allPermissions
                .filter((permission) => {
                    const [resource, action] = permission.name.split(':') as [Resource, PermissionAction];
                    return roleConfig.permissionFilter(resource, action);
                })
                .map((permission) => ({
                    roleId: role.id,
                    permissionId: permission.id
                }));

            return prisma.rolePermission.createMany({
                data: rolePermissions
            });
        })
    );

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
