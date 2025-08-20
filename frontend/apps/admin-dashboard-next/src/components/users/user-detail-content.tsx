"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

// Mock data for users
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/users/alice.jpg",
    status: "active",
    role: "customer",
    age: 28,
    location: "Downtown, City Center",
    joinDate: new Date("2023-06-15T10:30:00Z"),
    lastLogin: new Date("2024-01-15T14:20:00Z"),
    totalSpent: 450,
    favoriteBars: 3,
    eventsAttended: 8,
    reviewsWritten: 12,
    subscription: "premium",
    preferences: {
      favoriteCategories: ["cocktails", "live-music", "wine"],
      priceRange: "$$",
      preferredTime: "evening",
      notifications: true,
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
      { id: 2, type: "paypal", email: "alice@email.com", isDefault: false },
    ]
  },
  {
    id: 2,
    name: "Bob Wilson",
    email: "bob@email.com",
    phone: "+1 (555) 234-5678",
    avatar: "/users/bob.jpg",
    status: "active",
    role: "customer",
    age: 35,
    location: "West End, Business District",
    joinDate: new Date("2023-08-20T14:20:00Z"),
    lastLogin: new Date("2024-01-14T16:45:00Z"),
    totalSpent: 320,
    favoriteBars: 2,
    eventsAttended: 5,
    reviewsWritten: 8,
    subscription: "basic",
    preferences: {
      favoriteCategories: ["sports", "pub", "beer"],
      priceRange: "$",
      preferredTime: "weekend",
      notifications: true,
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
    name: "Carol Davis",
    email: "carol@email.com",
    phone: "+1 (555) 345-6789",
    avatar: "/users/carol.jpg",
    status: "inactive",
    role: "customer",
    age: 42,
    location: "Riverside, Waterfront",
    joinDate: new Date("2023-09-10T09:15:00Z"),
    lastLogin: new Date("2023-12-20T11:30:00Z"),
    totalSpent: 180,
    favoriteBars: 1,
    eventsAttended: 2,
    reviewsWritten: 3,
    subscription: "basic",
    preferences: {
      favoriteCategories: ["wine", "upscale", "romantic"],
      priceRange: "$$$",
      preferredTime: "evening",
      notifications: false,
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
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    status: user?.status || "active",
    role: user?.role || "customer",
    subscription: user?.subscription || "basic",
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
      case "inactive":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getUserRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Admin</Badge>
      case "customer":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Customer</Badge>
      case "bar_owner":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Bar Owner</Badge>
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
      default:
        return <Badge variant="secondary">{subscription}</Badge>
    }
  }

  const handleSave = () => {
    console.log("Saving changes:", editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      status: user.status,
      role: user.role,
      subscription: user.subscription,
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/users")}
              className="text-white hover:bg-white/20 border-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-white/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-white/10 text-white">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  {getUserStatusBadge(user.status)}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-blue-100 text-lg mb-1">{user.email}</p>
                <div className="flex items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {user.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-white text-blue-600 hover:bg-gray-100">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-white text-blue-600 hover:bg-gray-100">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 lg:px-8 max-w-7xl mx-auto">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit User Information</h3>
              <p className="text-gray-600">Update user details and settings</p>
            </div>
            <Card className="shadow-sm border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input 
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input 
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <Input 
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    >
                      <option value="customer">Customer</option>
                      <option value="bar_owner">Bar Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subscription</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      value={editForm.subscription}
                      onChange={(e) => setEditForm({...editForm, subscription: e.target.value})}
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border rounded-xl p-1 mb-8">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Activity
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Events ({user.upcomingEvents.length + user.pastEvents.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Reviews ({user.reviews.length})
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
                        <p className="text-2xl font-bold text-green-900">${user.totalSpent}</p>
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
                        <p className="text-2xl font-bold text-blue-900">{user.eventsAttended}</p>
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
                        <p className="text-2xl font-bold text-purple-900">{user.reviewsWritten}</p>
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
                        <p className="text-2xl font-bold text-orange-900">{user.favoriteBars}</p>
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
                            <p className="font-semibold">{user.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Age</p>
                            <p className="font-semibold">{user.age} years old</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <div className="mt-2">{getUserStatusBadge(user.status)}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Role</p>
                        <div className="mt-2">{getUserRoleBadge(user.role)}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Subscription</p>
                        <div className="mt-2">{getSubscriptionBadge(user.subscription)}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Preferences</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Favorite Categories</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {user.preferences.favoriteCategories.map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-600">Price Range</p>
                          <p className="font-semibold mt-1">{user.preferences.priceRange}</p>
                        </div>
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

            <TabsContent value="activity" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">User Activity</h3>
                  <p className="text-gray-600">View detailed user activity and engagement</p>
                </div>
              </div>
              <Card className="shadow-sm border-0">
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
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Events</h3>
                  <p className="text-gray-600">View user's event history and upcoming events</p>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div>
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
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                  <p className="text-gray-600">View user's reviews and ratings</p>
                </div>
              </div>
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
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

