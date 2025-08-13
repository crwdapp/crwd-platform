# CRWD Platform

A comprehensive bar discovery and management platform built with a modern monorepo architecture using pnpm workspaces.

## 🏗️ Architecture

This monorepo is structured for scalability and maintainability, supporting 10,000+ daily users and 100+ bar dashboards.

### Directory Structure

```
crwd/
├── apps/                          # Frontend applications
│   ├── user-app/                  # React Native mobile app for users
│   ├── admin-dashboard/           # React web app for CRWD staff
│   ├── bar-dashboard/             # React web app for bar owners
│   ├── marketing-site/            # Public site for crwd.ro
│   └── mvp/                       # MVP / internal testing app
│
├── backend/                       # Backend microservices
│   ├── auth-user-service/         # User authentication service
│   ├── auth-bar-service/          # Bar owner authentication service
│   ├── auth-admin-service/        # Admin authentication service
│   ├── drinks-service/            # Drinks management service
│   ├── events-service/            # Events management service
│   ├── payments-service/          # Payment processing service
│   └── analytics-service/         # Analytics and reporting service
│
├── packages/                      # Shared packages
│   ├── ui/                        # Shared UI components (React/React Native)
│   ├── utils/                     # Shared utility functions
│   ├── types/                     # Shared TypeScript types
│   └── api-client/                # Shared API client logic
│
├── package.json                   # Root package.json
├── pnpm-workspace.yaml           # pnpm workspace configuration
├── tsconfig.base.json            # Base TypeScript configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crwd-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Build shared packages:
```bash
pnpm build
```

## 📦 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev                    # Start all frontend apps concurrently
pnpm dev:frontend          # Start only frontend apps
pnpm dev:backend           # Start only backend services

# Individual app/service development
pnpm dev:user-app          # Start user mobile app
pnpm dev:admin-dashboard   # Start admin dashboard
pnpm dev:bar-dashboard     # Start bar dashboard
pnpm dev:marketing-site    # Start marketing site
pnpm dev:mvp               # Start MVP app

# Backend services
pnpm dev:auth-user         # Start user auth service
pnpm dev:auth-bar          # Start bar auth service
pnpm dev:auth-admin        # Start admin auth service
pnpm dev:drinks            # Start drinks service
pnpm dev:events            # Start events service
pnpm dev:payments          # Start payments service
pnpm dev:analytics         # Start analytics service

# Build and maintenance
pnpm build                 # Build all packages
pnpm clean                 # Clean all build artifacts
pnpm type-check            # Type check all packages
pnpm lint                  # Lint all packages
pnpm test                  # Run tests across all packages
```

### Package Level Commands

Each package has its own scripts:

```bash
# For any package (replace <package-name> with actual name)
pnpm --filter <package-name> dev
pnpm --filter <package-name> build
pnpm --filter <package-name> test
```

## 🏢 Applications

### Frontend Apps

#### User App (React Native)
- **Purpose**: Mobile app for end users to discover bars and events
- **Port**: 3000 (Metro bundler)
- **Tech Stack**: React Native, Expo, TypeScript

#### Admin Dashboard (React)
- **Purpose**: Internal dashboard for CRWD staff
- **Port**: 3001
- **Tech Stack**: React, TypeScript, Tailwind CSS

#### Bar Dashboard (React)
- **Purpose**: Dashboard for bar owners to manage their venues
- **Port**: 3002
- **Tech Stack**: React, TypeScript, Tailwind CSS

#### Marketing Site (Next.js)
- **Purpose**: Public website for crwd.ro
- **Port**: 3003
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS

#### MVP App (React)
- **Purpose**: Internal testing and MVP functionality
- **Port**: 3004
- **Tech Stack**: React, TypeScript, Tailwind CSS

### Backend Services

#### Authentication Services
- **auth-user-service**: Port 4001 - User authentication
- **auth-bar-service**: Port 4002 - Bar owner authentication  
- **auth-admin-service**: Port 4003 - Admin authentication

#### Business Services
- **drinks-service**: Port 4004 - Drinks management
- **events-service**: Port 4005 - Events management
- **payments-service**: Port 4006 - Payment processing
- **analytics-service**: Port 4007 - Analytics and reporting

## 📚 Shared Packages

### @crwd/types
Shared TypeScript interfaces and types used across the platform.

```typescript
import { Bar, Event, User, Drink } from '@crwd/types';
```

### @crwd/utils
Common utility functions for validation, formatting, storage, etc.

```typescript
import { validateEmail, formatCurrency, storage } from '@crwd/utils';
```

### @crwd/api-client
Shared API client with service classes and React hooks.

```typescript
import { ApiClient, useAuth, useBars } from '@crwd/api-client';
```

### @crwd/ui
Reusable UI components for React applications.

```typescript
import { Button, Input, Modal, Card } from '@crwd/ui';
```

## 🔧 Development Workflow

### Adding a New Feature

1. **Update types** (if needed):
   ```bash
   cd packages/types
   # Add new interfaces/types
   pnpm build
   ```

2. **Update utils** (if needed):
   ```bash
   cd packages/utils
   # Add new utility functions
   pnpm build
   ```

3. **Update API client** (if needed):
   ```bash
   cd packages/api-client
   # Add new service methods
   pnpm build
   ```

4. **Implement in apps**:
   ```bash
   cd apps/<app-name>
   # Use the new shared functionality
   ```

### Adding a New App

1. Create the app directory in `apps/`
2. Add package.json with proper workspace dependencies
3. Update `pnpm-workspace.yaml` if needed
4. Add dev script to root package.json

### Adding a New Service

1. Create the service directory in `backend/`
2. Add package.json with proper dependencies
3. Create basic Express server structure
4. Add dev script to root package.json

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter <package-name> test

# Run tests in watch mode
pnpm --filter <package-name> test:watch
```

## 🚀 Deployment

### Frontend Deployment
Each app can be deployed independently:
- User App: Expo EAS Build
- Admin/Bar Dashboards: Vercel/Netlify
- Marketing Site: Vercel
- MVP App: Vercel/Netlify

### Backend Deployment
Each microservice can be deployed independently:
- Container-based deployment (Docker)
- Serverless deployment (AWS Lambda)
- Traditional server deployment

## 📊 Monitoring & Analytics

- **Health Checks**: Each service has `/health` endpoint
- **Logging**: Winston logger configured for all services
- **Error Tracking**: Error boundaries in frontend apps
- **Performance**: Built-in performance monitoring

## 🔒 Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: Express rate limiting on all APIs
- **CORS**: Properly configured CORS policies
- **Helmet**: Security headers on all services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in each package

---

**Built with ❤️ for the CRWD Platform team**
