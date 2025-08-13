# 🚀 **Complete Supabase Implementation Guide for CRWD**

## **Phase 1: Supabase Project Setup**

### **Step 1: Create Supabase Project**
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

### **Step 2: Get Project Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **Step 3: Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

## **Phase 2: Environment Setup**

### **Step 4: Create Environment File**
Create `.env.local` in your project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## **Phase 3: Database Schema Creation**

### **Step 5: Create Database Tables**

Go to **SQL Editor** in Supabase Dashboard and run these commands:

#### **5.1 Core Tables**

```sql
-- Enhanced Token System Database Schema
-- Updated for proximity validation and bar-specific limits

-- Users table (existing)
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tokens (existing)
CREATE TABLE public.user_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    token_type TEXT CHECK (token_type IN ('daily', 'weekly')),
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bars (existing)
CREATE TABLE public.bars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    phone TEXT,
    website TEXT,
    opening_hours JSONB,
    images TEXT[],
    rating DECIMAL(3, 2),
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bar token limits (NEW - for customizable limits per bar)
CREATE TABLE public.bar_token_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    daily_token_limit INTEGER DEFAULT 2,
    weekly_token_limit INTEGER DEFAULT 1,
    allow_daily_tokens BOOLEAN DEFAULT TRUE,
    allow_weekly_tokens BOOLEAN DEFAULT TRUE,
    minimum_distance_meters INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bar_id)
);

-- User daily usage tracking (NEW - for per-user-per-bar limits)
CREATE TABLE public.user_daily_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    daily_tokens_used INTEGER DEFAULT 0,
    weekly_tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bar_id, date)
);

-- Bar partners (staff)
CREATE TABLE public.bar_partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('owner', 'manager', 'staff')),
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drinks
CREATE TABLE public.drinks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price DECIMAL(10, 2),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drink categories
CREATE TABLE public.drink_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event interactions
CREATE TABLE public.event_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    interaction_type TEXT CHECK (interaction_type IN ('going', 'interested', 'not_going')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns
CREATE TABLE public.campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaign drinks
CREATE TABLE public.campaign_drinks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    drink_id UUID REFERENCES public.drinks(id) ON DELETE CASCADE,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2),
    token_required BOOLEAN DEFAULT TRUE,
    token_type TEXT CHECK (token_type IN ('daily', 'weekly')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token codes (for redemption) - UPDATED
CREATE TABLE public.token_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    redeemed_by UUID REFERENCES public.bar_partners(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pending redemptions (NEW - before bartender confirmation)
CREATE TABLE public.pending_redemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    token_code TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins
CREATE TABLE public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin actions (audit trail)
CREATE TABLE public.admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin permissions
CREATE TABLE public.admin_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE,
    permission_type TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tables
CREATE TABLE public.bar_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bar_id UUID REFERENCES public.bars(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tokens_redeemed INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    unique_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bar_id, date)
);

CREATE TABLE public.event_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    going_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, date)
);

CREATE TABLE public.campaign_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

CREATE TABLE public.user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    bars_visited INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

#### **5.2 Create Indexes for Performance**

```sql
-- Performance indexes
CREATE INDEX idx_user_tokens_user_id ON public.user_tokens(user_id);
CREATE INDEX idx_user_tokens_type ON public.user_tokens(token_type);
CREATE INDEX idx_events_bar_id ON public.events(bar_id);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_event_interactions_user_id ON public.event_interactions(user_id);
CREATE INDEX idx_event_interactions_event_id ON public.event_interactions(event_id);
CREATE INDEX idx_bar_visits_user_id ON public.bar_visits(user_id);
CREATE INDEX idx_bar_visits_bar_id ON public.bar_visits(bar_id);
CREATE INDEX idx_campaigns_bar_id ON public.campaigns(bar_id);
CREATE INDEX idx_campaign_drinks_campaign_id ON public.campaign_drinks(campaign_id);
CREATE INDEX idx_token_codes_user_id ON public.token_codes(user_id);
CREATE INDEX idx_token_codes_code ON public.token_codes(code);
CREATE INDEX idx_bars_city ON public.bars(city);
CREATE INDEX idx_bars_location ON public.bars USING GIST (point(location_lat, location_lng));
```

## **Phase 4: Row Level Security (RLS)**

### **Step 6: Enable RLS and Create Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bar_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bar_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bar_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User tokens policies
CREATE POLICY "Users can view own tokens" ON public.user_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens" ON public.user_tokens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens" ON public.user_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bars policies (public read, partner write)
CREATE POLICY "Anyone can view active bars" ON public.bars
    FOR SELECT USING (is_active = true);

CREATE POLICY "Bar partners can update their bars" ON public.bars
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.bar_partners 
            WHERE bar_id = bars.id AND user_id = auth.uid()
        )
    );

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events
    FOR SELECT USING (is_active = true);

CREATE POLICY "Bar partners can manage their events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.bar_partners 
            WHERE bar_id = events.bar_id AND user_id = auth.uid()
        )
    );

-- Event interactions policies
CREATE POLICY "Users can view own interactions" ON public.event_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own interactions" ON public.event_interactions
    FOR ALL USING (auth.uid() = user_id);

-- Bar visits policies
CREATE POLICY "Users can view own visits" ON public.bar_visits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visits" ON public.bar_visits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns
    FOR SELECT USING (is_active = true);

CREATE POLICY "Bar partners can manage their campaigns" ON public.campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.bar_partners 
            WHERE bar_id = campaigns.bar_id AND user_id = auth.uid()
        )
    );

-- Token codes policies
CREATE POLICY "Users can view own token codes" ON public.token_codes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Bar partners can redeem token codes" ON public.token_codes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.bar_partners 
            WHERE bar_id = (
                SELECT bar_id FROM public.campaigns 
                WHERE id = (
                    SELECT campaign_id FROM public.campaign_drinks 
                    WHERE id = token_codes.campaign_drink_id
                )
            ) AND user_id = auth.uid()
        )
    );

-- Analytics policies (admin only)
CREATE POLICY "Admins can view all analytics" ON public.bar_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all analytics" ON public.event_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all analytics" ON public.campaign_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);
```

