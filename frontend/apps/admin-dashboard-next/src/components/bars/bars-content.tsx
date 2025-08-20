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
  Building2,
  Plus,
  MoreHorizontal,
  Search,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  Star,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Clock3,
} from "lucide-react"

// Mock data - simplified without revenue
const bars = [
  {
    id: 1,
    name: "The Blue Moon",
    owner: "John Smith",
    location: "Downtown, City Center",
    status: "active",
    rating: 4.5,
    events: 12,
    campaigns: 3,
    image: "/bars/blue-moon.jpg",
    phone: "+1 (555) 123-4567",
    email: "john@bluemoon.com",
    description: "A cozy jazz bar in downtown with live music every night",
    address: "123 Main St, Downtown, City Center",
    priceRange: "$$",
    reviewCount: 127,
    isOpen: true,
    crowdLevel: "Medium",
    openUntil: "2:00 AM",
    images: ["/bars/blue-moon.jpg"],
    tags: ["jazz", "live-music", "cocktails", "romantic"],
    type: "Jazz Bar",
    availableDrinks: 45,
    drinksServedToday: 23,
    totalTokensRedeemed: 156,
    lastUpdated: new Date("2024-01-15T10:30:00Z"),
    createdAt: new Date("2023-06-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    hours: [
      { day: "monday", open: "5:00 PM", close: "2:00 AM" },
      { day: "tuesday", open: "5:00 PM", close: "2:00 AM" },
      { day: "wednesday", open: "5:00 PM", close: "2:00 AM" },
      { day: "thursday", open: "5:00 PM", close: "2:00 AM" },
      { day: "friday", open: "4:00 PM", close: "3:00 AM" },
      { day: "saturday", open: "4:00 PM", close: "3:00 AM" },
      { day: "sunday", open: "6:00 PM", close: "1:00 AM" },
    ],
    drinks: [
      { id: "drink_1", name: "Blue Moon Martini", category: "Cocktails", price: "$12", isAvailable: true },
      { id: "drink_2", name: "Jazz Special", category: "Cocktails", price: "$14", isAvailable: true },
      { id: "drink_3", name: "Craft Beer", category: "Beer", price: "$8", isAvailable: true },
    ],
    eventsList: [
      { id: 1, name: "Live Jazz Night", date: "2024-01-15", attendees: 45, status: "upcoming" },
      { id: 2, name: "Craft Beer Festival", date: "2024-01-20", attendees: 120, status: "upcoming" },
      { id: 3, name: "Wine Tasting", date: "2024-01-10", attendees: 30, status: "completed" },
    ],
    campaignsList: [
      { id: 1, name: "Happy Hour Special", type: "discount", status: "active", reach: 250 },
      { id: 2, name: "Weekend Brunch", type: "event", status: "active", reach: 180 },
      { id: 3, name: "Student Night", type: "promotion", status: "draft", reach: 0 },
    ],
    reviews: [
      { id: "review_1", rating: 5, comment: "Amazing jazz atmosphere!", createdAt: new Date("2024-01-10T15:30:00Z") },
      { id: "review_2", rating: 4, comment: "Great drinks and service", createdAt: new Date("2024-01-08T12:15:00Z") },
    ]
  },
  {
    id: 2,
    name: "Downtown Pub",
    owner: "Sarah Wilson",
    location: "West End, Business District",
    status: "active",
    rating: 4.2,
    events: 8,
    campaigns: 2,
    image: "/bars/downtown-pub.jpg",
    phone: "+1 (555) 234-5678",
    email: "sarah@downtownpub.com",
    description: "A traditional Irish pub with sports viewing and trivia nights",
    address: "456 West End Ave, Business District",
    priceRange: "$",
    reviewCount: 89,
    isOpen: true,
    crowdLevel: "High",
    openUntil: "1:00 AM",
    images: ["/bars/downtown-pub.jpg"],
    tags: ["sports", "pub", "trivia", "irish"],
    type: "Sports Bar",
    availableDrinks: 32,
    drinksServedToday: 18,
    totalTokensRedeemed: 89,
    lastUpdated: new Date("2024-01-14T16:45:00Z"),
    createdAt: new Date("2023-08-20T14:20:00Z"),
    updatedAt: new Date("2024-01-14T16:45:00Z"),
    hours: [
      { day: "monday", open: "11:00 AM", close: "1:00 AM" },
      { day: "tuesday", open: "11:00 AM", close: "1:00 AM" },
      { day: "wednesday", open: "11:00 AM", close: "1:00 AM" },
      { day: "thursday", open: "11:00 AM", close: "1:00 AM" },
      { day: "friday", open: "11:00 AM", close: "2:00 AM" },
      { day: "saturday", open: "10:00 AM", close: "2:00 AM" },
      { day: "sunday", open: "12:00 PM", close: "12:00 AM" },
    ],
    drinks: [
      { id: "drink_4", name: "Guinness", category: "Beer", price: "$7", isAvailable: true },
      { id: "drink_5", name: "Irish Coffee", category: "Coffee", price: "$9", isAvailable: true },
    ],
    eventsList: [
      { id: 1, name: "Trivia Night", date: "2024-01-18", attendees: 35, status: "upcoming" },
      { id: 2, name: "Sports Viewing Party", date: "2024-01-12", attendees: 80, status: "completed" },
    ],
    campaignsList: [
      { id: 1, name: "Game Day Specials", type: "discount", status: "active", reach: 200 },
      { id: 2, name: "Lunch Deal", type: "promotion", status: "active", reach: 150 },
    ],
    reviews: [
      { id: "review_3", rating: 4, comment: "Great sports atmosphere", createdAt: new Date("2024-01-12T20:15:00Z") },
    ]
  },
  {
    id: 3,
    name: "Riverside Lounge",
    owner: "Mike Johnson",
    location: "Riverside, Waterfront",
    status: "pending",
    rating: 4.8,
    events: 15,
    campaigns: 4,
    image: "/bars/riverside-lounge.jpg",
    phone: "+1 (555) 345-6789",
    email: "mike@riversidelounge.com",
    description: "An upscale lounge with river views and craft cocktails",
    address: "789 Riverside Blvd, Waterfront District",
    priceRange: "$$$",
    reviewCount: 203,
    isOpen: true,
    crowdLevel: "Low",
    openUntil: "2:00 AM",
    images: ["/bars/riverside-lounge.jpg"],
    tags: ["upscale", "cocktails", "river-view", "romantic"],
    type: "Lounge",
    availableDrinks: 67,
    drinksServedToday: 34,
    totalTokensRedeemed: 234,
    lastUpdated: new Date("2024-01-16T12:20:00Z"),
    createdAt: new Date("2023-09-10T09:15:00Z"),
    updatedAt: new Date("2024-01-16T12:20:00Z"),
    hours: [
      { day: "monday", open: "4:00 PM", close: "2:00 AM" },
      { day: "tuesday", open: "4:00 PM", close: "2:00 AM" },
      { day: "wednesday", open: "4:00 PM", close: "2:00 AM" },
      { day: "thursday", open: "4:00 PM", close: "2:00 AM" },
      { day: "friday", open: "3:00 PM", close: "3:00 AM" },
      { day: "saturday", open: "3:00 PM", close: "3:00 AM" },
      { day: "sunday", open: "5:00 PM", close: "1:00 AM" },
    ],
    drinks: [
      { id: "drink_6", name: "Riverside Sunset", category: "Cocktails", price: "$18", isAvailable: true },
      { id: "drink_7", name: "Craft Old Fashioned", category: "Cocktails", price: "$16", isAvailable: true },
      { id: "drink_8", name: "Premium Wine", category: "Wine", price: "$22", isAvailable: true },
    ],
    eventsList: [
      { id: 1, name: "Wine Tasting Evening", date: "2024-01-22", attendees: 60, status: "upcoming" },
      { id: 2, name: "Jazz Brunch", date: "2024-01-14", attendees: 45, status: "completed" },
    ],
    campaignsList: [
      { id: 1, name: "Sunset Happy Hour", type: "discount", status: "active", reach: 300 },
      { id: 2, name: "Date Night Special", type: "promotion", status: "active", reach: 180 },
    ],
    reviews: [
      { id: "review_4", rating: 5, comment: "Beautiful river views and amazing cocktails!", createdAt: new Date("2024-01-15T19:30:00Z") },
      { id: "review_5", rating: 5, comment: "Perfect for date night", createdAt: new Date("2024-01-13T21:15:00Z") },
    ]
  }
]

