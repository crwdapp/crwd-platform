"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Plus,
  MoreHorizontal,
  Search,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Music,
  Star,
  TrendingUp,
} from "lucide-react"

// Mock data for events
const events = [
  {
    id: 1,
    name: "Live Jazz Night",
    description: "An evening of smooth jazz with local musicians",
    date: "2024-01-25",
    startTime: "8:00 PM",
    endTime: "11:00 PM",
    dj: "The Jazz Collective",
    genre: "Jazz",
    price: 15.00,
    ticketPrice: 20.00,
    image: "/events/jazz-night.jpg",
    images: ["/events/jazz-night.jpg"],
    category: "MUSIC",
    tags: ["jazz", "live-music", "cocktails"],
    capacity: 100,
    attendees: 45,
    interestedCount: 67,
    goingCount: 45,
    isTicketed: true,
    ticketUrl: "https://tickets.example.com/jazz-night",
    status: "UPCOMING",
    ageRestriction: "21+",
    dressCode: "Smart Casual",
    isPublic: true,
    canGuestsInviteFriends: true,
    hostMessage: "Come join us for an unforgettable evening of jazz!",
    discussionEnabled: true,
    photosEnabled: true,
    views: 234,
    shares: 12,
    createdBy: "John Smith",
    coHosts: ["Sarah Wilson"],
    barId: 1,
    barName: "The Blue Moon",
    barLocation: "Downtown, City Center",
  },
  {
    id: 2,
    name: "Craft Beer Festival",
    description: "Sample the best craft beers from local breweries",
    date: "2024-01-30",
    startTime: "2:00 PM",
    endTime: "8:00 PM",
    dj: null,
    genre: "Festival",
    price: 25.00,
    ticketPrice: 30.00,
    image: "/events/beer-festival.jpg",
    images: ["/events/beer-festival.jpg"],
    category: "PARTY",
    tags: ["beer", "festival", "craft", "tasting"],
    capacity: 200,
    attendees: 120,
    interestedCount: 180,
    goingCount: 120,
    isTicketed: true,
    ticketUrl: "https://tickets.example.com/beer-festival",
    status: "UPCOMING",
    ageRestriction: "21+",
    dressCode: "Casual",
    isPublic: true,
    canGuestsInviteFriends: true,
    hostMessage: "Join us for the biggest craft beer celebration of the year!",
    discussionEnabled: true,
    photosEnabled: true,
    views: 456,
    shares: 23,
    createdBy: "Mike Johnson",
    coHosts: [],
    barId: 2,
    barName: "Downtown Pub",
    barLocation: "West End, Business District",
  },
  {
    id: 3,
    name: "Wine Tasting Evening",
    description: "Exclusive wine tasting with sommelier guidance",
    date: "2024-01-20",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    dj: null,
    genre: "Tasting",
    price: 45.00,
    ticketPrice: 50.00,
    image: "/events/wine-tasting.jpg",
    images: ["/events/wine-tasting.jpg"],
    category: "SPECIAL",
    tags: ["wine", "tasting", "upscale", "sommelier"],
    capacity: 50,
    attendees: 30,
    interestedCount: 45,
    goingCount: 30,
    isTicketed: true,
    ticketUrl: "https://tickets.example.com/wine-tasting",
    status: "COMPLETED",
    ageRestriction: "21+",
    dressCode: "Business Casual",
    isPublic: true,
    canGuestsInviteFriends: false,
    hostMessage: "An intimate evening of fine wines and expert guidance",
    discussionEnabled: true,
    photosEnabled: false,
    views: 189,
    shares: 8,
    createdBy: "Emily Brown",
    coHosts: ["David Lee"],
    barId: 3,
    barName: "Riverside Lounge",
    barLocation: "Riverside, Waterfront",
  },
]

