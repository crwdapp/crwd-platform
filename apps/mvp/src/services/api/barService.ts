import { supabase } from '../../lib/supabase'

export const barService = {
  async getBars(city?: string) {
    let query = supabase
      .from('bars')
      .select('*')
      .eq('is_active', true)
    
    if (city) {
      query = query.eq('city', city)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getBarById(barId: string) {
    const { data, error } = await supabase
      .from('bars')
      .select('*')
      .eq('id', barId)
      .single()
    
    if (error) throw error
    return data
  },

  async recordBarVisit(userId: string, barId: string, moneySaved: number = 0) {
    const { error } = await supabase
      .from('bar_visits')
      .insert({
        user_id: userId,
        bar_id: barId,
        money_saved: moneySaved
      })
    
    if (error) throw error
  },

  async getUserVisits(userId: string) {
    const { data, error } = await supabase
      .from('bar_visits')
      .select(`
        *,
        bars (
          name,
          city,
          location_lat,
          location_lng
        )
      `)
      .eq('user_id', userId)
      .order('visit_date', { ascending: false })
      .limit(5)
    
    if (error) throw error
    return data
  },

  async getBarAnalytics(barId: string) {
    const { data, error } = await supabase
      .from('bar_analytics')
      .select('*')
      .eq('bar_id', barId)
      .order('date', { ascending: false })
      .limit(30)
    
    if (error) throw error
    return data
  }
}