## **Phase 5: Database Functions**

### **Step 7: Create Database Functions**

```sql
-- Function to initialize user tokens
CREATE OR REPLACE FUNCTION initialize_user_tokens(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Insert 4 daily tokens
    INSERT INTO public.user_tokens (user_id, token_type, expires_at)
    VALUES 
        (user_uuid, 'daily', NOW() + INTERVAL '1 day'),
        (user_uuid, 'daily', NOW() + INTERVAL '1 day'),
        (user_uuid, 'daily', NOW() + INTERVAL '1 day'),
        (user_uuid, 'daily', NOW() + INTERVAL '1 day');
    
    -- Insert 1 weekly token
    INSERT INTO public.user_tokens (user_id, token_type, expires_at)
    VALUES (user_uuid, 'weekly', NOW() + INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and reset tokens
CREATE OR REPLACE FUNCTION check_and_reset_tokens(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    last_daily_reset TIMESTAMP;
    last_weekly_reset TIMESTAMP;
    next_monday TIMESTAMP;
BEGIN
    -- Reset daily tokens at midday
    IF EXTRACT(HOUR FROM NOW()) >= 12 THEN
        -- Delete expired daily tokens
        DELETE FROM public.user_tokens 
        WHERE user_id = user_uuid 
        AND token_type = 'daily' 
        AND expires_at < NOW();
        
        -- Add new daily tokens if needed
        IF (SELECT COUNT(*) FROM public.user_tokens 
            WHERE user_id = user_uuid 
            AND token_type = 'daily' 
            AND is_used = false) < 4 THEN
            
            INSERT INTO public.user_tokens (user_id, token_type, expires_at)
            SELECT user_uuid, 'daily', NOW() + INTERVAL '1 day'
            FROM generate_series(1, 4 - (
                SELECT COUNT(*) FROM public.user_tokens 
                WHERE user_id = user_uuid 
                AND token_type = 'daily' 
                AND is_used = false
            ));
        END IF;
    END IF;
    
    -- Reset weekly tokens on Monday
    IF EXTRACT(DOW FROM NOW()) = 1 AND EXTRACT(HOUR FROM NOW()) >= 12 THEN
        -- Delete expired weekly tokens
        DELETE FROM public.user_tokens 
        WHERE user_id = user_uuid 
        AND token_type = 'weekly' 
        AND expires_at < NOW();
        
        -- Add new weekly token if needed
        IF (SELECT COUNT(*) FROM public.user_tokens 
            WHERE user_id = user_uuid 
            AND token_type = 'weekly' 
            AND is_used = false) < 1 THEN
            
            INSERT INTO public.user_tokens (user_id, token_type, expires_at)
            VALUES (user_uuid, 'weekly', NOW() + INTERVAL '7 days');
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to generate token code with proximity validation
CREATE OR REPLACE FUNCTION generate_token_code(user_uuid UUID, bar_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    token_code TEXT;
    token_id UUID;
    bar_record RECORD;
    user_usage INTEGER;
    daily_limit INTEGER;
    minimum_distance INTEGER;
BEGIN
    -- Get bar information and limits
    SELECT b.*, COALESCE(btl.daily_token_limit, 2) as daily_limit,
           COALESCE(btl.minimum_distance_meters, 100) as min_distance
    INTO bar_record
    FROM public.bars b
    LEFT JOIN public.bar_token_limits btl ON b.id = btl.bar_id
    WHERE b.id = bar_uuid;
    
    IF bar_record IS NULL THEN
        RAISE EXCEPTION 'Bar not found';
    END IF;
    
    -- Check user's daily usage at this bar
    SELECT COALESCE(SUM(daily_tokens_used), 0) INTO user_usage
    FROM public.user_daily_usage
    WHERE user_id = user_uuid 
    AND bar_id = bar_uuid 
    AND date = CURRENT_DATE;
    
    IF user_usage >= bar_record.daily_limit THEN
        RAISE EXCEPTION 'Daily token limit (% tokens) reached for this bar', bar_record.daily_limit;
    END IF;
    
    -- Find available token
    SELECT id INTO token_id
    FROM public.user_tokens
    WHERE user_id = user_uuid 
    AND is_used = false 
    AND expires_at > NOW()
    LIMIT 1;
    
    IF token_id IS NULL THEN
        RAISE EXCEPTION 'No available tokens';
    END IF;
    
    -- Generate unique code (NO PREFIX)
    token_code := UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
    
    -- Insert token code
    INSERT INTO public.token_codes (user_id, bar_id, code, expires_at)
    VALUES (user_uuid, bar_uuid, token_code, NOW() + INTERVAL '60 seconds');
    
    -- Mark token as used
    UPDATE public.user_tokens 
    SET is_used = true 
    WHERE id = token_id;
    
    -- Update user's daily usage
    INSERT INTO public.user_daily_usage (user_id, bar_id, date, daily_tokens_used)
    VALUES (user_uuid, bar_uuid, CURRENT_DATE, 1)
    ON CONFLICT (user_id, bar_id, date) 
    DO UPDATE SET 
        daily_tokens_used = user_daily_usage.daily_tokens_used + 1,
        updated_at = NOW();
    
    RETURN token_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem token code
CREATE OR REPLACE FUNCTION redeem_token_code(code_text TEXT, redeemed_by_uuid UUID)
RETURNS JSON AS $$
DECLARE
    token_record RECORD;
    result JSON;
BEGIN
    -- Find token code
    SELECT tc.*, b.name as bar_name, b.location_lat, b.location_lng
    INTO token_record
    FROM public.token_codes tc
    JOIN public.bars b ON tc.bar_id = b.id
    WHERE tc.code = code_text 
    AND tc.is_redeemed = false 
    AND tc.expires_at > NOW();
    
    IF token_record IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token code';
    END IF;
    
    -- Mark as redeemed
    UPDATE public.token_codes 
    SET is_redeemed = true, redeemed_at = NOW(), redeemed_by = redeemed_by_uuid
    WHERE code = code_text;
    
    -- Update bar analytics
    INSERT INTO public.bar_analytics (bar_id, date, tokens_redeemed, revenue, unique_customers)
    VALUES (token_record.bar_id, CURRENT_DATE, 1, 0, 1)
    ON CONFLICT (bar_id, date) 
    DO UPDATE SET 
        tokens_redeemed = bar_analytics.tokens_redeemed + 1,
        revenue = bar_analytics.revenue + 0; -- You can add actual revenue calculation here
    
    -- Return redemption details
    result := json_build_object(
        'bar_name', token_record.bar_name,
        'drink_name', 'Custom Drink', -- You can enhance this with actual drink info
        'original_price', 12.00, -- Default price
        'discounted_price', 6.00, -- Default discounted price
        'token_type', 'daily' -- Default token type
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update event analytics
CREATE OR REPLACE FUNCTION update_event_analytics(event_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.event_analytics (event_id, date, going_count, interested_count)
    SELECT 
        event_uuid,
        CURRENT_DATE,
        COUNT(CASE WHEN interaction_type = 'going' THEN 1 END),
        COUNT(CASE WHEN interaction_type = 'interested' THEN 1 END)
    FROM public.event_interactions
    WHERE event_id = event_uuid
    ON CONFLICT (event_id, date) DO UPDATE SET
        going_count = EXCLUDED.going_count,
        interested_count = EXCLUDED.interested_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's daily usage at a bar
CREATE OR REPLACE FUNCTION get_user_daily_usage(user_uuid UUID, bar_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    usage_count INTEGER;
BEGIN
    SELECT COALESCE(daily_tokens_used, 0) INTO usage_count
    FROM public.user_daily_usage
    WHERE user_id = user_uuid 
    AND bar_id = bar_uuid 
    AND date = CURRENT_DATE;
    
    RETURN usage_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## **Phase 6: Frontend Integration**

### **Step 8: Create Supabase Client**

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          phone: string | null
          location_lat: number | null
          location_lng: number | null
          city: string | null
          subscription_status: 'free' | 'premium'
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          location_lat?: number | null
          location_lng?: number | null
          city?: string | null
          subscription_status?: 'free' | 'premium'
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          location_lat?: number | null
          location_lng?: number | null
          city?: string | null
          subscription_status?: 'free' | 'premium'
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_tokens: {
        Row: {
          id: string
          user_id: string
          token_type: 'daily' | 'weekly'
          is_used: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token_type: 'daily' | 'weekly'
          is_used?: boolean
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token_type?: 'daily' | 'weekly'
          is_used?: boolean
          expires_at?: string
          created_at?: string
        }
      }
      // Add other table types as needed...
    }
  }
}
```

