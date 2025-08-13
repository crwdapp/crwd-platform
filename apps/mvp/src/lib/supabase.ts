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
      bars: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          city: string
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          website: string | null
          opening_hours: any | null
          images: string[] | null
          rating: number | null
          price_range: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          city: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          website?: string | null
          opening_hours?: any | null
          images?: string[] | null
          rating?: number | null
          price_range?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          city?: string
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          website?: string | null
          opening_hours?: any | null
          images?: string[] | null
          rating?: number | null
          price_range?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          bar_id: string
          name: string
          description: string | null
          category: string | null
          start_date: string
          end_date: string | null
          price: number
          is_ticketed: boolean
          ticket_url: string | null
          dj: string | null
          genre: string | null
          age_restriction: string | null
          dress_code: string | null
          image_url: string | null
          views_count: number
          shares_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bar_id: string
          name: string
          description?: string | null
          category?: string | null
          start_date: string
          end_date?: string | null
          price?: number
          is_ticketed?: boolean
          ticket_url?: string | null
          dj?: string | null
          genre?: string | null
          age_restriction?: string | null
          dress_code?: string | null
          image_url?: string | null
          views_count?: number
          shares_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bar_id?: string
          name?: string
          description?: string | null
          category?: string | null
          start_date?: string
          end_date?: string | null
          price?: number
          is_ticketed?: boolean
          ticket_url?: string | null
          dj?: string | null
          genre?: string | null
          age_restriction?: string | null
          dress_code?: string | null
          image_url?: string | null
          views_count?: number
          shares_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      event_interactions: {
        Row: {
          id: string
          user_id: string
          event_id: string
          interaction_type: 'bookmark' | 'interested' | 'going'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          interaction_type: 'bookmark' | 'interested' | 'going'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          interaction_type?: 'bookmark' | 'interested' | 'going'
          created_at?: string
        }
      }
      bar_visits: {
        Row: {
          id: string
          user_id: string
          bar_id: string
          visit_date: string
          money_saved: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bar_id: string
          visit_date?: string
          money_saved?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bar_id?: string
          visit_date?: string
          money_saved?: number
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          bar_id: string
          name: string
          description: string | null
          start_date: string
          end_date: string | null
          is_active: boolean
          views_count: number
          created_at: string
        }
        Insert: {
          id?: string
          bar_id: string
          name: string
          description?: string | null
          start_date: string
          end_date?: string | null
          is_active?: boolean
          views_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          bar_id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          views_count?: number
          created_at?: string
        }
      }
      campaign_drinks: {
        Row: {
          id: string
          campaign_id: string
          drink_id: string
          original_price: number
          discounted_price: number | null
          token_required: boolean
          token_type: 'daily' | 'weekly' | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          drink_id: string
          original_price: number
          discounted_price?: number | null
          token_required?: boolean
          token_type?: 'daily' | 'weekly' | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          drink_id?: string
          original_price?: number
          discounted_price?: number | null
          token_required?: boolean
          token_type?: 'daily' | 'weekly' | null
          is_active?: boolean
          created_at?: string
        }
      }
      token_codes: {
        Row: {
          id: string
          user_id: string
          campaign_drink_id: string
          code: string
          is_redeemed: boolean
          redeemed_at: string | null
          redeemed_by: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          campaign_drink_id: string
          code: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          campaign_drink_id?: string
          code?: string
          is_redeemed?: boolean
          redeemed_at?: string | null
          redeemed_by?: string | null
          expires_at?: string
          created_at?: string
        }
      }
      drinks: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          price: number | null
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          price?: number | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          price?: number | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      bar_partners: {
        Row: {
          id: string
          user_id: string
          bar_id: string
          role: 'owner' | 'manager' | 'staff'
          permissions: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bar_id: string
          role: 'owner' | 'manager' | 'staff'
          permissions?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bar_id?: string
          role?: 'owner' | 'manager' | 'staff'
          permissions?: any | null
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          user_id: string
          role: 'super_admin' | 'admin' | 'moderator'
          permissions: any | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'super_admin' | 'admin' | 'moderator'
          permissions?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'super_admin' | 'admin' | 'moderator'
          permissions?: any | null
          created_at?: string
        }
      }
      admin_actions: {
        Row: {
          id: string
          admin_id: string
          action_type: string
          target_type: string | null
          target_id: string | null
          details: any | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action_type: string
          target_type?: string | null
          target_id?: string | null
          details?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action_type?: string
          target_type?: string | null
          target_id?: string | null
          details?: any | null
          created_at?: string
        }
      }
      admin_permissions: {
        Row: {
          id: string
          admin_id: string
          permission_type: string
          resource_type: string | null
          resource_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          permission_type: string
          resource_type?: string | null
          resource_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          permission_type?: string
          resource_type?: string | null
          resource_id?: string | null
          created_at?: string
        }
      }
      bar_analytics: {
        Row: {
          id: string
          bar_id: string
          date: string
          total_visits: number
          total_revenue: number
          token_redemptions: number
          campaign_views: number
          event_views: number
          created_at: string
        }
        Insert: {
          id?: string
          bar_id: string
          date: string
          total_visits?: number
          total_revenue?: number
          token_redemptions?: number
          campaign_views?: number
          event_views?: number
          created_at?: string
        }
        Update: {
          id?: string
          bar_id?: string
          date?: string
          total_visits?: number
          total_revenue?: number
          token_redemptions?: number
          campaign_views?: number
          event_views?: number
          created_at?: string
        }
      }
      event_analytics: {
        Row: {
          id: string
          event_id: string
          date: string
          views: number
          shares: number
          going_count: number
          interested_count: number
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          date: string
          views?: number
          shares?: number
          going_count?: number
          interested_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          date?: string
          views?: number
          shares?: number
          going_count?: number
          interested_count?: number
          created_at?: string
        }
      }
      campaign_analytics: {
        Row: {
          id: string
          campaign_id: string
          date: string
          views: number
          token_redemptions: number
          total_revenue: number
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          date: string
          views?: number
          token_redemptions?: number
          total_revenue?: number
          created_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          date?: string
          views?: number
          token_redemptions?: number
          total_revenue?: number
          created_at?: string
        }
      }
      user_analytics: {
        Row: {
          id: string
          user_id: string
          date: string
          events_viewed: number
          events_interacted: number
          bars_visited: number
          tokens_used: number
          money_saved: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          events_viewed?: number
          events_interacted?: number
          bars_visited?: number
          tokens_used?: number
          money_saved?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          events_viewed?: number
          events_interacted?: number
          bars_visited?: number
          tokens_used?: number
          money_saved?: number
          created_at?: string
        }
      }
    }
  }
} 