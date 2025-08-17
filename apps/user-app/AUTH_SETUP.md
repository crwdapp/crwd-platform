# Authentication Setup for CRWD User App

## Overview
The React Native user app now includes complete authentication integration with the backend auth service.

## Features Added

### 🔐 Authentication Screens
- **LoginScreen** - Modern login form with email/password
- **RegisterScreen** - User registration with validation
- **LoadingScreen** - Loading state during auth checks

### 🏪 State Management
- **AuthStore** - Zustand store for auth state
- **AuthContext** - React context for auth flow
- **AuthService** - API service for backend communication

### 🔄 Navigation Flow
- **Unauthenticated** → Login/Register screens
- **Authenticated** → Main app screens
- **Automatic** → Token refresh and session management

## Setup Instructions

### 1. Start the Backend
```bash
# In the backend directory
cd backend
pnpm docker:up
pnpm dev:auth
```

### 2. Configure API URL
Edit `src/config/api.ts` to match your setup:

```typescript
// For local development
development: {
  baseURL: 'http://localhost:3001/api',
},

// For device testing (replace with your computer's IP)
export const getLocalApiURL = () => {
  return 'http://192.168.1.100:3001/api'; // Your computer's IP
};
```

### 3. Test Authentication

#### Using the App:
1. **Register** a new account
2. **Login** with existing credentials
3. **Logout** from profile screen

#### Test Credentials:
- **Admin**: admin@crwd.com / admin123
- **Test User**: test@crwd.com / test123

### 4. Development Tips

#### For Device Testing:
- Use your computer's IP address instead of `localhost`
- Ensure backend is accessible from your device
- Check firewall settings

#### For Emulator Testing:
- `localhost` should work fine
- Backend must be running on port 3001

## File Structure

```
src/
├── screens/
│   ├── LoginScreen.tsx      # Login form
│   ├── RegisterScreen.tsx   # Registration form
│   └── LoadingScreen.tsx    # Loading state
├── services/
│   └── authService.ts       # API communication
├── store/
│   └── authStore.ts         # Auth state management
├── contexts/
│   └── AuthContext.tsx      # Auth context provider
└── config/
    └── api.ts              # API configuration
```

## API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

## Security Features

- **JWT Tokens** - Secure authentication
- **Token Refresh** - Automatic session renewal
- **Secure Storage** - Tokens stored in AsyncStorage
- **Error Handling** - Comprehensive error management

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Ensure backend is running on port 3001
   - Check API URL configuration

2. **CORS Issues**
   - Backend should handle CORS for mobile apps
   - Check backend CORS configuration

3. **Token Issues**
   - Clear AsyncStorage if tokens are corrupted
   - Check token expiration

### Debug Commands:
```bash
# Check backend health
curl http://localhost:3001/health

# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@crwd.com","password":"test123"}'
```

## Next Steps

1. **Test on Device** - Verify authentication works on physical device
2. **Add Error Handling** - Enhance error messages and retry logic
3. **Implement Biometrics** - Add fingerprint/face ID support
4. **Add Password Reset** - Implement forgot password flow
5. **Social Login** - Add Google/Apple sign-in options