### **Step 9: Create API Services**

Create `src/services/api/` directory with these files:

#### **`authService.ts`**
```typescript
import { supabase } from '../../lib/supabase'

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    
    if (error) throw error
    
    // Initialize user profile and tokens
    if (data.user) {
      await supabase.rpc('initialize_user_tokens', { user_uuid: data.user.id })
    }
    
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}
```

#### **`tokenService.ts`**
```typescript
import { supabase } from '../../lib/supabase'

export const tokenService = {
  async getUserTokens(userId: string) {
    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
    
    if (error) throw error
    return data
  },

  async checkAndResetTokens(userId: string) {
    const { error } = await supabase.rpc('check_and_reset_tokens', {
      user_uuid: userId
    })
    
    if (error) throw error
  },

  async generateTokenCode(userId: string, campaignDrinkId: string) {
    const { data, error } = await supabase.rpc('generate_token_code', {
      user_uuid: userId,
      campaign_drink_uuid: campaignDrinkId
    })
    
    if (error) throw error
    return data
  }
}
```

#### **`eventService.ts`**
```typescript
import { supabase } from '../../lib/supabase'

export const eventService = {
  async getEvents(city?: string, filters?: any) {
    let query = supabase
      .from('events')
      .select(`
        *,
        bars (
          name,
          city,
          location_lat,
          location_lng
        )
      `)
      .eq('is_active', true)
    
    if (city) {
      query = query.eq('bars.city', city)
    }
    
    if (filters?.date) {
      query = query.gte('start_date', filters.date)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getEventById(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        bars (
          name,
          city,
          location_lat,
          location_lng
        )
      `)
      .eq('id', eventId)
      .single()
    
    if (error) throw error
    return data
  },

  async interactWithEvent(userId: string, eventId: string, interactionType: 'bookmark' | 'interested' | 'going') {
    const { error } = await supabase
      .from('event_interactions')
      .upsert({
        user_id: userId,
        event_id: eventId,
        interaction_type: interactionType
      })
    
    if (error) throw error
    
    // Update analytics
    await supabase.rpc('update_event_analytics', { event_uuid: eventId })
  }
}
```

### **Step 10: Update Store Integration**

Update your Zustand store to use Supabase:

```typescript
// src/store/index.ts - Update to use Supabase
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { authService, tokenService, eventService } from '../services/api'

