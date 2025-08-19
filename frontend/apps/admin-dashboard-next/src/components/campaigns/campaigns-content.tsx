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
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  Users,
  DollarSign,
} from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "Summer Music Festival Promotion",
    status: "active",
    type: "email",
    targetAudience: "All Users",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    budget: "$5,000",
    spent: "$3,200",
    impressions: 25000,
    clicks: 1200,
    conversions: 180,
    ctr: "4.8%",
    cpc: "$2.67",
  },
  {
    id: 2,
    name: "New Bar Partner Welcome",
    status: "active",
    type: "push",
    targetAudience: "New Users",
    startDate: "2024-07-15",
    endDate: "2024-08-15",
    budget: "$2,500",
    spent: "$1,800",
    impressions: 15000,
    clicks: 900,
    conversions: 120,
    ctr: "6.0%",
    cpc: "$2.00",
  },
  {
    id: 3,
    name: "Premium Subscription Drive",
    status: "paused",
    type: "social",
    targetAudience: "Active Users",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    budget: "$8,000",
    spent: "$6,500",
    impressions: 45000,
    clicks: 2800,
    conversions: 350,
    ctr: "6.2%",
    cpc: "$2.32",
  },
  {
    id: 4,
    name: "Holiday Season Special",
    status: "draft",
    type: "email",
    targetAudience: "Premium Users",
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    budget: "$10,000",
    spent: "$0",
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: "0%",
    cpc: "$0",
  },
]

export default function CampaignsContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "email":
        return <Badge className="bg-purple-100 text-purple-800">Email</Badge>
      case "push":
        return <Badge className="bg-blue-100 text-blue-800">Push</Badge>
      case "social":
        return <Badge className="bg-pink-100 text-pink-800">Social</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateProgress = (spent: string, budget: string) => {
    const spentNum = parseInt(spent.replace(/[$,]/g, ""))
    const budgetNum = parseInt(budget.replace(/[$,]/g, ""))
    return (spentNum / budgetNum) * 100
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage marketing campaigns and promotions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(campaign => campaign.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${campaigns.reduce((sum, campaign) => sum + parseInt(campaign.budget.replace(/[$,]/g, "")), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Allocated budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Campaign reach
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful conversions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns Directory</CardTitle>
          <CardDescription>
            Manage and monitor all marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by name, type, or audience..."
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
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {campaign.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{campaign.targetAudience}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{formatDate(campaign.startDate)}</div>
                        <div className="text-sm text-muted-foreground">to {formatDate(campaign.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.budget}</div>
                        <div className="text-sm text-muted-foreground">
                          Spent: {campaign.spent}
                        </div>
                        <Progress 
                          value={calculateProgress(campaign.spent, campaign.budget)} 
                          className="mt-1 h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{campaign.impressions.toLocaleString()}</span> impressions
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{campaign.ctr}</span> CTR
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{campaign.conversions}</span> conversions
                        </div>
                      </div>
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
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Campaign
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
