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
  },

  async getUserEvents(userId: string) {
    const { data, error } = await supabase
      .from('event_interactions')
      .select(`
        event_id,
        interaction_type,
        events (
          *,
          bars (
            name,
            city
          )
        )
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async getTrendingEvents() {
    const { data, error } = await supabase
      .from('event_interactions')
      .select(`
        event_id,
        events (
          *,
          bars (
            name,
            city
          )
        )
      `)
      .in('interaction_type', ['interested', 'going'])
    
    if (error) throw error
    
    // Count interactions per event
    const eventCounts = data.reduce((acc, interaction) => {
      const eventId = interaction.event_id
      if (!acc[eventId]) {
        acc[eventId] = { count: 0, event: interaction.events }
      }
      acc[eventId].count++
      return acc
    }, {} as Record<string, { count: number; event: any }>)
    
    // Filter events with 200+ interactions
    return Object.values(eventCounts)
      .filter(item => item.count >= 200)
      .map(item => item.event)
  }
} 