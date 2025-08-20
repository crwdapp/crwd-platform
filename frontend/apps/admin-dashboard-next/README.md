# CRWD Admin Dashboard

The central brain of the CRWD platform - a comprehensive administrative interface for managing users, bars, events, drinks, and analytics.

## 🚀 Features

### Core Management
- **Users Management**: Create, update, delete, and manage user accounts
- **Bars Management**: Manage bar profiles, hours, information, and drink menus
- **Events Management**: Create and manage events across all bars
- **Reviews Management**: Monitor and moderate user reviews

### Analytics & Insights
- **Real-time Analytics**: Platform performance metrics
- **User Demographics**: Age distribution and user behavior
- **Bar Performance**: Revenue and event analytics by bar
- **Event Analytics**: Event creation and attendance trends
- **Revenue Tracking**: Monthly revenue and growth metrics

### Advanced Features
- **Search & Filter**: Advanced search across all entities
- **Bulk Operations**: Mass actions for efficiency
- **Real-time Updates**: Live data synchronization
- **Export Capabilities**: Data export for reporting
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts for data visualization
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **API**: RESTful API with fetch

## 📦 Installation

1. **Install dependencies**:
   ```bash
   cd frontend/apps/admin-dashboard-next
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3002`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── analytics/         # Analytics dashboard
│   ├── bars/             # Bars management (including drink menus)
│   ├── events/           # Events management
│   └── users/            # Users management
├── components/           # Reusable UI components
│   ├── analytics/        # Analytics-specific components
│   ├── bars/            # Bars management components (including drinks)
│   ├── events/          # Events management components
│   ├── layout/          # Layout components
│   ├── ui/              # Base UI components
│   └── users/           # Users management components
├── lib/                 # Utility libraries
│   ├── api.ts          # API service layer
│   └── utils.ts        # Utility functions
└── types/              # TypeScript type definitions
```

## 🔌 API Integration

The admin dashboard connects to the backend API through the `api.ts` service layer:

### Available Endpoints

- **Users**: `/api/users`
- **Bars**: `/api/bars` (including `/api/bars/:id/drinks` for drink management)
- **Events**: `/api/events`
- **Reviews**: `/api/reviews`
- **Analytics**: `/api/analytics`

### API Features

- **Error Handling**: Comprehensive error handling with custom ApiError class
- **Type Safety**: Full TypeScript support for all API responses
- **Query Parameters**: Support for search, pagination, and filtering
- **Authentication**: JWT-based authentication (to be implemented)

## 📊 Analytics Dashboard

The analytics dashboard provides comprehensive insights into platform performance:

### Key Metrics
- **Total Users**: Platform user count and growth
- **Active Bars**: Number of registered bars
- **Events Created**: Event creation trends
- **Monthly Revenue**: Revenue tracking and projections

### Charts & Visualizations
- **Growth Trends**: Line charts showing platform growth
- **User Demographics**: Pie charts for age distribution
- **Bar Performance**: Bar charts for revenue comparison
- **Event Categories**: Distribution of event types

## 🔐 Authentication & Security

### Planned Features
- **JWT Authentication**: Secure admin access
- **Role-based Access**: Different permission levels
- **Session Management**: Secure session handling
- **Audit Logging**: Track all admin actions

### Security Measures
- **CORS Configuration**: Proper cross-origin settings
- **Rate Limiting**: API rate limiting protection
- **Input Validation**: Zod schema validation
- **XSS Protection**: Content Security Policy

## 🎨 UI/UX Features

### Design System
- **Consistent Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme support (planned)
- **Accessibility**: WCAG 2.1 compliance

### User Experience
- **Intuitive Navigation**: Clear navigation structure
- **Search & Filter**: Advanced search capabilities
- **Bulk Actions**: Efficient mass operations
- **Real-time Updates**: Live data synchronization

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic CRUD operations for all entities
- ✅ Analytics dashboard
- ✅ Search and filtering
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Real-time updates with WebSocket
- 🔄 Advanced analytics and reporting
- 🔄 Bulk operations
- 🔄 Export functionality

### Phase 3 (Future)
- 📋 Advanced user management
- 📋 Bar partner portal integration
- 📋 Mobile app management
- 📋 Advanced security features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the CRWD platform and is proprietary software.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**CRWD Admin Dashboard** - The central brain of your platform 🧠
