"use client"

import { useState } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"

const bars = [
  {
    id: 1,
    name: "The Blue Moon",
    owner: "John Smith",
    location: "Downtown, City Center",
    status: "active",
    rating: 4.5,
    events: 12,
    revenue: "$12,450",
    image: "/bars/blue-moon.jpg",
    phone: "+1 (555) 123-4567",
    email: "john@bluemoon.com",
  },
  {
    id: 2,
    name: "Downtown Pub",
    owner: "Sarah Wilson",
    location: "West End, Business District",
    status: "active",
    rating: 4.2,
    events: 8,
    revenue: "$8,920",
    image: "/bars/downtown-pub.jpg",
    phone: "+1 (555) 234-5678",
    email: "sarah@downtownpub.com",
  },
  {
    id: 3,
    name: "Riverside Lounge",
    owner: "Mike Johnson",
    location: "Riverside, Waterfront",
    status: "pending",
    rating: 4.8,
    events: 15,
    revenue: "$15,670",
    image: "/bars/riverside-lounge.jpg",
    phone: "+1 (555) 345-6789",
    email: "mike@riversidelounge.com",
  },
  {
    id: 4,
    name: "The Golden Tap",
    owner: "Emily Brown",
    location: "Northside, Arts District",
    status: "active",
    rating: 4.1,
    events: 6,
    revenue: "$6,340",
    image: "/bars/golden-tap.jpg",
    phone: "+1 (555) 456-7890",
    email: "emily@goldentap.com",
  },
  {
    id: 5,
    name: "Jazz Corner",
    owner: "David Lee",
    location: "East End, Cultural Quarter",
    status: "suspended",
    rating: 4.6,
    events: 20,
    revenue: "$18,230",
    image: "/bars/jazz-corner.jpg",
    phone: "+1 (555) 567-8901",
    email: "david@jazzcorner.com",
  },
]

export default function BarsContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBars = bars.filter((bar) =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bar.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bar.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bars Management</h1>
          <p className="text-muted-foreground">
            Manage partner bars and their information
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Bar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bars</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bars.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bars</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bars.filter(bar => bar.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bars.reduce((sum, bar) => sum + bar.events, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all bars
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bars.reduce((sum, bar) => sum + parseInt(bar.revenue.replace(/[$,]/g, "")), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bars Directory</CardTitle>
          <CardDescription>
            Search and manage all registered bars
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bars by name, owner, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filters</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bar</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBars.map((bar) => (
                  <TableRow key={bar.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={bar.image} alt={bar.name} />
                          <AvatarFallback>
                            {bar.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{bar.name}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {bar.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bar.owner}</div>
                        <div className="text-sm text-muted-foreground">{bar.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {bar.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(bar.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{bar.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{bar.events}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{bar.revenue}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Bar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Bar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
