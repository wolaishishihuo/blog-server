// 定义基础行为类型
export const ActionType = {
    READ: 'read',
    WRITE: 'write',
    MANAGE: 'manage'
} as const;

// 定义角色类型
export const RoleType = {
    USER: 'user',
    ROLE: 'role',
    ADMIN: 'admin'
} as const;

// 生成权限映射
export const Permissions = {
    // User permissions
    USER_READ: `${RoleType.USER}:${ActionType.READ}`,

    // Role permissions
    ROLE_READ: `${RoleType.ROLE}:${ActionType.READ}`,
    ROLE_WRITE: `${RoleType.ROLE}:${ActionType.WRITE}`,

    // Admin permissions
    ADMIN_READ: `${RoleType.ADMIN}:${ActionType.READ}`,
    ADMIN_WRITE: `${RoleType.ADMIN}:${ActionType.WRITE}`,
    ADMIN_MANAGE: `${RoleType.ADMIN}:${ActionType.MANAGE}`
} as const;

// 类型定义
export type ActionTypeUnion = (typeof ActionType)[keyof typeof ActionType];
export type RoleTypeUnion = (typeof RoleType)[keyof typeof RoleType];
export type PermissionUnion = (typeof Permissions)[keyof typeof Permissions];
