# 🚀 **Supabase Setup Guide for CRWD**

## **Quick Setup Steps**

### **1. Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. **Project Settings:**
   - Name: `crwd-app`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for setup (2-3 minutes)

### **2. Get Project Credentials**
1. Go to **Settings** → **API** in Supabase Dashboard
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **3. Create Environment File**
Create `.env.local` in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **4. Run Database Schema**
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the SQL from `SUPABASE_IMPLEMENTATION_GUIDE.md`
3. Run all the SQL commands in order:
   - Core Tables (Step 5.1)
   - Indexes (Step 5.2)
   - RLS Policies (Step 6)
   - Database Functions (Step 7)

### **5. Insert Sample Data**
Run the sample data SQL from the guide to populate your database with test data.

### **6. Test the Implementation**
1. Start your development server: `npm run dev`
2. Test authentication flow
3. Test token system
4. Test events and interactions

## **What's Implemented**

✅ **Complete Database Schema** - All 20+ tables with relationships
✅ **Row Level Security** - Proper data access control
✅ **Token System** - Daily/weekly tokens with reset logic
✅ **Event Management** - Full CRUD with analytics
✅ **Bar Dashboard** - Campaign and redemption system
✅ **Analytics** - Comprehensive tracking across all features
✅ **Authentication** - Secure user management
✅ **Real-time Ready** - Supabase subscriptions for live updates

## **Next Steps**

1. **Follow the guide step-by-step** - Each phase is clearly documented
2. **Test thoroughly** - Use the sample data to verify everything works
3. **Deploy to production** - Update environment variables and deploy
4. **Monitor performance** - Use Supabase dashboard for insights

Your CRWD app now has a robust, scalable backend that can handle growth and all the features we've discussed! 🚀 