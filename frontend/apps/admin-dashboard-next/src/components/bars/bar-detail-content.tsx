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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  ArrowLeft,
  Save,
  X,
  Clock,
  Target,
  Activity,
  BarChart3,
  Wine,
  Clock3,
  MapPinIcon,
  Heart,
  MessageCircle,
  Share2,
  Navigation,
  Zap,
  Music,
  User,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  Music as MusicIcon,
  Image as ImageIcon,
  Upload,
  Tag,
  DollarSign as DollarSignIcon,
} from "lucide-react"

// Mock data based on user app structure
const bars = [
  {
    id: 1,
    name: "Control Club",
    type: "Electronic Music Club",
    rating: 4.8,
    reviews: 324,
    lat: 44.4378,
    lng: 26.0969,
    image: "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "BUCHAREST",
    availableDrinks: 47,
    isOpen: true,
    tags: ["Electronic", "Dancing", "Late Night"],
    openUntil: "3:00 AM",
    crowdLevel: "High",
    filters: ["live-music", "late-night", "groups", "dancing"],
    description: "Bucharest's premier underground electronic music venue featuring world-class DJs, state-of-the-art sound system, and an unforgettable atmosphere.",
    address: "Strada Blanari 14, Bucharest 030167, Romania",
    phone: "+40 21 314 0158",
    priceRange: "$$$",
    images: [
      "https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    hours: {
      "Monday": "Closed",
      "Tuesday": "Closed",
      "Wednesday": "10:00 PM - 3:00 AM",
      "Thursday": "10:00 PM - 3:00 AM",
      "Friday": "10:00 PM - 4:00 AM",
      "Saturday": "10:00 PM - 4:00 AM",
      "Sunday": "10:00 PM - 2:00 AM",
    },
    events: [
      { 
        id: 1, 
        name: "Electronic Fridays", 
        date: "2024-01-26", 
        time: "10:00 PM",
        dj: "DJ Pulse", 
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        description: "Experience the best electronic music with world-class DJs",
        price: "FREE",
        capacity: 200,
        attendees: 45,
        status: "upcoming",
        tags: ["electronic", "dancing", "live-music"]
      },
      { 
        id: 2, 
        name: "Techno Night", 
        date: "2024-02-02", 
        time: "11:00 PM",
        dj: "DJ Techno", 
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        description: "Pure techno vibes all night long",
        price: "50 RON",
        capacity: 150,
        attendees: 23,
        status: "upcoming",
        tags: ["techno", "underground"]
      },
    ],
         availableDrinksMenu: [
       { 
         id: 1, 
         name: "House Beer", 
         shortDescription: "Local draft beer - Ursus or Ciuc", 
         category: "Beer",
         image: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400",
         alcoholPercentage: "4.4%",
         servingSize: "500ml",
         price: "45 RON",
         ingredients: ""
       },
       { 
         id: 2, 
         name: "Electronic Martini", 
         shortDescription: "Premium vodka with electronic music vibes", 
         category: "Cocktail",
         image: "https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=400",
         alcoholPercentage: "40%",
         servingSize: "300ml",
         price: "65 RON",
         ingredients: "Vodka, Vermouth, Olive"
       },
     ],
    drinksServedToday: 156,
    totalTokensRedeemed: 89,
    lastUpdated: "2024-08-08T15:30:00Z"
  },
  {
    id: 2,
    name: "Old Town",
    type: "Traditional Pub",
    rating: 4.5,
    reviews: 287,
    lat: 44.4268,
    lng: 26.1025,
    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400",
    location: "BUCHAREST",
    availableDrinks: 32,
    isOpen: true,
    tags: ["Traditional", "Local", "Cozy"],
    openUntil: "2:00 AM",
    crowdLevel: "Medium",
    filters: ["traditional", "local", "cozy", "groups"],
    description: "A cozy traditional pub in the heart of Bucharest's Old Town, serving local beers and traditional Romanian dishes.",
    address: "Strada Lipscani 15, Bucharest 030167, Romania",
    phone: "+40 21 312 3456",
    priceRange: "$$",
    images: [
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    hours: {
      "Monday": "12:00 PM - 2:00 AM",
      "Tuesday": "12:00 PM - 2:00 AM",
      "Wednesday": "12:00 PM - 2:00 AM",
      "Thursday": "12:00 PM - 2:00 AM",
      "Friday": "12:00 PM - 2:00 AM",
      "Saturday": "12:00 PM - 2:00 AM",
      "Sunday": "12:00 PM - 2:00 AM",
    },
    events: [
      { 
        id: 1, 
        name: "Live Folk Music", 
        date: "2024-01-27", 
        time: "8:00 PM",
        dj: "Traditional Band", 
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        description: "Traditional Romanian folk music and dancing",
        price: "FREE",
        capacity: 80,
        attendees: 35,
        status: "upcoming",
        tags: ["folk", "traditional", "live-music"]
      },
    ],
         availableDrinksMenu: [
       { 
         id: 1, 
         name: "Local Beer", 
         shortDescription: "Traditional Romanian beer", 
         category: "Beer",
         image: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400",
         alcoholPercentage: "5.0%",
         servingSize: "500ml",
         price: "25 RON",
         ingredients: ""
       },
     ],
    drinksServedToday: 89,
    totalTokensRedeemed: 45,
    lastUpdated: "2024-08-08T14:20:00Z"
  }
]

interface BarDetailContentProps {
  barId: string
}

interface EventFormData {
  name: string
  date: string
  time: string
  dj: string
  description: string
  price: string
  capacity: number
  tags: string[]
  image: string
}

interface MenuItemFormData {
  name: string
  category: string
  servingSize: string
  price: string
  alcoholPercentage: string
  ingredients: string
  image: string
  imageFile?: File
  shortDescription: string
}

export default function BarDetailContent({ barId }: BarDetailContentProps) {
  const router = useRouter()
  const bar = bars.find(b => b.id === parseInt(barId))
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [editForm, setEditForm] = useState({
    name: bar?.name || "",
    description: bar?.description || "",
    address: bar?.address || "",
    phone: bar?.phone || "",
    priceRange: bar?.priceRange || "",
    type: bar?.type || "",
    isOpen: bar?.isOpen ?? true,
  })

  // Event management states
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<number | null>(null)
  const [eventForm, setEventForm] = useState<EventFormData>({
    name: "",
    date: "",
    time: "",
    dj: "",
    description: "",
    price: "",
    capacity: 100,
    tags: [],
    image: ""
  })

  // Menu item management states
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<number | null>(null)
  const [menuItemForm, setMenuItemForm] = useState<MenuItemFormData>({
    name: "",
    category: "",
    servingSize: "",
    price: "",
    alcoholPercentage: "",
    ingredients: "",
    image: "",
    imageFile: undefined,
    shortDescription: ""
  })

  if (!bar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bar not found</h2>
          <p className="text-gray-600 mb-6">The bar you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/bars")} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bars
          </Button>
        </div>
      </div>
    )
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getOpenStatusBadge = (isOpen: boolean) => {
    return isOpen ? 
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Open</Badge> :
      <Badge className="bg-red-50 text-red-700 border-red-200">Closed</Badge>
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
      name: bar.name,
      description: bar.description,
      address: bar.address,
      phone: bar.phone,
      priceRange: bar.priceRange,
      type: bar.type,
      isOpen: bar.isOpen,
    })
    setIsEditing(false)
  }

  // Event management functions
  const handleAddEvent = () => {
    setEditingEvent(null)
    setEventForm({
      name: "",
      date: "",
      time: "",
      dj: "",
      description: "",
      price: "",
      capacity: 100,
      tags: [],
      image: ""
    })
    setShowEventDialog(true)
  }

  const handleEditEvent = (eventId: number) => {
    const event = bar.events.find(e => e.id === eventId)
    if (event) {
      setEditingEvent(eventId)
      setEventForm({
        name: event.name,
        date: event.date,
        time: event.time,
        dj: event.dj,
        description: event.description,
        price: event.price,
        capacity: event.capacity,
        tags: event.tags,
        image: event.image
      })
      setShowEventDialog(true)
    }
  }

  const handleDeleteEvent = (eventId: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      console.log("Deleting event:", eventId)
      // In a real app, this would make an API call
    }
  }

  const handleSaveEvent = () => {
    if (editingEvent) {
      console.log("Updating event:", editingEvent, eventForm)
    } else {
      console.log("Creating new event:", eventForm)
    }
    setShowEventDialog(false)
  }

  const handleCancelEvent = () => {
    setShowEventDialog(false)
    setEditingEvent(null)
  }

  // Menu item management functions
  const handleAddMenuItem = () => {
    setEditingMenuItem(null)
    setMenuItemForm({
      name: "",
      category: "",
      servingSize: "",
      price: "",
      alcoholPercentage: "",
      ingredients: "",
      image: "",
      imageFile: undefined,
      shortDescription: ""
    })
    setShowMenuItemDialog(true)
  }

  const handleEditMenuItem = (itemId: number) => {
    const item = bar.availableDrinksMenu.find(i => i.id === itemId)
    if (item) {
      setEditingMenuItem(itemId)
      setMenuItemForm({
        name: item.name,
        category: item.category,
        servingSize: item.servingSize,
        price: item.price,
        alcoholPercentage: item.alcoholPercentage,
        ingredients: item.ingredients,
        image: item.image,
        imageFile: undefined,
        shortDescription: item.shortDescription
      })
      setShowMenuItemDialog(true)
    }
  }

  const handleDeleteMenuItem = (itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      console.log("Deleting menu item:", itemId)
      // In a real app, this would make an API call
    }
  }

  const handleSaveMenuItem = () => {
    if (editingMenuItem) {
      console.log("Updating menu item:", editingMenuItem, menuItemForm)
      // In a real app, you would upload the file to a server and get back a URL
      if (menuItemForm.imageFile) {
        console.log("Uploading new image file:", menuItemForm.imageFile)
        // Simulate file upload - in real app, use FormData to upload to server
      }
    } else {
      console.log("Creating new menu item:", menuItemForm)
      // In a real app, you would upload the file to a server and get back a URL
      if (menuItemForm.imageFile) {
        console.log("Uploading image file:", menuItemForm.imageFile)
        // Simulate file upload - in real app, use FormData to upload to server
      }
    }
    setShowMenuItemDialog(false)
  }

  const handleCancelMenuItem = () => {
    setShowMenuItemDialog(false)
    setEditingMenuItem(null)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create a preview URL for the uploaded image
      const previewUrl = URL.createObjectURL(file)
      setMenuItemForm({
        ...menuItemForm,
        imageFile: file,
        image: previewUrl
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header - Similar to user app */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/bars")}
              className="text-white hover:bg-white/20 border-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bars
            </Button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-white/20">
                  <AvatarImage src={bar.image} alt={bar.name} />
                  <AvatarFallback className="text-2xl font-bold bg-white/10 text-white">
                    {bar.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  {getOpenStatusBadge(bar.isOpen)}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{bar.name}</h1>
                <p className="text-indigo-100 text-lg mb-1">{bar.type}</p>
                <div className="flex items-center gap-4 text-indigo-100">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{bar.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{bar.rating}/5 ({bar.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wine className="h-4 w-4" />
                    <span>{bar.availableDrinks} drinks available</span>
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
                  <Button onClick={handleSave} className="bg-white text-indigo-600 hover:bg-gray-100">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-white text-indigo-600 hover:bg-gray-100">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Bar
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Edit Bar Information</h3>
              <p className="text-gray-600">Update bar details and settings</p>
            </div>
            <Card className="shadow-sm border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Bar Name</label>
                    <Input 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <Input 
                      value={editForm.type}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Input 
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input 
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                      value={editForm.priceRange}
                      onChange={(e) => setEditForm({...editForm, priceRange: e.target.value})}
                    >
                      <option value="$">$ (Inexpensive)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Expensive)</option>
                      <option value="$$$$">$$$$ (Very Expensive)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                      value={editForm.isOpen ? "open" : "closed"}
                      onChange={(e) => setEditForm({...editForm, isOpen: e.target.value === "open"})}
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 h-24"
                      placeholder="Describe your bar..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border rounded-xl p-1 mb-8">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="menu" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                Menu ({bar.availableDrinksMenu.length})
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">
                Events ({bar.events.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Available Drinks</p>
                        <p className="text-2xl font-bold text-blue-900">{bar.availableDrinks}</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Wine className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Drinks Served Today</p>
                        <p className="text-2xl font-bold text-green-900">{bar.drinksServedToday}</p>
                      </div>
                      <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Tokens Redeemed</p>
                        <p className="text-2xl font-bold text-purple-900">{bar.totalTokensRedeemed}</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bar Information & Hours */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      Bar Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{bar.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Phone className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Phone</p>
                            <p className="font-semibold">{bar.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Address</p>
                            <p className="font-semibold">{bar.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Price Range</p>
                            <p className="font-semibold">{bar.priceRange}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Crowd Level</p>
                            <Badge className={getCrowdColor(bar.crowdLevel)}>{bar.crowdLevel}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {bar.tags.map((tag, index) => (
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
                      <Clock3 className="h-5 w-5 text-indigo-600" />
                      Operating Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(bar.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Location Map Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Navigation className="h-5 w-5 text-indigo-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Map View</p>
                      <p className="text-sm text-gray-500">{bar.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="menu" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Menu</h3>
                  <p className="text-gray-600">Manage the menu for {bar.name}</p>
                </div>
                                 <Button onClick={handleAddMenuItem} className="bg-indigo-600 hover:bg-indigo-700">
                   <Plus className="mr-2 h-4 w-4" />
                   Add Drink
                 </Button>
              </div>
              
              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bar.availableDrinksMenu.map((drink) => (
                  <Card key={drink.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src={drink.image} 
                        alt={drink.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/70 text-white border-0">
                          {drink.category}
                        </Badge>
                      </div>
                    </div>
                                                              <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{drink.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{drink.shortDescription}</p>
                        
                        {/* Ingredients - only show if they exist */}
                        {drink.ingredients && drink.ingredients.trim() !== "" && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
                            <p className="text-xs text-gray-600">{drink.ingredients}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <p>{drink.alcoholPercentage} • {drink.servingSize}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">{drink.price}</p>
                          </div>
                        </div>
                                              <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEditMenuItem(drink.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDeleteMenuItem(drink.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                     </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Events</h3>
                  <p className="text-gray-600">Manage all events for {bar.name}</p>
                </div>
                <Button onClick={handleAddEvent} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
              
              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bar.events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 relative">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        {getEventStatusBadge(event.status)}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/70 text-white border-0">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{event.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MusicIcon className="h-4 w-4" />
                          <span>{event.dj}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <UsersIcon className="h-4 w-4" />
                          <span>{event.attendees}/{event.capacity} attendees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSignIcon className="h-4 w-4" />
                          <span>{event.price}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Event Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update event details" : "Create a new event for this bar"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Name</label>
                <Input 
                  value={eventForm.name}
                  onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                  placeholder="Enter event name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">DJ/Artist</label>
                <Input 
                  value={eventForm.dj}
                  onChange={(e) => setEventForm({...eventForm, dj: e.target.value})}
                  placeholder="Enter DJ or artist name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input 
                  value={eventForm.price}
                  onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                  placeholder="e.g., FREE, 50 RON"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input 
                  type="number"
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({...eventForm, capacity: parseInt(e.target.value)})}
                  placeholder="Maximum attendees"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input 
                  value={eventForm.image}
                  onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                  placeholder="Enter image URL"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input 
                  value={eventForm.tags.join(", ")}
                  onChange={(e) => setEventForm({...eventForm, tags: e.target.value.split(", ").filter(tag => tag.trim())})}
                  placeholder="electronic, dancing, live-music"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 h-24"
                  placeholder="Describe the event..."
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEvent}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent}>
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Menu Item Dialog */}
        <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
              </DialogTitle>
              <DialogDescription>
                {editingMenuItem ? "Update menu item details" : "Create a new menu item for this bar"}
              </DialogDescription>
            </DialogHeader>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Drink Name</label>
                  <Input 
                    value={menuItemForm.name}
                    onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                    placeholder="e.g. Aperol Spritz"
                  />
                </div>
               
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                                     <select 
                     className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                     value={menuItemForm.category}
                     onChange={(e) => setMenuItemForm({...menuItemForm, category: e.target.value})}
                   >
                     <option value="">Select category</option>
                     <option value="Beer">Beer</option>
                     <option value="Wine">Wine</option>
                     <option value="Cocktail">Cocktail</option>
                     <option value="Spirit">Spirit</option>
                     <option value="Non-Alcoholic">Non-Alcoholic</option>
                   </select>
                </div>
               
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Serving Size</label>
                  <div className="flex gap-2">
                    <Input 
                      type="number"
                      value={menuItemForm.servingSize.replace(/[^\d]/g, '')}
                      onChange={(e) => setMenuItemForm({...menuItemForm, servingSize: e.target.value + 'ml'})}
                      placeholder="e.g., 330"
                      className="flex-1"
                    />
                    <select 
                      className="w-20 p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                      value={menuItemForm.servingSize.includes('cl') ? 'cl' : 'ml'}
                      onChange={(e) => {
                        const size = menuItemForm.servingSize.replace(/[^\d]/g, '')
                        setMenuItemForm({...menuItemForm, servingSize: size + e.target.value})
                      }}
                    >
                      <option value="ml">ml</option>
                      <option value="cl">cl</option>
                    </select>
                  </div>
                </div>
               
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Price (RON)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={menuItemForm.price.replace(/[^\d.]/g, '')}
                    onChange={(e) => setMenuItemForm({...menuItemForm, price: e.target.value + ' RON'})}
                    placeholder="e.g., 25.00"
                  />
                </div>
               
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Alcohol % (ABV)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={menuItemForm.alcoholPercentage.replace(/[^\d.]/g, '')}
                    onChange={(e) => setMenuItemForm({...menuItemForm, alcoholPercentage: e.target.value + '%'})}
                    placeholder="e.g., 12.5"
                  />
                </div>
                
                {menuItemForm.category === 'Cocktail' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ingredients</label>
                    <textarea 
                      value={menuItemForm.ingredients}
                      onChange={(e) => setMenuItemForm({...menuItemForm, ingredients: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 h-20"
                      placeholder="e.g., Gin, tonic water, lime"
                    />
                  </div>
                )}
               
                               <div className="space-y-2">
                  <label className="text-sm font-medium">Item Image</label>
                  <div className="space-y-3">
                    {/* Image Preview */}
                    {menuItemForm.image && (
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={menuItemForm.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setMenuItemForm({...menuItemForm, image: "", imageFile: undefined})}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {/* File Upload */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
               
               <div className="md:col-span-2 space-y-2">
                 <label className="text-sm font-medium">Short Description</label>
                 <Input 
                   value={menuItemForm.shortDescription}
                   onChange={(e) => setMenuItemForm({...menuItemForm, shortDescription: e.target.value})}
                   placeholder="Brief description for the menu"
                 />
               </div>
             </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelMenuItem}>
                Cancel
              </Button>
              <Button onClick={handleSaveMenuItem}>
                {editingMenuItem ? "Update Item" : "Create Item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