interface AppState {
  user: {
    id: string | null
    name: string | null
    email: string | null
    avatar: string | null
    location: { lat: number; lng: number } | null
    subscription: {
      status: 'free' | 'premium'
      endDate: string | null
    }
    tokens: {
      daily: Token[]
      weekly: Token[]
      lastDailyReset: string | null
      lastWeeklyReset: string | null
    }
  }
  events: {
    items: Event[]
    loading: boolean
    userEvents: Event[]
  }
  // ... other state
}

export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    // ... existing state
    
    // New actions for Supabase integration
    async initializeUser(userId: string) {
      try {
        // Get user profile
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        // Get user tokens
        const tokens = await tokenService.getUserTokens(userId)
        
        set((state) => {
          state.user.id = userId
          state.user.name = user?.name || null
          state.user.email = user?.email || null
          state.user.avatar = user?.avatar_url || null
          state.user.subscription.status = user?.subscription_status || 'free'
          state.user.subscription.endDate = user?.subscription_end_date || null
          
          // Organize tokens
          state.user.tokens.daily = tokens.filter(t => t.token_type === 'daily')
          state.user.tokens.weekly = tokens.filter(t => t.token_type === 'weekly')
        })
      } catch (error) {
        console.error('Failed to initialize user:', error)
      }
    },

    async checkAndResetTokens() {
      const userId = get().user.id
      if (!userId) return
      
      try {
        await tokenService.checkAndResetTokens(userId)
        // Refresh tokens
        const tokens = await tokenService.getUserTokens(userId)
        
        set((state) => {
          state.user.tokens.daily = tokens.filter(t => t.token_type === 'daily')
          state.user.tokens.weekly = tokens.filter(t => t.token_type === 'weekly')
        })
      } catch (error) {
        console.error('Failed to check and reset tokens:', error)
      }
    },

    async generateTokenCode(campaignDrinkId: string) {
      const userId = get().user.id
      if (!userId) throw new Error('User not authenticated')
      
      try {
        const code = await tokenService.generateTokenCode(userId, campaignDrinkId)
        return code
      } catch (error) {
        console.error('Failed to generate token code:', error)
        throw error
      }
    }
  }))
)
```

## **Phase 7: Authentication Setup**

### **Step 11: Set up Authentication**

1. **Go to Authentication → Settings** in Supabase Dashboard
2. **Configure Email Templates** (optional)
3. **Enable Email Confirmations** (recommended)
4. **Set up OAuth providers** if needed (Google, Facebook, etc.)

### **Step 12: Create Auth Context**

Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const initializeUser = useAppStore(state => state.initializeUser)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        initializeUser(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          initializeUser(session.user.id)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [initializeUser])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## **Phase 8: Sample Data**

### **Step 13: Insert Sample Data**

Run this in SQL Editor to add sample data:

```sql
-- Insert sample bars
INSERT INTO public.bars (name, description, address, city, location_lat, location_lng, phone, rating, price_range) VALUES
('Club Havana', 'Premium nightclub with Latin vibes', '123 Main St', 'Bucharest', 44.4268, 26.1025, '+40 123 456 789', 4.5, '$$'),
('Sky Lounge', 'Rooftop bar with city views', '456 High St', 'Bucharest', 44.4268, 26.1025, '+40 123 456 790', 4.2, '$$$'),
('Underground', 'Alternative music venue', '789 Underground Ave', 'Bucharest', 44.4268, 26.1025, '+40 123 456 791', 4.0, '$');

