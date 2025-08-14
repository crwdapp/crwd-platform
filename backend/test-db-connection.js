const { Client } = require('pg');

// Test Docker PostgreSQL connection
const connectionStrings = [
  'postgresql://crwd_user:1234@localhost:5433/crwd_platform',
  'postgresql://crwd_user:1234@localhost:5433/postgres',
];

async function testConnection(connectionString, name) {
  const client = new Client({ connectionString });
  
  try {
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`   Connection: ${connectionString.replace(/:[^:@]*@/, ':****@')}`);
    
    await client.connect();
    console.log('   ✅ Connected successfully!');
    
    const result = await client.query('SELECT version()');
    console.log(`   📊 PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    // Try to create the database if it doesn't exist
    try {
      await client.query('CREATE DATABASE crwd_platform');
      console.log('   🗄️  Created crwd_platform database!');
    } catch (dbError) {
      if (dbError.code === '42P04') {
        console.log('   ℹ️  Database crwd_platform already exists');
      } else {
        console.log(`   ⚠️  Could not create database: ${dbError.message}`);
      }
    }
    
    await client.end();
    return { success: true, connectionString };
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    await client.end();
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔧 Testing Docker PostgreSQL connections...\n');
  
  for (const [index, connectionString] of connectionStrings.entries()) {
    const result = await testConnection(connectionString, `Docker Connection ${index + 1}`);
    if (result.success) {
      console.log('\n🎉 Found working connection!');
      console.log(`📝 Use this in your .env file:`);
      console.log(`DATABASE_URL="${connectionString}"`);
      return;
    }
  }
  
  console.log('\n❌ No working connection found.');
  console.log('💡 Please check your Docker containers are running.');
}

main().catch(console.error);
