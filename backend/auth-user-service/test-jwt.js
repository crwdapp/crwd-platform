require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('🔍 Testing JWT configuration...');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? '✅ Set' : '❌ Missing');

try {
  // Test token generation
  const testUserId = 'test-user-123';
  const token = jwt.sign({ userId: testUserId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: testUserId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  console.log('✅ Token generation successful');
  console.log('Token:', token.substring(0, 20) + '...');
  console.log('Refresh Token:', refreshToken.substring(0, 20) + '...');
  
  // Test token verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token verification successful:', decoded);
  
} catch (error) {
  console.error('❌ JWT test failed:', error.message);
}
