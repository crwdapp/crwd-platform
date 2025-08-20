"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Star,
  ArrowLeft,
  Save,
  X,
  Building2,
  Ticket,
  TrendingUp,
  BarChart3,
  MessageSquare,
  CreditCard,
  Shield,
  Activity,
  Clock,
  Heart,
  ShoppingBag,
  Target,
  Crown,
} from "lucide-react"

// Mock data for users - using the same token-based schema as users-content.tsx
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+40 721 123 456",
    city: "Bucharest",
    role: "subscribed",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    avatar: "/avatars/01.png",
    subscription: {
      status: "active",
      tier: "premium",
      plan: "yearly",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: 480,
      autoRenew: true,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: true,
      canUseTokens: true,
      tokensPerDay: 6,
      maxTokens: 6
    },
    tokens: {
      available: 4,
      usedToday: 2,
      totalUsed: 156,
      lastReset: "2024-01-20T00:00:00Z"
    },
    stats: {
      totalVisits: 45,
      favoriteBars: 8,
      eventsAttended: 12,
      totalSpent: 1250
    },
    recentActivity: [
      { id: 1, type: "event_booking", description: "Booked ticket for Live Jazz Night", date: new Date("2024-01-10T15:30:00Z") },
      { id: 2, type: "review", description: "Left 5-star review for The Blue Moon", date: new Date("2024-01-08T12:15:00Z") },
      { id: 3, type: "visit", description: "Visited Downtown Pub", date: new Date("2024-01-05T20:45:00Z") },
    ],
    upcomingEvents: [
      { id: 1, name: "Live Jazz Night", date: "2024-01-15", bar: "The Blue Moon", ticketType: "General Admission" },
      { id: 2, name: "Craft Beer Festival", date: "2024-01-20", bar: "The Blue Moon", ticketType: "Early Bird" },
    ],
    pastEvents: [
      { id: 1, name: "Wine Tasting Evening", date: "2024-01-10", bar: "The Blue Moon", rating: 5 },
      { id: 2, name: "Trivia Night", date: "2024-01-03", bar: "Downtown Pub", rating: 4 },
    ],
    reviews: [
      { id: 1, bar: "The Blue Moon", rating: 5, comment: "Amazing jazz atmosphere!", date: new Date("2024-01-08T12:15:00Z") },
      { id: 2, bar: "Downtown Pub", rating: 4, comment: "Great sports atmosphere", date: new Date("2024-01-03T20:30:00Z") },
    ],
    paymentMethods: [
      { id: 1, type: "credit_card", last4: "1234", expiry: "12/25", isDefault: true },
      { id: 2, type: "paypal", email: "john.doe@example.com", isDefault: false },
    ]
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+40 722 234 567",
    city: "Cluj-Napoca",
    role: "normal",
    joinDate: "2024-02-20",
    lastLogin: "2024-01-19T14:20:00Z",
    avatar: "/avatars/02.png",
    subscription: {
      status: "none",
      tier: null,
      plan: null,
      startDate: null,
      endDate: null,
      price: 0,
      autoRenew: false,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: false,
      canUseTokens: false,
      tokensPerDay: 0,
      maxTokens: 0
    },
    tokens: {
      available: 0,
      usedToday: 0,
      totalUsed: 0,
      lastReset: null
    },
    stats: {
      totalVisits: 12,
      favoriteBars: 3,
      eventsAttended: 2,
      totalSpent: 180
    },
    recentActivity: [
      { id: 1, type: "event_booking", description: "Booked ticket for Trivia Night", date: new Date("2024-01-12T09:15:00Z") },
      { id: 2, type: "visit", description: "Visited Downtown Pub", date: new Date("2024-01-10T19:30:00Z") },
    ],
    upcomingEvents: [
      { id: 1, name: "Trivia Night", date: "2024-01-18", bar: "Downtown Pub", ticketType: "General Admission" },
    ],
    pastEvents: [
      { id: 1, name: "Sports Viewing Party", date: "2024-01-12", bar: "Downtown Pub", rating: 4 },
    ],
    reviews: [
      { id: 1, bar: "Downtown Pub", rating: 4, comment: "Great sports atmosphere", date: new Date("2024-01-12T20:15:00Z") },
    ],
    paymentMethods: [
      { id: 1, type: "credit_card", last4: "5678", expiry: "06/26", isDefault: true },
    ]
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+40 723 345 678",
    city: "Timișoara",
    role: "subscribed",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-18T09:15:00Z",
    avatar: "/avatars/03.png",
    subscription: {
      status: "trial",
      tier: "basic",
      plan: "monthly",
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      price: 30,
      autoRenew: true,
      trialEnds: "2024-01-25T00:00:00Z"
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: true,
      canUseTokens: true,
      tokensPerDay: 6,
      maxTokens: 6
    },
    tokens: {
      available: 6,
      usedToday: 0,
      totalUsed: 42,
      lastReset: "2024-01-20T00:00:00Z"
    },
    stats: {
      totalVisits: 28,
      favoriteBars: 5,
      eventsAttended: 8,
      totalSpent: 420
    },
    recentActivity: [
      { id: 1, type: "review", description: "Left 5-star review for Riverside Lounge", date: new Date("2023-12-15T18:20:00Z") },
    ],
    upcomingEvents: [],
    pastEvents: [
      { id: 1, name: "Wine Tasting Evening", date: "2024-01-10", bar: "The Blue Moon", rating: 5 },
      { id: 2, name: "Jazz Brunch", date: "2023-12-14", bar: "Riverside Lounge", rating: 5 },
    ],
    reviews: [
      { id: 1, bar: "Riverside Lounge", rating: 5, comment: "Beautiful river views and amazing cocktails!", date: new Date("2023-12-15T18:20:00Z") },
    ],
    paymentMethods: [
      { id: 1, type: "credit_card", last4: "9012", expiry: "09/27", isDefault: true },
    ]
  }
]

