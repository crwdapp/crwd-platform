import { z } from 'zod'

// User types
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  avatar: z.string().optional(),
  phone: z.string().optional(),
})

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
})

// Bar types
export const CreateBarSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  phone: z.string().optional(),
  priceRange: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  type: z.string().optional(),
})

export const UpdateBarSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  address: z.string().min(1).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  priceRange: z.string().optional(),
  isOpen: z.boolean().optional(),
  crowdLevel: z.string().optional(),
  openUntil: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  type: z.string().optional(),
})

// Event types
export const CreateEventSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  dj: z.string().optional(),
  genre: z.string().optional(),
  price: z.number().optional(),
  ticketPrice: z.number().optional(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  category: z.enum(['MUSIC', 'PARTY', 'HAPPY_HOUR', 'LIVE_SHOW', 'KARAOKE', 'TRIVIA', 'SPORTS', 'NETWORKING', 'SPECIAL']),
  tags: z.array(z.string()).optional(),
  capacity: z.number().positive(),
  isTicketed: z.boolean().optional(),
  ticketUrl: z.string().optional(),
  ageRestriction: z.string().optional(),
  dressCode: z.string().optional(),
  isPublic: z.boolean().optional(),
  canGuestsInviteFriends: z.boolean().optional(),
  hostMessage: z.string().optional(),
  discussionEnabled: z.boolean().optional(),
  photosEnabled: z.boolean().optional(),
  createdBy: z.string(),
  coHosts: z.array(z.string()).optional(),
  barId: z.string(),
})

export const UpdateEventSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  dj: z.string().optional(),
  genre: z.string().optional(),
  price: z.number().optional(),
  ticketPrice: z.number().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.enum(['MUSIC', 'PARTY', 'HAPPY_HOUR', 'LIVE_SHOW', 'KARAOKE', 'TRIVIA', 'SPORTS', 'NETWORKING', 'SPECIAL']).optional(),
  tags: z.array(z.string()).optional(),
  capacity: z.number().positive().optional(),
  isTicketed: z.boolean().optional(),
  ticketUrl: z.string().optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'SOLD_OUT']).optional(),
  ageRestriction: z.string().optional(),
  dressCode: z.string().optional(),
  isPublic: z.boolean().optional(),
  canGuestsInviteFriends: z.boolean().optional(),
  hostMessage: z.string().optional(),
  discussionEnabled: z.boolean().optional(),
  photosEnabled: z.boolean().optional(),
  coHosts: z.array(z.string()).optional(),
})

// Drink types
export const CreateDrinkSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  image: z.string().optional(),
  alcoholContent: z.string().optional(),
  volume: z.string().optional(),
  originalPrice: z.string().optional(),
  tokenCost: z.number().optional(),
  isAvailable: z.boolean().optional(),
  barId: z.string(),
})

export const UpdateDrinkSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  image: z.string().optional(),
  alcoholContent: z.string().optional(),
  volume: z.string().optional(),
  originalPrice: z.string().optional(),
  tokenCost: z.number().optional(),
  isAvailable: z.boolean().optional(),
})

// Review types
export const CreateReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  barId: z.string(),
})

// Event attendance types
export const CreateEventAttendanceSchema = z.object({
  eventId: z.string(),
  status: z.enum(['GOING', 'INTERESTED', 'NOT_GOING']),
})

// Event bookmark types
export const CreateEventBookmarkSchema = z.object({
  eventId: z.string(),
})

// Event comment types
export const CreateEventCommentSchema = z.object({
  eventId: z.string(),
  content: z.string().min(1),
})

// Token types
export const UpdateTokenSchema = z.object({
  amount: z.number(),
})

// Query types
export const BarQuerySchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)).pipe(z.number()).optional(),
  lng: z.string().transform((val) => parseFloat(val)).pipe(z.number()).optional(),
  radius: z.string().transform((val) => parseFloat(val)).pipe(z.number()).optional(),
  tags: z.string().transform((val) => val.split(',')).pipe(z.array(z.string())).optional(),
  isOpen: z.string().transform((val) => val === 'true').pipe(z.boolean()).optional(),
  priceRange: z.string().optional(),
  limit: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
  offset: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
})

export const EventQuerySchema = z.object({
  category: z.enum(['MUSIC', 'PARTY', 'HAPPY_HOUR', 'LIVE_SHOW', 'KARAOKE', 'TRIVIA', 'SPORTS', 'NETWORKING', 'SPECIAL']).optional(),
  date: z.string().optional(),
  barId: z.string().optional(),
  isTicketed: z.string().transform((val) => val === 'true').pipe(z.boolean()).optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'SOLD_OUT']).optional(),
  limit: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
  offset: z.string().transform((val) => parseInt(val)).pipe(z.number()).optional(),
})

// Type exports
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type CreateBarInput = z.infer<typeof CreateBarSchema>
export type UpdateBarInput = z.infer<typeof UpdateBarSchema>
export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type CreateDrinkInput = z.infer<typeof CreateDrinkSchema>
export type UpdateDrinkInput = z.infer<typeof UpdateDrinkSchema>
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>
export type CreateEventAttendanceInput = z.infer<typeof CreateEventAttendanceSchema>
export type CreateEventBookmarkInput = z.infer<typeof CreateEventBookmarkSchema>
export type CreateEventCommentInput = z.infer<typeof CreateEventCommentSchema>
export type UpdateTokenInput = z.infer<typeof UpdateTokenSchema>
export type BarQueryInput = z.infer<typeof BarQuerySchema>
export type EventQueryInput = z.infer<typeof EventQuerySchema>
