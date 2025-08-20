const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'Network error')
  }
}

// Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Bar {
  id: string
  name: string
  description?: string
  address: string
  lat: number
  lng: number
  phone?: string
  priceRange?: string
  rating: number
  reviewCount: number
  isOpen: boolean
  crowdLevel?: string
  openUntil?: string
  images: string[]
  tags: string[]
  type?: string
  availableDrinks: number
  drinksServedToday: number
  totalTokensRedeemed: number
  lastUpdated: string
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
  dj?: string
  genre?: string
  price?: number
  ticketPrice?: number
  image: string
  images: string[]
  category: string
  tags: string[]
  capacity: number
  attendees: number
  interestedCount: number
  goingCount: number
  isTicketed: boolean
  ticketUrl?: string
  status: string
  ageRestriction?: string
  dressCode?: string
  isPublic: boolean
  canGuestsInviteFriends: boolean
  hostMessage?: string
  discussionEnabled: boolean
  photosEnabled: boolean
  views: number
  shares: number
  createdBy: string
  coHosts: string[]
  barId: string
  bar?: Bar
  creator?: User
}

export interface Drink {
  id: string
  name: string
  description?: string
  category: string
  image?: string
  alcoholContent?: string
  volume?: string
  originalPrice?: string
  tokenCost: number
  isAvailable: boolean
  barId: string
  bar?: Bar
}

export interface Review {
  id: string
  userId: string
  barId: string
  rating: number
  comment?: string
  createdAt: string
  user?: User
  bar?: Bar
}

export interface AnalyticsData {
  totalUsers: number
  totalBars: number
  totalEvents: number
  totalRevenue: number
  monthlyGrowth: {
    users: number
    events: number
    revenue: number
    bars: number
  }
  topBars: Array<{
    id: string
    name: string
    events: number
    revenue: number
    rating: number
  }>
  eventCategories: Array<{
    category: string
    events: number
    percentage: number
  }>
  userDemographics: Array<{
    age: string
    users: number
    percentage: number
  }>
}

// API Functions
export const api = {
  // Users
  async getUsers(params?: { search?: string; page?: number; limit?: number }): Promise<User[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<User[]>(`/users?${searchParams.toString()}`)
  },

  async getUser(id: string): Promise<User> {
    return apiRequest<User>(`/users/${id}`)
  },

  async createUser(data: Partial<User>): Promise<User> {
    return apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteUser(id: string): Promise<void> {
    return apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    })
  },

  // Bars
  async getBars(params?: { search?: string; page?: number; limit?: number }): Promise<Bar[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<Bar[]>(`/bars?${searchParams.toString()}`)
  },

  async getBar(id: string): Promise<Bar> {
    return apiRequest<Bar>(`/bars/${id}`)
  },

  async createBar(data: Partial<Bar>): Promise<Bar> {
    return apiRequest<Bar>('/bars', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateBar(id: string, data: Partial<Bar>): Promise<Bar> {
    return apiRequest<Bar>(`/bars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteBar(id: string): Promise<void> {
    return apiRequest<void>(`/bars/${id}`, {
      method: 'DELETE',
    })
  },

  async getBarAnalytics(id: string): Promise<any> {
    return apiRequest<any>(`/bars/${id}/analytics`)
  },

  // Bar Drinks Management
  async getBarDrinks(barId: string, params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<Drink[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<Drink[]>(`/bars/${barId}/drinks?${searchParams.toString()}`)
  },

  async addDrinkToBar(barId: string, data: Partial<Drink>): Promise<Drink> {
    return apiRequest<Drink>(`/bars/${barId}/drinks`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateBarDrink(barId: string, drinkId: string, data: Partial<Drink>): Promise<Drink> {
    return apiRequest<Drink>(`/bars/${barId}/drinks/${drinkId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteBarDrink(barId: string, drinkId: string): Promise<void> {
    return apiRequest<void>(`/bars/${barId}/drinks/${drinkId}`, {
      method: 'DELETE',
    })
  },

  // Events
  async getEvents(params?: { search?: string; page?: number; limit?: number }): Promise<Event[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<Event[]>(`/events?${searchParams.toString()}`)
  },

  async getEvent(id: string): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`)
  },

  async createEvent(data: Partial<Event>): Promise<Event> {
    return apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteEvent(id: string): Promise<void> {
    return apiRequest<void>(`/events/${id}`, {
      method: 'DELETE',
    })
  },

  // Drinks
  async getDrinks(params?: { search?: string; barId?: string; page?: number; limit?: number }): Promise<Drink[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.barId) searchParams.append('barId', params.barId)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<Drink[]>(`/drinks?${searchParams.toString()}`)
  },

  async getDrink(id: string): Promise<Drink> {
    return apiRequest<Drink>(`/drinks/${id}`)
  },

  async createDrink(data: Partial<Drink>): Promise<Drink> {
    return apiRequest<Drink>('/drinks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateDrink(id: string, data: Partial<Drink>): Promise<Drink> {
    return apiRequest<Drink>(`/drinks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteDrink(id: string): Promise<void> {
    return apiRequest<void>(`/drinks/${id}`, {
      method: 'DELETE',
    })
  },

  // Reviews
  async getReviews(params?: { barId?: string; userId?: string; page?: number; limit?: number }): Promise<Review[]> {
    const searchParams = new URLSearchParams()
    if (params?.barId) searchParams.append('barId', params.barId)
    if (params?.userId) searchParams.append('userId', params.userId)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    return apiRequest<Review[]>(`/reviews?${searchParams.toString()}`)
  },

  async deleteReview(id: string): Promise<void> {
    return apiRequest<void>(`/reviews/${id}`, {
      method: 'DELETE',
    })
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    return apiRequest<AnalyticsData>('/analytics')
  },

  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<AnalyticsData> {
    return apiRequest<AnalyticsData>(`/analytics?startDate=${startDate}&endDate=${endDate}`)
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
    return apiRequest<{ status: string; timestamp: string; environment: string }>('/health')
  },
}

export { ApiError }