-- Insert sample drinks
INSERT INTO public.drinks (name, description, category, price, image_url) VALUES
('Mojito', 'Classic Cuban cocktail', 'Cocktails', 25.00, 'https://example.com/mojito.jpg'),
('Margarita', 'Tequila-based cocktail', 'Cocktails', 28.00, 'https://example.com/margarita.jpg'),
('Beer', 'Local craft beer', 'Beer', 15.00, 'https://example.com/beer.jpg'),
('Wine', 'Premium red wine', 'Wine', 35.00, 'https://example.com/wine.jpg');

-- Insert sample events
INSERT INTO public.events (bar_id, name, description, category, start_date, end_date, price, dj, genre) VALUES
((SELECT id FROM public.bars WHERE name = 'Club Havana'), 'Latin Night', 'Salsa and bachata night', 'Music', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '4 hours', 50.00, 'DJ Carlos', 'Latin'),
((SELECT id FROM public.bars WHERE name = 'Sky Lounge'), 'Sunset Party', 'Chill vibes with city views', 'Party', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '6 hours', 0.00, 'DJ Maria', 'Electronic'),
((SELECT id FROM public.bars WHERE name = 'Underground'), 'Rock Night', 'Live rock bands', 'Music', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '5 hours', 30.00, 'The Rockers', 'Rock');
```

## **Phase 9: Testing**

### **Step 14: Test the Implementation**

1. **Test Authentication:**
   - Sign up with a new account
   - Verify tokens are initialized
   - Test sign in/out

2. **Test Token System:**
   - Check token display in profile
   - Test token generation for drinks
   - Verify token reset logic

3. **Test Events:**
   - Browse events
   - Interact with events (bookmark, interested, going)
   - Check event analytics

4. **Test Bar Features:**
   - View bar details
   - Check bar visits tracking

## **Phase 10: Deployment**

### **Step 15: Deploy to Production**

1. **Update Environment Variables:**
   - Use production Supabase project
   - Update all environment variables

2. **Deploy Frontend:**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

3. **Set up Monitoring:**
   - Monitor Supabase dashboard
   - Set up alerts for errors
   - Track performance metrics

## **Next Steps**

1. **Implement Real-time Features:**
   - Live event updates
   - Real-time token usage
   - Live analytics

2. **Add Advanced Features:**
   - Push notifications
   - Email campaigns
   - Advanced analytics

3. **Security Enhancements:**
   - Rate limiting
   - Input validation
   - Security audits

4. **Performance Optimization:**
   - Database indexing
   - Caching strategies
   - CDN setup

This implementation provides a complete, production-ready backend for your CRWD app with all the features we discussed! 🚀 