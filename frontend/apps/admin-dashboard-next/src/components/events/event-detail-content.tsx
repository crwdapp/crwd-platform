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
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  ArrowLeft,
  Save,
  X,
  Building2,
  Ticket,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Image as ImageIcon,
  Tag,
} from "lucide-react"

// Mock data for events
const events = [
  {
    id: 1,
    name: "Live Jazz Night",
    description: "An evening of smooth jazz with local musicians and craft cocktails",
    bar: {
      id: 1,
      name: "The Blue Moon",
      image: "/bars/blue-moon.jpg"
    },
    date: "2024-01-15",
    time: "8:00 PM",
    duration: "3 hours",
    location: "The Blue Moon, Downtown",
    status: "upcoming",
    capacity: 100,
    attendees: 45,
    price: "$25",
    category: "Music",
    tags: ["jazz", "live-music", "cocktails"],
    image: "/events/jazz-night.jpg",
    organizer: "John Smith",
    contactEmail: "john@bluemoon.com",
    contactPhone: "+1 (555) 123-4567",
    createdAt: new Date("2024-01-01T10:30:00Z"),
    updatedAt: new Date("2024-01-10T15:45:00Z"),
    tickets: [
      { id: 1, type: "General Admission", price: "$25", sold: 45, total: 100 },
      { id: 2, type: "VIP", price: "$50", sold: 12, total: 20 },
    ],
    attendeesList: [
      { id: 1, name: "Alice Johnson", email: "alice@email.com", ticketType: "General Admission", purchasedAt: new Date("2024-01-05T14:20:00Z") },
      { id: 2, name: "Bob Wilson", email: "bob@email.com", ticketType: "VIP", purchasedAt: new Date("2024-01-06T09:15:00Z") },
      { id: 3, name: "Carol Davis", email: "carol@email.com", ticketType: "General Admission", purchasedAt: new Date("2024-01-07T16:30:00Z") },
    ],
    reviews: [
      { id: 1, rating: 5, comment: "Amazing jazz atmosphere!", author: "Alice Johnson", createdAt: new Date("2024-01-10T15:30:00Z") },
      { id: 2, rating: 4, comment: "Great music and drinks", author: "Bob Wilson", createdAt: new Date("2024-01-09T12:15:00Z") },
    ]
  },
  {
    id: 2,
    name: "Craft Beer Festival",
    description: "A celebration of local craft breweries with tastings and food pairings",
    bar: {
      id: 1,
      name: "The Blue Moon",
      image: "/bars/blue-moon.jpg"
    },
    date: "2024-01-20",
    time: "2:00 PM",
    duration: "6 hours",
    location: "The Blue Moon, Downtown",
    status: "upcoming",
    capacity: 150,
    attendees: 120,
    price: "$35",
    category: "Food & Drink",
    tags: ["beer", "craft", "festival", "food"],
    image: "/events/beer-festival.jpg",
    organizer: "John Smith",
    contactEmail: "john@bluemoon.com",
    contactPhone: "+1 (555) 123-4567",
    createdAt: new Date("2024-01-02T11:20:00Z"),
    updatedAt: new Date("2024-01-12T10:15:00Z"),
    tickets: [
      { id: 1, type: "General Admission", price: "$35", sold: 120, total: 150 },
      { id: 2, type: "Early Bird", price: "$25", sold: 50, total: 50 },
    ],
    attendeesList: [
      { id: 1, name: "David Brown", email: "david@email.com", ticketType: "Early Bird", purchasedAt: new Date("2024-01-03T08:45:00Z") },
      { id: 2, name: "Eva Garcia", email: "eva@email.com", ticketType: "General Admission", purchasedAt: new Date("2024-01-04T13:20:00Z") },
    ],
    reviews: []
  },
  {
    id: 3,
    name: "Wine Tasting Evening",
    description: "An elegant evening of wine tasting with expert sommeliers",
    bar: {
      id: 1,
      name: "The Blue Moon",
      image: "/bars/blue-moon.jpg"
    },
    date: "2024-01-10",
    time: "7:00 PM",
    duration: "2 hours",
    location: "The Blue Moon, Downtown",
    status: "completed",
    capacity: 50,
    attendees: 30,
    price: "$45",
    category: "Food & Drink",
    tags: ["wine", "tasting", "elegant"],
    image: "/events/wine-tasting.jpg",
    organizer: "John Smith",
    contactEmail: "john@bluemoon.com",
    contactPhone: "+1 (555) 123-4567",
    createdAt: new Date("2023-12-20T09:30:00Z"),
    updatedAt: new Date("2024-01-11T18:20:00Z"),
    tickets: [
      { id: 1, type: "General Admission", price: "$45", sold: 30, total: 50 },
    ],
    attendeesList: [
      { id: 1, name: "Frank Miller", email: "frank@email.com", ticketType: "General Admission", purchasedAt: new Date("2023-12-25T11:30:00Z") },
      { id: 2, name: "Grace Lee", email: "grace@email.com", ticketType: "General Admission", purchasedAt: new Date("2023-12-26T15:45:00Z") },
    ],
    reviews: [
      { id: 1, rating: 5, comment: "Excellent wine selection and knowledgeable staff", author: "Frank Miller", createdAt: new Date("2024-01-11T20:30:00Z") },
      { id: 2, rating: 4, comment: "Beautiful atmosphere and great wines", author: "Grace Lee", createdAt: new Date("2024-01-11T21:15:00Z") },
    ]
  }
]

