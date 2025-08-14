const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Test basic connection
    console.log('📊 Testing basic connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection successful:', result);

    // Test user table
    console.log('👥 Testing user table...');
    const users = await prisma.user.findMany();
    console.log('✅ User table accessible. Found users:', users.length);
    
    if (users.length > 0) {
      console.log('📋 Sample user:', {
        id: users[0].id,
        email: users[0].email,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        role: users[0].role
      });
    }

    // Test user profile table
    console.log('👤 Testing user profile table...');
    const profiles = await prisma.userProfile.findMany();
    console.log('✅ User profile table accessible. Found profiles:', profiles.length);

    // Test auth session table
    console.log('🔐 Testing auth session table...');
    const sessions = await prisma.authSession.findMany();
    console.log('✅ Auth session table accessible. Found sessions:', sessions.length);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function testAuthService() {
  console.log('\n🔍 Testing auth service endpoints...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint:', healthData);

    // Test login with seeded user
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@crwd.com',
        password: 'test123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData);
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData);
    }

  } catch (error) {
    console.error('❌ Auth service test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 CRWD Platform Phase 1 Debug Test\n');
  
  await testDatabaseConnection();
  await testAuthService();
  
  console.log('\n✨ Debug test completed!');
}

main().catch(console.error);
