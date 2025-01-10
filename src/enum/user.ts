export enum UserRole {
    ADMIN = 1,
    OPERATOR = 2,
    USER = 3
}

export const UserRoleMap = {
    [UserRole.ADMIN]: 'admin',
    [UserRole.OPERATOR]: 'operator',
    [UserRole.USER]: 'user'
};