export default function BarsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddBarOpen, setIsAddBarOpen] = useState(false)
  const [newBarForm, setNewBarForm] = useState({
    name: "",
    owner: "",
    type: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    priceRange: "$$",
    status: "active"
  })
  const router = useRouter()

  const filteredBars = bars.filter((bar) => {
    const searchLower = searchTerm.toLowerCase()
    
    // Search through all card-displayed data
    return (
      // Basic info
      bar.name.toLowerCase().includes(searchLower) ||
      bar.owner.toLowerCase().includes(searchLower) ||
      bar.location.toLowerCase().includes(searchLower) ||
      
      // Additional card content
      bar.type.toLowerCase().includes(searchLower) ||
      bar.phone.toLowerCase().includes(searchLower) ||
      bar.email.toLowerCase().includes(searchLower) ||
      bar.description.toLowerCase().includes(searchLower) ||
      
      // Tags
      bar.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      
      // Status
      bar.status.toLowerCase().includes(searchLower) ||
      
      // Price range
      bar.priceRange.toLowerCase().includes(searchLower) ||
      
      // Numbers as strings for search
      bar.rating.toString().includes(searchLower) ||
      bar.events.toString().includes(searchLower) ||
      bar.campaigns.toString().includes(searchLower) ||
      bar.reviewCount.toString().includes(searchLower) ||
      bar.availableDrinks.toString().includes(searchLower)
    )
  })

  const handleViewDetails = (bar: any) => {
    router.push(`/bars/${bar.id}`)
  }

  const handleAddBar = () => {
    // In a real app, this would make an API call
    console.log("Adding new bar:", newBarForm)
    
    // Reset form
    setNewBarForm({
      name: "",
      owner: "",
      type: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      priceRange: "$$",
      status: "active"
    })
    
    // Close modal
    setIsAddBarOpen(false)
    
    // Show success message (in a real app, you'd use a toast notification)
    alert("Bar added successfully!")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case "inactive":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Integrated Search */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Bars Directory</h2>
            <p className="text-gray-600">Manage all bars and their activities</p>
          </div>
          <Dialog open={isAddBarOpen} onOpenChange={setIsAddBarOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Bar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Bar</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new bar to the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bar Name</label>
                    <Input
                      placeholder="Enter bar name"
                      value={newBarForm.name}
                      onChange={(e) => setNewBarForm({...newBarForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Owner</label>
                    <Input
                      placeholder="Enter owner name"
                      value={newBarForm.owner}
                      onChange={(e) => setNewBarForm({...newBarForm, owner: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Input
                      placeholder="e.g., Jazz Bar, Sports Bar"
                      value={newBarForm.type}
                      onChange={(e) => setNewBarForm({...newBarForm, type: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price Range</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newBarForm.priceRange}
                      onChange={(e) => setNewBarForm({...newBarForm, priceRange: e.target.value})}
                    >
                      <option value="$">$ (Inexpensive)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Expensive)</option>
                      <option value="$$$$">$$$$ (Very Expensive)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    placeholder="Enter full address"
                    value={newBarForm.address}
                    onChange={(e) => setNewBarForm({...newBarForm, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter phone number"
                      value={newBarForm.phone}
                      onChange={(e) => setNewBarForm({...newBarForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter email address"
                      value={newBarForm.email}
                      onChange={(e) => setNewBarForm({...newBarForm, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe the bar..."
                    className="w-full p-2 border border-gray-300 rounded-md h-20"
                    value={newBarForm.description}
                    onChange={(e) => setNewBarForm({...newBarForm, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddBarOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBar} className="bg-indigo-600 hover:bg-indigo-700">
                  Add Bar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Compact Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bars..."
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

      {/* Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBars.map((bar) => (
          <Card key={bar.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleViewDetails(bar)}>
            {/* Bar Image Header */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {getStatusBadge(bar.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30">
                      <MoreHorizontal className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(bar)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Bar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Manage Events
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Manage Campaigns
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Bar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Bar Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src={bar.image} alt={bar.name} />
                    <AvatarFallback className="text-sm font-semibold bg-white/20 text-white">
                      {bar.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{bar.name}</h3>
                    <p className="text-white/80 text-sm truncate">{bar.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Content */}
            <CardContent className="p-6">
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{bar.rating}</span>
                </div>
                <span className="text-gray-500 text-sm">({bar.reviewCount} reviews)</span>
              </div>

              {/* Owner and Location */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{bar.owner}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{bar.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{bar.phone}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Events</span>
                  </div>
                  <span className="text-xl font-bold text-blue-900">{bar.events}</span>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Campaigns</span>
                  </div>
                  <span className="text-xl font-bold text-purple-900">{bar.campaigns}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {bar.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {bar.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{bar.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBars.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bars found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? `No bars match "${searchTerm}"` : "Get started by adding your first bar"}
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Bar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
