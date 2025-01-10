export const defaultUserSelect = {
    id: true,
    username: true,
    email: true,
    nickname: true,
    avatar: true,
    createdAt: true,
    userRole: {
        select: {
            role: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    }
} as const;

export const simpleUserSelect = {
    id: true,
    username: true,
    nickname: true,
    avatar: true
} as const;
