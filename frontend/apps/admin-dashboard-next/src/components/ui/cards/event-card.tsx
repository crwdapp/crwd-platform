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
import {
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  Music,
  MapPin,
  Star,
} from "lucide-react"

export interface EventCardProps {
  id: number
  name: string
  date: string
  time: string
  dj: string
  image: string
  description: string
  price: string
  capacity: number
  attendees: number
  status: string
  tags: string[]
  onViewDetails?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  className?: string
}

export function EventCard({
  id,
  name,
  date,
  time,
  dj,
  image,
  description,
  price,
  capacity,
  attendees,
  status,
  tags,
  onViewDetails,
  onEdit,
  onDelete,
  className = "",
}: EventCardProps) {
  const [imageError, setImageError] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "upcoming": "bg-blue-100 text-blue-800",
      "ongoing": "bg-green-100 text-green-800",
      "completed": "bg-gray-100 text-gray-800",
      "cancelled": "bg-red-100 text-red-800",
    }
    
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"} font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const attendancePercentage = Math.round((attendees / capacity) * 100)

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
          src={imageError ? "/placeholder-event.jpg" : image}
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

        {/* Date Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white font-bold text-sm">{formatDate(date)}</span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full px-3 py-1 shadow-lg">
            <span className="text-white font-bold text-sm">{price}</span>
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white border-0 shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-500/90 backdrop-blur-sm text-white hover:bg-red-600 border-0 shadow-lg"
              onClick={(e) => {
                e.stopPropagation()
                handleDelete()
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

             {/* Card Content */}
       <div className="p-6">
        {/* Event Name */}
        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-4">
          {/* Date & Time */}
          <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <Calendar className="h-4 w-4 text-blue-600" />
            <div>
              <span className="text-sm font-medium text-blue-900">{formatDate(date)}</span>
              <span className="text-sm text-blue-700 ml-2">• {time}</span>
            </div>
          </div>

          {/* DJ/Artist */}
          <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <Music className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">{dj}</span>
          </div>

          {/* Attendance */}
          <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <Users className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-green-900">{attendees} / {capacity}</span>
                <span className="text-green-700">{attendancePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
            </div>
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
