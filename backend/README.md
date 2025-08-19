# CRWD Bolt Backend API

A robust Node.js backend API built with Express, TypeScript, and Prisma for the CRWD Bolt bar discovery and event management platform.

## 🚀 Features

- **User Management**: Registration, authentication, profiles, and token system
- **Bar Management**: CRUD operations, location-based search, analytics
- **Event Management**: Event creation, attendance tracking, comments, bookmarks
- **Drink Menu System**: Bar-specific drink menus with token pricing
- **Review System**: User reviews and ratings for bars
- **Real-time Analytics**: Bar performance metrics and user engagement
- **Security**: JWT authentication, rate limiting, input validation
- **Type Safety**: Full TypeScript support with Zod validation

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod schema validation
- **Security**: Helmet, CORS, Rate limiting
- **Development**: tsx for hot reloading

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API routes
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities
│   └── app.ts           # Main application
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

### Installation

#### Option 1: Using Docker (Recommended)

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

4. **Start all services with one command**
   ```bash
   npm run setup
   ```
   
   This will:
   - Start PostgreSQL, Redis, pgAdmin, and MailHog containers
   - Generate Prisma client
   - Push schema to database
   - Seed database with sample data

5. **Start development server**
   ```bash
   npm run dev
   ```

#### Option 2: Manual Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/crwdbolt"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Services Available

The API will be available at `http://localhost:3000`

**Additional services:**
- **PostgreSQL**: `localhost:5432` (Database)
- **pgAdmin**: `http://localhost:5050` (Database management UI)
  - Email: `admin@crwdbolt.com`
  - Password: `admin123`
- **Redis**: `localhost:6379` (Caching)
- **MailHog**: `http://localhost:8025` (Email testing UI)

## 📚 API Endpoints

### Authentication
- `POST /api/users` - Create user account
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Bars
- `GET /api/bars` - Get bars with filters
- `GET /api/bars/:id` - Get specific bar
- `POST /api/bars` - Create bar (protected)
- `PUT /api/bars/:id` - Update bar (protected)
- `GET /api/bars/:id/analytics` - Get bar analytics

### Events
- `GET /api/events` - Get events with filters
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create event (protected)
- `PUT /api/events/:id` - Update event (protected)
- `POST /api/events/:id/attendance` - Update attendance (protected)
- `POST /api/events/:id/bookmark` - Bookmark event (protected)
- `POST /api/events/:id/comments` - Add comment (protected)

### User Tokens
- `GET /api/users/tokens` - Get token balance (protected)
- `PUT /api/users/tokens` - Update tokens (protected)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio

# Docker
npm run docker:up    # Start all Docker services
npm run docker:down  # Stop all Docker services
npm run docker:logs  # View Docker logs
npm run docker:restart # Restart Docker services
npm run docker:clean # Clean up Docker volumes and containers

# Setup
npm run setup        # Complete setup (Docker + Database + Seed)
```

## 🗄 Database Schema

The database includes the following main entities:

- **Users**: User accounts and profiles
- **Bars**: Bar information, locations, hours
- **Events**: Bar events with attendance tracking
- **Drinks**: Bar drink menus with token pricing
- **Reviews**: User reviews and ratings
- **Tokens**: User token balances
- **Visits**: User bar visit tracking

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schema validation for all inputs
- **Rate Limiting**: Prevents abuse with request limiting
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers and protection
- **Environment Variables**: Secure configuration management

## 🧪 Testing

The API includes comprehensive error handling and validation. Test endpoints using tools like:

- **Postman**: API testing and documentation
- **Insomnia**: REST client
- **curl**: Command line testing

## 📊 Health Check

Check API status at: `GET /health`

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🔄 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include input validation with Zod
4. Add error handling
5. Update documentation

## 📝 License

This project is part of the CRWD Bolt platform.

---

For more information, see the main project documentation.
