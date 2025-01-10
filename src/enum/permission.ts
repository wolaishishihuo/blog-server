// 定义基础行为类型
export const PermissionActionMap = {
    READ: 'read',
    WRITE: 'write',
    MANAGE: 'manage'
} as const;

// 定义角色类型
export const RoleMap = {
    USER: 'user',
    OPERATOR: 'operator',
    ADMIN: 'admin'
} as const;

// 类型定义
export type ActionTypeUnion = (typeof PermissionActionMap)[keyof typeof PermissionActionMap];
export type RoleTypeUnion = (typeof RoleMap)[keyof typeof RoleMap];
