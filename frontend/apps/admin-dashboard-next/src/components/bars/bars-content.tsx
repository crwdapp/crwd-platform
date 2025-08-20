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
  Sparkles,
  Zap,
  Target,
  X,
  User,
} from "lucide-react"
import { barsData } from "@/data/barsData"
import { BarCard } from "@/components/ui/cards"

// Use shared bars data
const bars = barsData

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
      bar.events.length.toString().includes(searchLower) ||
      bar.availableDrinks.toString().includes(searchLower)
    )
  })

  const handleViewDetails = (id: number) => {
    router.push(`/bars/${id}`)
  }

  const handleEdit = (id: number) => {
    // In a real app, this would navigate to edit page or open edit modal
    console.log("Edit bar:", id)
  }

  const handleDelete = (id: number) => {
    // In a real app, this would show confirmation dialog and delete
    console.log("Delete bar:", id)
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
    
    setIsAddBarOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 font-medium">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 font-medium">Pending</Badge>
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 font-medium">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 font-medium">{status}</Badge>
    }
  }

  // Calculate stats
  const totalBars = bars.length
  const activeBars = bars.filter(bar => bar.status === "active").length
  const totalEvents = bars.reduce((sum, bar) => sum + bar.events.length, 0)
  const averageRating = bars.reduce((sum, bar) => sum + bar.rating, 0) / bars.length

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bars Directory
            </h1>
            <p className="text-gray-600 mt-1">Manage all bars and venues in the platform</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsAddBarOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Bars</p>
                <p className="text-2xl font-bold text-blue-900">{totalBars}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Bars</p>
                <p className="text-2xl font-bold text-green-900">{activeBars}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Events</p>
                <p className="text-2xl font-bold text-purple-900">{totalEvents}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Avg Rating</p>
                <p className="text-2xl font-bold text-amber-900">{averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 h-12" />
        <Input
          placeholder="Search bars by name, owner, location, type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBars.map((bar) => (
          <BarCard
            key={bar.id}
            {...bar}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBars.length === 0 && (
        <div className="text-center py-12">
          <div className="p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bars found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? `No bars match "${searchTerm}"` : "Get started by adding your first bar"}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsAddBarOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Bar
            </Button>
          )}
        </div>
      )}

      {/* Add Bar Dialog */}
      <Dialog open={isAddBarOpen} onOpenChange={setIsAddBarOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Add New Bar</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new bar entry with all the necessary information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bar Name</label>
                <Input
                  placeholder="Enter bar name"
                  value={newBarForm.name}
                  onChange={(e) => setNewBarForm({...newBarForm, name: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Owner</label>
                <Input
                  placeholder="Enter owner name"
                  value={newBarForm.owner}
                  onChange={(e) => setNewBarForm({...newBarForm, owner: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Type</label>
                <Input
                  placeholder="e.g., Nightclub, Bar, Lounge"
                  value={newBarForm.type}
                  onChange={(e) => setNewBarForm({...newBarForm, type: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Address</label>
                <Input
                  placeholder="Enter full address"
                  value={newBarForm.address}
                  onChange={(e) => setNewBarForm({...newBarForm, address: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone</label>
                <Input
                  placeholder="Enter phone number"
                  value={newBarForm.phone}
                  onChange={(e) => setNewBarForm({...newBarForm, phone: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                <Input
                  placeholder="Enter email address"
                  value={newBarForm.email}
                  onChange={(e) => setNewBarForm({...newBarForm, email: e.target.value})}
                  className="bg-white/50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
            <textarea
              placeholder="Enter bar description"
              value={newBarForm.description}
              onChange={(e) => setNewBarForm({...newBarForm, description: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddBarOpen(false)}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddBar}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Add Bar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