interface UserDetailContentProps {
  userId: string
}

export default function UserDetailContent({ userId }: UserDetailContentProps) {
  const router = useRouter()
  const user = users.find(u => u.id === parseInt(userId))
  
  
  const [activeTab, setActiveTab] = useState("overview")
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.city || "",
    status: user?.subscription?.status || "active",
    role: user?.role || "customer",
    subscription: user?.subscription?.tier || "basic",
  })

  const [subscriptionForm, setSubscriptionForm] = useState({
    tier: user?.subscription?.tier || "none",
    plan: user?.subscription?.plan || "monthly",
    price: user?.subscription?.price || 0,
    autoRenew: user?.subscription?.autoRenew || false,
    status: user?.subscription?.status || "none"
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User not found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/users")} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
      case "trial":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Trial</Badge>
      case "expired":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Expired</Badge>
      case "canceled":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Canceled</Badge>
      case "none":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">No Subscription</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "subscribed":
        return <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200">Subscribed User</Badge>
      case "normal":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Normal User</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case "premium":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Premium</Badge>
      case "basic":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Basic</Badge>
      case "pro":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Pro</Badge>
      default:
        return <Badge variant="secondary">{subscription || "None"}</Badge>
    }
  }

     const handleSave = () => {
     console.log("Saving changes:", editForm)
   }

   const handleCancel = () => {
     setEditForm({
       name: user.name,
       email: user.email,
       phone: user.phone,
       location: user.city,
       status: user.subscription?.status || "active",
       role: user.role,
       subscription: user.subscription?.tier || "basic",
     })
   }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/users")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg font-bold">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="ml-4">
              {getUserStatusBadge(user.subscription?.status || "active")}
            </div>
          </div>
        </div>
        
                 <div className="flex gap-3">
           {/* Edit functionality moved to Account Details tab */}
         </div>
      </div>

                                                       {/* Main Content */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                         <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border rounded-xl p-1 mb-8">
               <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                 Overview
               </TabsTrigger>
               <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                 Analytics
               </TabsTrigger>
               <TabsTrigger value="subscription" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                 Subscription
               </TabsTrigger>
               <TabsTrigger value="account" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                 Account Details
               </TabsTrigger>
             </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Spent</p>
                      <p className="text-2xl font-bold text-green-900">€{user.stats.totalSpent}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Events Attended</p>
                      <p className="text-2xl font-bold text-blue-900">{user.stats.eventsAttended}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Reviews Written</p>
                      <p className="text-2xl font-bold text-purple-900">{user.reviews.length}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Favorite Bars</p>
                      <p className="text-2xl font-bold text-orange-900">{user.stats.favoriteBars}</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-blue-600" />
                    User Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Phone</p>
                          <p className="font-semibold">{user.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Location</p>
                          <p className="font-semibold">{user.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Join Date</p>
                          <p className="font-semibold">{user.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <div className="mt-2">{getUserStatusBadge(user.subscription?.status || "active")}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Role</p>
                      <div className="mt-2">{getUserRoleBadge(user.role)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Subscription</p>
                      <div className="mt-2">{getSubscriptionBadge(user.subscription?.tier || "basic")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            {/* Token Management Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Token Analytics</h3>
              {user.permissions.canUseTokens ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">{user.tokens.available}</div>
                        <div className="text-sm font-medium text-green-800">Available Today</div>
                        <div className="text-xs text-green-600 mt-1">out of {user.permissions.maxTokens}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{user.tokens.usedToday}</div>
                        <div className="text-sm font-medium text-orange-800">Used Today</div>
                        <div className="text-xs text-orange-600 mt-1">tokens consumed</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{user.tokens.totalUsed}</div>
                        <div className="text-sm font-medium text-blue-800">Total Used</div>
                        <div className="text-xs text-blue-600 mt-1">lifetime tokens</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">{user.permissions.tokensPerDay}</div>
                        <div className="text-sm font-medium text-purple-800">Daily Limit</div>
                        <div className="text-xs text-purple-600 mt-1">tokens per day</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="shadow-sm border-0 mb-8">
                  <CardContent className="p-12 text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Token Access</h3>
                                         <p className="text-gray-600 mb-4">This user cannot use tokens. Upgrade to a subscription to enable token features.</p>
                     <Button 
                       className="bg-gradient-to-r from-purple-600 to-blue-600"
                       onClick={() => setActiveTab("subscription")}
                     >
                       Manage Subscription
                     </Button>
                  </CardContent>
                </Card>
              )}

              {user.permissions.canUseTokens && (
                <Card className="shadow-sm border-0 mb-8">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Token Usage Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Reset:</span>
                        <span className="font-medium">{user.tokens.lastReset ? new Date(user.tokens.lastReset).toLocaleString() : 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Usage Rate:</span>
                        <span className="font-medium">{user.tokens.totalUsed > 0 ? Math.round((user.tokens.usedToday / user.tokens.totalUsed) * 100) : 0}% today</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining Today:</span>
                        <span className="font-medium text-green-600">{user.tokens.available} tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Can Use Tokens:</span>
                        <span className="font-medium text-green-600">Yes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* User Activity Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Activity Analytics</h3>
              <Card className="shadow-sm border-0 mb-8">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {user.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(activity.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Analytics</h3>
              
              {/* Upcoming Events */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                {user.upcomingEvents.length > 0 ? (
                  <Card className="shadow-sm border-0">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Event Name</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Bar</TableHead>
                            <TableHead className="font-semibold">Ticket Type</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {user.upcomingEvents.map((event) => (
                            <TableRow key={event.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{event.name}</TableCell>
                              <TableCell>{event.date}</TableCell>
                              <TableCell>{event.bar}</TableCell>
                              <TableCell>{event.ticketType}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-sm border-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">No upcoming events</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Past Events */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h4>
                <Card className="shadow-sm border-0">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Event Name</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Bar</TableHead>
                          <TableHead className="font-semibold">Rating</TableHead>
                          <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.pastEvents.map((event) => (
                          <TableRow key={event.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{event.name}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.bar}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{event.rating}/5</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Analytics</h3>
              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  {user.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {user.reviews.map((review) => (
                        <div key={review.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{review.rating}/5</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{review.bar}</p>
                            <p className="text-gray-700 mt-1">{review.comment}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No reviews yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
                     </TabsContent>

           <TabsContent value="subscription" className="space-y-8">
             {/* Current Subscription Status */}
             <Card className="shadow-sm border-0 mb-6">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <CreditCard className="h-5 w-5 text-blue-600" />
                   Current Subscription Status
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="text-center p-4 bg-gray-50 rounded-lg">
                     <div>{getUserStatusBadge(user.subscription?.status || "active")}</div>
                   </div>
                   <div className="text-center p-4 bg-gray-50 rounded-lg">
                     <div>{getSubscriptionBadge(user.subscription?.tier || "none")}</div>
                   </div>
                   <div className="text-center p-4 bg-gray-50 rounded-lg">
                     <div className="font-medium">Monthly</div>
                   </div>
                 </div>
                 
                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-600">Price:</span>
                     <span className="font-medium">{user.subscription?.tier === "premium" ? "50 RON/month" : "0 RON"}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-600">Next Billing:</span>
                     <span className="font-medium">{user.subscription?.endDate || "N/A"}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-600">Auto-Renew:</span>
                     <span className="font-medium">{user.subscription?.autoRenew ? "Yes" : "No"}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                     <span className="text-gray-600">Start Date:</span>
                     <span className="font-medium">{user.subscription?.startDate || "N/A"}</span>
                   </div>
                 </div>
               </CardContent>
             </Card>

             {/* Subscription Actions */}
             <Card className="shadow-sm border-0 mb-6">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Crown className="h-5 w-5 text-blue-600" />
                   Subscription Actions
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <Button 
                     variant="outline" 
                     className="border-green-300 text-green-600 hover:bg-green-50"
                     onClick={() => {
                       if (confirm(`Extend subscription for ${user.name}?`)) {
                         alert(`Subscription extended for ${user.name}`)
                       }
                     }}
                   >
                     <Plus className="mr-2 h-4 w-4" />
                     Extend Subscription
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                     onClick={() => {
                       if (confirm(`Apply free trial to ${user.name}?`)) {
                         alert(`Free trial applied to ${user.name}`)
                       }
                     }}
                   >
                     <Clock className="mr-2 h-4 w-4" />
                     Apply Free Trial
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="border-red-300 text-red-600 hover:bg-red-50"
                     onClick={() => {
                       if (confirm(`Cancel subscription for ${user.name}?`)) {
                         alert(`Subscription canceled for ${user.name}`)
                       }
                     }}
                   >
                     <X className="mr-2 h-4 w-4" />
                     Cancel Subscription
                   </Button>
                   
                   <Button 
                     variant="outline" 
                     className="border-purple-300 text-purple-600 hover:bg-purple-50"
                     onClick={() => {
                       if (confirm(`Process refund for ${user.name}?`)) {
                         alert(`Refund processed for ${user.name}`)
                       }
                     }}
                   >
                     <CreditCard className="mr-2 h-4 w-4" />
                     Process Refund
                   </Button>
                 </div>
               </CardContent>
             </Card>

             {/* Billing History */}
             <Card className="shadow-sm border-0">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <TrendingUp className="h-5 w-5 text-blue-600" />
                   Billing History & Invoices
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow className="bg-gray-50">
                       <TableHead className="font-semibold">Invoice #</TableHead>
                       <TableHead className="font-semibold">Date</TableHead>
                       <TableHead className="font-semibold">Amount</TableHead>
                       <TableHead className="font-semibold">Status</TableHead>
                       <TableHead className="text-right font-semibold">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     <TableRow className="hover:bg-gray-50">
                       <TableCell className="font-medium">INV-2024-001</TableCell>
                       <TableCell>2024-01-15</TableCell>
                       <TableCell>50 RON</TableCell>
                       <TableCell>
                         <Badge className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
                       </TableCell>
                       <TableCell className="text-right">
                         <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                           <Eye className="h-4 w-4" />
                         </Button>
                       </TableCell>
                     </TableRow>
                     <TableRow className="hover:bg-gray-50">
                       <TableCell className="font-medium">INV-2024-002</TableCell>
                       <TableCell>2024-02-15</TableCell>
                       <TableCell>50 RON</TableCell>
                       <TableCell>
                         <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                       </TableCell>
                       <TableCell className="text-right">
                         <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                           <Eye className="h-4 w-4" />
                         </Button>
                       </TableCell>
                     </TableRow>
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
                       </TabsContent>

                         <TabsContent value="account" className="space-y-8">
               {/* Basic Information Section */}
               <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h3>
                 <Card className="shadow-sm border-0">
                   <CardContent className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium text-gray-700">Full Name</label>
                           <Input 
                             value={editForm.name}
                             onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                             className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                             placeholder="Enter full name"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium text-gray-700">Email Address</label>
                           <Input 
                             type="email"
                             value={editForm.email}
                             onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                             className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                             placeholder="user@example.com"
                           />
                         </div>
                       </div>
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium text-gray-700">Phone Number</label>
                           <Input 
                             value={editForm.phone}
                             onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                             className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                             placeholder="+40 721 123 456"
                           />
                         </div>
                         <div>
                           <label className="text-sm font-medium text-gray-700">City/Location</label>
                           <Input 
                             value={editForm.location}
                             onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                             className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                             placeholder="Bucharest, Cluj-Napoca, etc."
                           />
                         </div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

               {/* Account Status & Permissions */}
               <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Status & Permissions</h3>
                 <Card className="shadow-sm border-0">
                   <CardContent className="p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                         <div>
                           <label className="text-sm font-medium text-gray-700">User Type</label>
                           <select 
                             className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                             value={editForm.role}
                             onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                           >
                             <option value="normal">Normal User (No Subscription)</option>
                             <option value="subscribed">Premium User (Subscribed)</option>
                           </select>
                           <p className="text-xs text-gray-500 mt-1">
                             Normal users have limited access, Premium users get full features including tokens
                           </p>
                         </div>
                         <div>
                           <label className="text-sm font-medium text-gray-700">Account Status</label>
                           <select 
                             className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                             value={editForm.status}
                             onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                           >
                             <option value="active">Active</option>
                             <option value="suspended">Suspended</option>
                             <option value="trial">Trial Period</option>
                             <option value="expired">Subscription Expired</option>
                             <option value="canceled">Subscription Canceled</option>
                           </select>
                           <p className="text-xs text-gray-500 mt-1">
                             Controls user access to the platform
                           </p>
                         </div>
                       </div>
                       <div className="space-y-4">
                         <div className="p-4 bg-gray-50 rounded-lg">
                           <h4 className="font-medium text-gray-900 mb-2">Current Permissions</h4>
                           <div className="space-y-2 text-sm">
                             <div className="flex items-center justify-between">
                               <span className="text-gray-600">Can View App:</span>
                               <span className="font-medium text-green-600">✓ Yes</span>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-gray-600">Can Check-in at Bars:</span>
                               <span className="font-medium">{user.permissions.canCheckInAtBars ? "✓ Yes" : "✗ No"}</span>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-gray-600">Can Use Tokens:</span>
                               <span className="font-medium">{user.permissions.canUseTokens ? "✓ Yes" : "✗ No"}</span>
                             </div>
                             <div className="flex items-center justify-between">
                               <span className="text-gray-600">Daily Token Limit:</span>
                               <span className="font-medium">{user.permissions.tokensPerDay} tokens</span>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

                             {/* Security & Access Management */}
               <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Security & Access Management</h3>
                 <Card className="shadow-sm border-0">
                   <CardContent className="p-6">
                     <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                         <div>
                           <h4 className="font-medium text-blue-900">Password Reset</h4>
                           <p className="text-sm text-blue-700">Send a secure password reset link to {user.email}</p>
                         </div>
                         <Button 
                           variant="outline" 
                           className="border-blue-300 text-blue-600 hover:bg-blue-100"
                           onClick={() => {
                             if (confirm(`Send password reset link to ${user.email}?`)) {
                               alert(`Password reset link sent to ${user.email}`)
                             }
                           }}
                         >
                           <Mail className="mr-2 h-4 w-4" />
                           Send Reset Link
                         </Button>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                         <div>
                           <h4 className="font-medium text-gray-900">Account Verification Status</h4>
                           <p className="text-sm text-gray-600">Email: {user.email}</p>
                           <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                         </div>
                         <div className="text-right">
                           <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                             <span className="text-sm text-green-600">Email Verified</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                             <span className="text-sm text-gray-500">Phone Not Verified</span>
                           </div>
                         </div>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                         <div>
                           <h4 className="font-medium text-gray-900">Last Login Activity</h4>
                           <p className="text-sm text-gray-600">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
                           <p className="text-sm text-gray-600">Join date: {user.joinDate}</p>
                         </div>
                         <Button variant="outline" className="border-gray-300">
                           <Activity className="mr-2 h-4 w-4" />
                           View Full History
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

                             {/* Account Management Actions */}
               <div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Management Actions</h3>
                 <Card className="shadow-sm border-0">
                   <CardContent className="p-6">
                     <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                         <div>
                           <h4 className="font-medium text-orange-900">Temporarily Suspend Account</h4>
                           <p className="text-sm text-orange-700">Prevent user from accessing the platform temporarily. User data is preserved.</p>
                         </div>
                         <Button 
                           variant="outline" 
                           className="border-orange-300 text-orange-600 hover:bg-orange-100"
                           onClick={() => {
                             if (confirm(`Suspend ${user.name}'s account? They won't be able to access the platform until reactivated.`)) {
                               alert(`Account suspended for ${user.name}`)
                             }
                           }}
                         >
                           <Clock className="mr-2 h-4 w-4" />
                           Suspend Account
                         </Button>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                         <div>
                           <h4 className="font-medium text-purple-900">Reset User Tokens</h4>
                           <p className="text-sm text-purple-700">Reset user's daily token count and usage statistics</p>
                         </div>
                         <Button 
                           variant="outline" 
                           className="border-purple-300 text-purple-600 hover:bg-purple-100"
                           onClick={() => {
                             if (confirm(`Reset tokens for ${user.name}? This will refresh their daily token allocation.`)) {
                               alert(`Tokens reset for ${user.name}`)
                             }
                           }}
                         >
                           <Target className="mr-2 h-4 w-4" />
                           Reset Tokens
                         </Button>
                       </div>
                       
                       <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                         <div>
                           <h4 className="font-medium text-red-900">Permanently Delete Account</h4>
                           <p className="text-sm text-red-700">⚠️ This action cannot be undone. All user data, activity history, and subscriptions will be permanently removed.</p>
                         </div>
                         <Button 
                           variant="outline" 
                           className="border-red-300 text-red-600 hover:bg-red-100"
                           onClick={() => {
                             if (confirm(`⚠️ WARNING: This will permanently delete ${user.name}'s account and all associated data. This action cannot be undone. Continue?`)) {
                               if (confirm(`Final confirmation: Delete ${user.name}'s account permanently?`)) {
                                 alert(`Account permanently deleted for ${user.name}`)
                                 router.push("/users")
                               }
                             }
                           }}
                         >
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete Account
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>
  
  
                     </Tabs>
     </div>
   )
 }

