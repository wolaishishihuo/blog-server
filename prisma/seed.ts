import { seedRoles } from './modules/roles';
import { seedPermissions } from './modules/permissions';
import { seedUsers } from './modules/users';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const seedVersion = process.env.SEED_VERSION?.split(',') || [];
    console.log('Seed version:', seedVersion);
    const usersCount = await prisma.user.count();
    console.log('Users count:', usersCount);
    try {
        if (usersCount === 0 && seedVersion.includes('v1')) {
            console.log('Seeding roles, permissions, and users...');
            await Promise.all([seedRoles(), seedPermissions(), seedUsers()]);
            console.log('Seeding completed successfully.');
        }
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((e) => {
    console.error('Unexpected error:', e);
    process.exit(1);
});
