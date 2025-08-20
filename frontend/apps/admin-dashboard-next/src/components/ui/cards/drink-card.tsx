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
  Wine,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Droplets,
  Clock,
  Zap,
} from "lucide-react"

export interface DrinkCardProps {
  id: number
  name: string
  shortDescription: string
  category: string
  image: string
  alcoholPercentage: string
  servingSize: string
  price: string
  ingredients?: string
  onViewDetails?: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  className?: string
}

export function DrinkCard({
  id,
  name,
  shortDescription,
  category,
  image,
  alcoholPercentage,
  servingSize,
  price,
  ingredients,
  onViewDetails,
  onEdit,
  onDelete,
  className = "",
}: DrinkCardProps) {
  const [imageError, setImageError] = useState(false)

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      "Cocktail": "bg-pink-100 text-pink-800",
      "Beer": "bg-amber-100 text-amber-800",
      "Wine": "bg-purple-100 text-purple-800",
      "Spirit": "bg-orange-100 text-orange-800",
      "Non-Alcoholic": "bg-green-100 text-green-800",
    }
    
    return (
      <Badge className={`${categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"} font-medium`}>
        {category}
      </Badge>
    )
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
           src={imageError ? "/placeholder-drink.jpg" : image}
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

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          {getCategoryBadge(category)}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white font-bold text-lg">{price}</span>
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
        {/* Drink Name */}
        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        {/* Short Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {shortDescription}
        </p>

        {/* Ingredients Section (if available) */}
        {ingredients && ingredients.trim() && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-semibold text-amber-800">Ingredients</span>
            </div>
            <p className="text-sm text-amber-700">{ingredients}</p>
          </div>
        )}

        {/* Drink Details */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">ABV</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{alcoholPercentage}</span>
          </div>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Size</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{servingSize}</span>
          </div>
          
          <div className="w-px h-4 bg-gray-300"></div>
          
          <div className="text-right">
            <span className="font-bold text-xl text-indigo-600">{price}</span>
          </div>
                 </div>
       </div>
     </div>
  )
}