export default function EventsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEventForm, setNewEventForm] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "MUSIC",
    capacity: 100,
    price: 0,
    isTicketed: false,
    barId: 1,
  })
  const router = useRouter()

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase()
    
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.barName.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower) ||
      event.status.toLowerCase().includes(searchLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      event.createdBy.toLowerCase().includes(searchLower)
    )
  })

  const handleViewDetails = (event: any) => {
    router.push(`/events/${event.id}`)
  }

  const handleAddEvent = () => {
    console.log("Adding new event:", newEventForm)
    
    setNewEventForm({
      name: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      category: "MUSIC",
      capacity: 100,
      price: 0,
      isTicketed: false,
      barId: 1,
    })
    
    setIsAddEventOpen(false)
    alert("Event added successfully!")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
      case "ONGOING":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Ongoing</Badge>
      case "COMPLETED":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
      case "SOLD_OUT":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Sold Out</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      MUSIC: "bg-purple-50 text-purple-700 border-purple-200",
      PARTY: "bg-pink-50 text-pink-700 border-pink-200",
      HAPPY_HOUR: "bg-yellow-50 text-yellow-700 border-yellow-200",
      LIVE_SHOW: "bg-indigo-50 text-indigo-700 border-indigo-200",
      KARAOKE: "bg-red-50 text-red-700 border-red-200",
      TRIVIA: "bg-teal-50 text-teal-700 border-teal-200",
      SPORTS: "bg-green-50 text-green-700 border-green-200",
      NETWORKING: "bg-blue-50 text-blue-700 border-blue-200",
      SPECIAL: "bg-orange-50 text-orange-700 border-orange-200",
    }
    
    return (
      <Badge className={categoryColors[category as keyof typeof categoryColors] || "bg-gray-50 text-gray-700 border-gray-200"}>
        {category.replace("_", " ")}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Events Management</h2>
            <p className="text-gray-600">Manage all platform events and their details</p>
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Name</label>
                  <Input
                    placeholder="Enter event name"
                    value={newEventForm.name}
                    onChange={(e) => setNewEventForm({...newEventForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe the event..."
                    className="w-full p-2 border border-gray-300 rounded-md h-20"
                    value={newEventForm.description}
                    onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newEventForm.date}
                      onChange={(e) => setNewEventForm({...newEventForm, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newEventForm.category}
                      onChange={(e) => setNewEventForm({...newEventForm, category: e.target.value})}
                    >
                      <option value="MUSIC">Music</option>
                      <option value="PARTY">Party</option>
                      <option value="HAPPY_HOUR">Happy Hour</option>
                      <option value="LIVE_SHOW">Live Show</option>
                      <option value="KARAOKE">Karaoke</option>
                      <option value="TRIVIA">Trivia</option>
                      <option value="SPORTS">Sports</option>
                      <option value="NETWORKING">Networking</option>
                      <option value="SPECIAL">Special</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={newEventForm.startTime}
                      onChange={(e) => setNewEventForm({...newEventForm, startTime: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={newEventForm.endTime}
                      onChange={(e) => setNewEventForm({...newEventForm, endTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Capacity</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={newEventForm.capacity}
                      onChange={(e) => setNewEventForm({...newEventForm, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newEventForm.price}
                      onChange={(e) => setNewEventForm({...newEventForm, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isTicketed"
                    checked={newEventForm.isTicketed}
                    onChange={(e) => setNewEventForm({...newEventForm, isTicketed: e.target.checked})}
                  />
                  <label htmlFor="isTicketed" className="text-sm font-medium">
                    Requires tickets
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent} className="bg-indigo-600 hover:bg-indigo-700">
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 h-10 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleViewDetails(event)}>
            {/* Event Image Header */}
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {getStatusBadge(event.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30">
                      <MoreHorizontal className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Manage Attendees
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Event Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src={event.image} alt={event.name} />
                    <AvatarFallback className="text-sm font-semibold bg-white/20 text-white">
                      {event.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{event.name}</h3>
                    <p className="text-white/80 text-sm truncate">{event.barName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Content */}
            <CardContent className="p-6">
              {/* Category and Status */}
              <div className="flex items-center gap-2 mb-4">
                {getCategoryBadge(event.category)}
                {event.isTicketed && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">Ticketed</Badge>
                )}
              </div>

              {/* Date and Time */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{event.barLocation}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Attendees</span>
                  </div>
                  <span className="text-xl font-bold text-purple-900">{event.attendees}/{event.capacity}</span>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Interested</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">{event.interestedCount}</span>
                </div>
              </div>

              {/* Price */}
              {event.price > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">${event.price}</span>
                  {event.ticketPrice && event.ticketPrice > event.price && (
                    <span className="text-sm text-gray-500">(+${event.ticketPrice - event.price} fees)</span>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{event.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No events match "${searchTerm}"` : "Get started by creating your first event"}
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

