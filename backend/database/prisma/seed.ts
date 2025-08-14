import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CRWD Platform database (Phase 1)...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crwd.com' },
    update: {},
    create: {
      email: 'admin@crwd.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      isVerified: true,
      role: 'SUPER_ADMIN'
    }
  });

  // Create admin profile
  await prisma.userProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      bio: 'Platform Administrator',
      location: 'System'
    }
  });

  // Create test user
  const testPassword = await bcrypt.hash('test123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@crwd.com' },
    update: {},
    create: {
      email: 'test@crwd.com',
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      role: 'USER'
    }
  });

  // Create test user profile
  await prisma.userProfile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      bio: 'Test user for development',
      location: 'Development'
    }
  });

  console.log('✅ Phase 1 database seeded successfully!');
  console.log('🔐 Admin user: admin@crwd.com / admin123');
  console.log('👤 Test user: test@crwd.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