interface EventDetailContentProps {
  eventId: string
}

export default function EventDetailContent({ eventId }: EventDetailContentProps) {
  const router = useRouter()
  const event = events.find(e => e.id === parseInt(eventId))
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [editForm, setEditForm] = useState({
    name: event?.name || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    duration: event?.duration || "",
    location: event?.location || "",
    capacity: event?.capacity || 0,
    price: event?.price || "",
    category: event?.category || "",
  })

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/events")} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
      case "ongoing":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Ongoing</Badge>
      case "completed":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
      case "sold_out":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Sold Out</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSave = () => {
    console.log("Saving changes:", editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location: event.location,
      capacity: event.capacity,
      price: event.price,
      category: event.category,
    })
    setIsEditing(false)
  }

  const totalRevenue = event.tickets.reduce((sum, ticket) => sum + (parseInt(ticket.price.replace('$', '')) * ticket.sold), 0)
  const totalTicketsSold = event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0)
  const totalCapacity = event.tickets.reduce((sum, ticket) => sum + ticket.total, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/events")}
              className="text-white hover:bg-white/20 border-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-white/20">
                  <AvatarImage src={event.image} alt={event.name} />
                  <AvatarFallback className="text-2xl font-bold bg-white/10 text-white">
                    {event.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  {getEventStatusBadge(event.status)}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
                <p className="text-purple-100 text-lg mb-1">{event.category}</p>
                <div className="flex items-center gap-4 text-purple-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
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
                  <Button onClick={handleSave} className="bg-white text-purple-600 hover:bg-gray-100">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-white text-purple-600 hover:bg-gray-100">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Event
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit Event Information</h3>
              <p className="text-gray-600">Update event details and settings</p>
            </div>
            <Card className="shadow-sm border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Event Name</label>
                    <Input 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Input 
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <Input 
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <Input 
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duration</label>
                    <Input 
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Capacity</label>
                    <Input 
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <Input 
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <Input 
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500 h-24"
                      placeholder="Describe your event..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border rounded-xl p-1 mb-8">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tickets" className="rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Tickets ({event.tickets.length})
              </TabsTrigger>
              <TabsTrigger value="attendees" className="rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Attendees ({event.attendeesList.length})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Reviews ({event.reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Tickets Sold</p>
                        <p className="text-2xl font-bold text-blue-900">{totalTicketsSold}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Ticket className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-900">${totalRevenue}</p>
                      </div>
                      <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Capacity</p>
                        <p className="text-2xl font-bold text-purple-900">{totalCapacity}</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Fill Rate</p>
                        <p className="text-2xl font-bold text-orange-900">{Math.round((totalTicketsSold / totalCapacity) * 100)}%</p>
                      </div>
                      <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Event Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Date & Time</p>
                            <p className="font-semibold">{event.date} at {event.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Duration</p>
                            <p className="font-semibold">{event.duration}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Price</p>
                            <p className="font-semibold">{event.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Organizer</p>
                            <p className="font-semibold">{event.organizer}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="h-5 w-5 text-purple-600" />
                      Hosting Bar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={event.bar.image} alt={event.bar.name} />
                        <AvatarFallback className="text-sm font-bold">
                          {event.bar.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{event.bar.name}</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{event.date} at {event.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Ticket Types</h3>
                  <p className="text-gray-600">Manage ticket pricing and availability</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Ticket Type
                </Button>
              </div>
              <Card className="shadow-sm border-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Ticket Type</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Sold</TableHead>
                        <TableHead className="font-semibold">Total</TableHead>
                        <TableHead className="font-semibold">Revenue</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {event.tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{ticket.type}</TableCell>
                          <TableCell>{ticket.price}</TableCell>
                          <TableCell>{ticket.sold}</TableCell>
                          <TableCell>{ticket.total}</TableCell>
                          <TableCell>${parseInt(ticket.price.replace('$', '')) * ticket.sold}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendees" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Attendees</h3>
                  <p className="text-gray-600">View all registered attendees</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Attendee
                </Button>
              </div>
              <Card className="shadow-sm border-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Ticket Type</TableHead>
                        <TableHead className="font-semibold">Purchase Date</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {event.attendeesList.map((attendee) => (
                        <TableRow key={attendee.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{attendee.name}</TableCell>
                          <TableCell>{attendee.email}</TableCell>
                          <TableCell>{attendee.ticketType}</TableCell>
                          <TableCell>{new Date(attendee.purchasedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                  <p className="text-gray-600">View attendee feedback and ratings</p>
                </div>
              </div>
              <Card className="shadow-sm border-0">
                <CardContent className="p-6">
                  {event.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {event.reviews.map((review) => (
                        <div key={review.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{review.rating}/5</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700">{review.comment}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <span>by {review.author}</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
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

