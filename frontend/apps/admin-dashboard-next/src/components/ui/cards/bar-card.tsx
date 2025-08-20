"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  MoreHorizontal,
  MapPin,
  Phone,
  Star,
  User,
  Calendar,
  Wine,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

export interface BarCardProps {
  id: number
  name: string
  type: string
  rating: number
  reviews: number
  image: string
  location: string
  owner: string
  phone: string
  email: string
  status: string
  priceRange: string
  tags: string[]
  events: any[]
  availableDrinks: number
  description?: string
  isOpen?: boolean
  openUntil?: string
  crowdLevel?: string
  onViewDetails?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  className?: string
}

export function BarCard({
  id,
  name,
  type,
  rating,
  reviews,
  image,
  location,
  owner,
  phone,
  email,
  status,
  priceRange,
  tags,
  events,
  availableDrinks,
  description,
  isOpen = true,
  openUntil,
  crowdLevel,
  onViewDetails,
  onEdit,
  onDelete,
  className = "",
}: BarCardProps) {
  const [imageError, setImageError] = useState(false)

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

  const handleViewDetails = () => {
    onViewDetails?.(id)
  }

  const handleEdit = () => {
    onEdit?.(id)
  }

  const handleDelete = () => {
    onDelete?.(id)
  }

  return (
         <div 
       className={`group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] rounded-lg ${className}`}
       onClick={handleViewDetails}
     >
              {/* Image Header */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
         <img
           src={imageError ? "/placeholder-bar.jpg" : image}
           alt={name}
           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
           onError={() => setImageError(true)}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-white/20">
            <DropdownMenuItem 
              className="hover:bg-indigo-50 rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleViewDetails()
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-indigo-50 rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 hover:bg-red-50 rounded-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {getStatusBadge(status)}
        </div>

        {/* Bar Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-14 w-14 border-2 border-white/80 ring-2 ring-white/20">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-bold text-white">{rating}</span>
                <span className="text-white/80">({reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Card Content */}
       <div className="p-4">
                 {/* Owner Info */}
         <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-3">
           <User className="h-3 w-3 text-blue-600" />
           <span className="text-xs font-medium text-blue-900">{owner}</span>
         </div>

         {/* Location */}
         <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg mb-3">
           <MapPin className="h-3 w-3 text-green-600" />
           <span className="text-xs font-medium text-green-900">{location}</span>
         </div>

         {/* Contact */}
         <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mb-3">
           <Phone className="h-3 w-3 text-purple-600" />
           <span className="text-xs font-medium text-purple-900">{phone}</span>
         </div>

                 {/* Stats Row */}
         <div className="grid grid-cols-3 gap-2 mb-3">
           <div className="text-center p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
             <div className="text-sm font-bold text-gray-900">{events.length}</div>
             <div className="text-xs text-gray-600">Events</div>
           </div>
           <div className="text-center p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
             <div className="text-sm font-bold text-gray-900">{availableDrinks}</div>
             <div className="text-xs text-gray-600">Drinks</div>
           </div>
           <div className="text-center p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
             <div className="text-sm font-bold text-gray-900">{priceRange}</div>
             <div className="text-xs text-gray-600">Price</div>
           </div>
         </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-white/50 border-gray-200 hover:bg-gray-50"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-white/50 border-gray-200 hover:bg-gray-50">
              +{tags.length - 3} more
            </Badge>
          )}
                 </div>
       </div>
     </div>
  )
}
