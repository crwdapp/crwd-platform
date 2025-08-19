# CRWD Admin Dashboard

A modern, responsive admin dashboard built with Next.js 14, TypeScript, and shadcn/ui components. This dashboard provides comprehensive management tools for the CRWD platform, including user management, bar management, event tracking, analytics, and campaign management.

## 🚀 Features

### Core Features
- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Latest features including App Router and Server Components
- **Real-time Analytics**: Interactive charts and data visualization with Recharts
- **Search & Filtering**: Advanced search capabilities across all data tables
- **Dark/Light Mode**: Theme switching capability (ready for implementation)

### Dashboard Sections
- **Overview Dashboard**: Key metrics, charts, and recent activity
- **Bars Management**: Complete CRUD operations for partner bars
- **Events Management**: Event creation, tracking, and analytics
- **Users Management**: User profiles, roles, and activity tracking
- **Analytics**: Comprehensive data visualization and insights
- **Campaigns**: Marketing campaign management and performance tracking
- **Settings**: User preferences, privacy settings, and system configuration

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Modern icon library
- **Recharts** - Composable charting library
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### UI Components
- **Radix UI** - Headless UI primitives
- **Class Variance Authority** - Component variant management
- **Tailwind Merge** - Utility for merging Tailwind classes
- **Sonner** - Toast notifications

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard home
│   ├── bars/              # Bars management
│   ├── events/            # Events management
│   ├── users/             # Users management
│   ├── analytics/         # Analytics dashboard
│   ├── campaigns/         # Campaigns management
│   └── settings/          # Settings page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard-specific components
│   ├── bars/             # Bars management components
│   ├── events/           # Events management components
│   ├── users/            # Users management components
│   ├── analytics/        # Analytics components
│   ├── campaigns/        # Campaigns components
│   └── settings/         # Settings components
├── lib/                  # Utility functions
│   └── utils.ts          # Common utilities
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd frontend/apps/admin-dashboard-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3002](http://localhost:3002)

### Available Scripts

- `npm run dev` - Start development server on port 3002
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components
All components follow the shadcn/ui design system with:
- Consistent spacing and sizing
- Accessible color contrast
- Responsive breakpoints
- Dark mode support (ready)

## 📊 Data Visualization

The dashboard includes comprehensive analytics with:
- **Bar Charts** - Revenue and event comparisons
- **Line Charts** - Growth trends over time
- **Pie Charts** - User demographics and event categories
- **Area Charts** - Platform growth visualization
- **Progress Bars** - Campaign budget tracking

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=your_database_url

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3002
```

### Tailwind Configuration
The project uses a custom Tailwind configuration optimized for the design system:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... more custom colors
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- **Authentication**: Ready for NextAuth.js integration
- **Authorization**: Role-based access control
- **Data Validation**: Zod schema validation
- **XSS Protection**: Built-in Next.js security features
- **CSRF Protection**: Automatic CSRF token handling

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- **Next.js Optimization**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Lazy Loading**: Component and route-based lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Migration from Old Dashboard

This Next.js version replaces the previous Vite-based admin dashboard with:
- **Better Performance**: Server-side rendering and optimization
- **Improved UX**: Modern component library and design system
- **Enhanced Features**: More comprehensive analytics and management tools
- **Better Maintainability**: TypeScript and modern development practices

---

Built with ❤️ for the CRWD platform
