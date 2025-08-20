"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Crown, 
  User, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Lock,
  Eye,
  Download,
  Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Enhanced user data with subscription and permissions
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+40 721 123 456",
    city: "Bucharest",
    role: "subscribed",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    avatar: "/avatars/01.png",
    subscription: {
      status: "active",
      tier: "premium",
      plan: "yearly",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: 480,
      autoRenew: true,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: true,
      canUseTokens: true,
      tokensPerDay: 6,
      maxTokens: 6
    },
    tokens: {
      available: 4,
      usedToday: 2,
      totalUsed: 156,
      lastReset: "2024-01-20T00:00:00Z"
    },
    stats: {
      totalVisits: 45,
      favoriteBars: 8,
      eventsAttended: 12,
      totalSpent: 1250
    }
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+40 722 234 567",
    city: "Cluj-Napoca",
    role: "normal",
    joinDate: "2024-02-20",
    lastLogin: "2024-01-19T14:20:00Z",
    avatar: "/avatars/02.png",
    subscription: {
      status: "none",
      tier: null,
      plan: null,
      startDate: null,
      endDate: null,
      price: 0,
      autoRenew: false,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: false,
      canUseTokens: false,
      tokensPerDay: 0,
      maxTokens: 0
    },
    tokens: {
      available: 0,
      usedToday: 0,
      totalUsed: 0,
      lastReset: null
    },
    stats: {
      totalVisits: 12,
      favoriteBars: 3,
      eventsAttended: 2,
      totalSpent: 180
    }
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+40 723 345 678",
    city: "Timișoara",
    role: "subscribed",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-18T09:15:00Z",
    avatar: "/avatars/03.png",
    subscription: {
      status: "trial",
      tier: "basic",
      plan: "monthly",
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      price: 30,
      autoRenew: true,
      trialEnds: "2024-01-25T00:00:00Z"
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: true,
      canUseTokens: true,
      tokensPerDay: 6,
      maxTokens: 6
    },
    tokens: {
      available: 6,
      usedToday: 0,
      totalUsed: 42,
      lastReset: "2024-01-20T00:00:00Z"
    },
    stats: {
      totalVisits: 28,
      favoriteBars: 5,
      eventsAttended: 8,
      totalSpent: 420
    }
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "+40 724 456 789",
    city: "Iași",
    role: "subscribed",
    joinDate: "2024-03-05",
    lastLogin: "2024-01-17T16:45:00Z",
    avatar: "/avatars/04.png",
    subscription: {
      status: "expired",
      tier: "premium",
      plan: "monthly",
      startDate: "2024-01-05",
      endDate: "2024-01-05",
      price: 40,
      autoRenew: false,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: false,
      canUseTokens: false,
      tokensPerDay: 0,
      maxTokens: 0
    },
    tokens: {
      available: 0,
      usedToday: 0,
      totalUsed: 89,
      lastReset: null
    },
    stats: {
      totalVisits: 35,
      favoriteBars: 6,
      eventsAttended: 10,
      totalSpent: 680
    }
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "+40 725 567 890",
    city: "Constanța",
    role: "normal",
    joinDate: "2024-01-25",
    lastLogin: "2024-01-16T11:30:00Z",
    avatar: "/avatars/05.png",
    subscription: {
      status: "none",
      tier: null,
      plan: null,
      startDate: null,
      endDate: null,
      price: 0,
      autoRenew: false,
      trialEnds: null
    },
    permissions: {
      canViewApp: true,
      canCheckInAtBars: false,
      canUseTokens: false,
      tokensPerDay: 0,
      maxTokens: 0
    },
    tokens: {
      available: 0,
      usedToday: 0,
      totalUsed: 0,
      lastReset: null
    },
    stats: {
      totalVisits: 8,
      favoriteBars: 2,
      eventsAttended: 1,
      totalSpent: 95
    }
  }
]

// Role definitions with permissions
const roleDefinitions = {
  normal: {
    name: "Normal User",
    description: "View app only - no tokens available",
    color: "bg-gray-100 text-gray-800",
    permissions: {
      canViewApp: true,
      canCheckInAtBars: false,
      canUseTokens: false,
      tokensPerDay: 0,
      maxTokens: 0
    }
  },
  subscribed: {
    name: "Subscribed User",
    description: "View app + check in at bars + 6 tokens/day",
    color: "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800",
    permissions: {
      canViewApp: true,
      canCheckInAtBars: true,
      canUseTokens: true,
      tokensPerDay: 6,
      maxTokens: 6
    }
  }
}

export default function UsersContent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

  const [showPasswordResetDialog, setShowPasswordResetDialog] = useState(false)
  const [showSuspendUserDialog, setShowSuspendUserDialog] = useState(false)
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showEditTokensDialog, setShowEditTokensDialog] = useState(false)

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    role: "normal"
  })



  const [tokenForm, setTokenForm] = useState({
    available: 0,
    usedToday: 0,
    totalUsed: 0,
    dailyLimit: 6
  })



  // Filter users based on search only
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  // Statistics
  const stats = {
    totalUsers: users.length,
    subscribedUsers: users.filter(u => u.role === "subscribed").length,
    activeSubscriptions: users.filter(u => u.subscription.status === "active").length,
    trialUsers: users.filter(u => u.subscription.status === "trial").length,
    expiredSubscriptions: users.filter(u => u.subscription.status === "expired").length,
    totalRevenue: users.reduce((sum, u) => sum + (u.subscription.price || 0), 0)
  }

  const handleViewDetails = (userId: number) => {
    router.push(`/users/${userId}`)
  }

  const handleAddUser = () => {
    // Add user logic here
    setShowAddUserDialog(false)
    setNewUserForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      role: "normal"
    })
  }





  const handleRoleChange = (userId: number, newRole: string) => {
    // Role change logic here
  }

  const handleSuspendUser = (userId: number) => {
    const user = users.find(u => u.id === userId)
    setSelectedUser(user)
    setShowSuspendUserDialog(true)
  }

  const handleConfirmSuspendUser = () => {
    // Suspend user logic here
    console.log(`Suspending user: ${selectedUser?.name} (${selectedUser?.email})`)
    setShowSuspendUserDialog(false)
    
    // TODO: API Integration
    // 1. Update user status to 'suspended' in database
    // 2. Send notification to mobile app about account suspension
    // 3. Mobile app should show suspended screen when user tries to log in
    // 4. Suspended screen should display: "Your account has been suspended. Contact support for assistance."
    // 5. In a real app, you would show a success toast here
  }

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId)
    setSelectedUser(user)
    setShowDeleteUserDialog(true)
  }

  const handleConfirmDeleteUser = () => {
    // Delete user logic here
    console.log(`Permanently deleting user: ${selectedUser?.name} (${selectedUser?.email})`)
    setShowDeleteUserDialog(false)
    // In a real app, you would show a success toast here
  }

  const handleDeleteAsSuspend = () => {
    // Suspend user instead of deleting
    console.log(`Suspending user instead of deleting: ${selectedUser?.name} (${selectedUser?.email})`)
    setShowDeleteUserDialog(false)
    
    // TODO: API Integration
    // 1. Update user status to 'suspended' in database
    // 2. Send notification to mobile app about account suspension
    // 3. Mobile app should show suspended screen when user tries to log in
    // 4. Suspended screen should display: "Your account has been suspended. Contact support for assistance."
    // 5. In a real app, you would show a success toast here
  }

  const handleEditTokens = () => {
    setTokenForm({
      available: selectedUser?.tokens?.available || 0,
      usedToday: selectedUser?.tokens?.usedToday || 0,
      totalUsed: selectedUser?.tokens?.totalUsed || 0,
      dailyLimit: selectedUser?.permissions?.tokensPerDay || 6
    })
    setShowEditTokensDialog(true)
  }

  const handleUpdateTokens = () => {
    // Update tokens logic here
    console.log(`Updating tokens for ${selectedUser?.name}:`, tokenForm)
    setShowEditTokensDialog(false)
    // In a real app, you would show a success toast here
  }

  const handleResetPassword = (userId: number) => {
    const user = users.find(u => u.id === userId)
    setSelectedUser(user)
    setShowPasswordResetDialog(true)
  }

  const handleSendPasswordReset = () => {
    // Send password reset email logic here
    console.log(`Sending password reset email to ${selectedUser?.email}`)
    setShowPasswordResetDialog(false)
    // In a real app, you would show a success toast here
  }

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "trial":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      case "canceled":
        return <Badge className="bg-gray-100 text-gray-800">Canceled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">None</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    const roleDef = roleDefinitions[role as keyof typeof roleDefinitions]
    return (
      <Badge className={roleDef.color}>
        {roleDef.name}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage users, subscriptions, and permissions</p>
        </div>
        <Button 
          onClick={() => setShowAddUserDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Subscribed</p>
                <p className="text-2xl font-bold text-purple-900">{stats.subscribedUsers}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Subs</p>
                <p className="text-2xl font-bold text-green-900">{stats.activeSubscriptions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Trial Users</p>
                <p className="text-2xl font-bold text-blue-900">{stats.trialUsers}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users by name, email, city, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts, subscriptions, and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold">Last Login</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                                                 <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">Joined {formatDate(user.joinDate)}</div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-1 h-3 w-3" />
                        {user.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1 h-3 w-3" />
                        {user.city}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {getSubscriptionBadge(user.subscription.status)}
                      {user.subscription.tier && (
                        <div className="text-xs text-gray-500">
                          {user.subscription.tier} • {user.subscription.plan}
                        </div>
                      )}
                      {user.subscription.price > 0 && (
                        <div className="text-xs text-gray-500">
                          €{user.subscription.price}/{user.subscription.plan === 'monthly' ? 'mo' : 'yr'}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(user.lastLogin)}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                          <Lock className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with basic information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={newUserForm.city}
                onChange={(e) => setNewUserForm({...newUserForm, city: e.target.value})}
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newUserForm.role} onValueChange={(value) => setNewUserForm({...newUserForm, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal User</SelectItem>
                  <SelectItem value="subscribed">Subscribed User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>



      

       {/* Password Reset Confirmation Dialog */}
       <Dialog open={showPasswordResetDialog} onOpenChange={setShowPasswordResetDialog}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center space-x-2">
               <Lock className="h-5 w-5 text-orange-500" />
               <span>Reset Password</span>
             </DialogTitle>
             <DialogDescription>
               Send a password reset link to {selectedUser?.name}?
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                 <div className="text-sm text-orange-800">
                   <p className="font-medium">Password Reset Email</p>
                   <p className="mt-1">
                     A password reset link will be sent to <strong>{selectedUser?.email}</strong>. 
                     The user will receive an email with instructions to create a new password.
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="flex justify-end space-x-2 pt-4">
               <Button 
                 variant="outline" 
                 onClick={() => setShowPasswordResetDialog(false)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={handleSendPasswordReset}
                 className="bg-orange-600 hover:bg-orange-700"
               >
                 <Mail className="mr-2 h-4 w-4" />
                 Send Reset Link
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Suspend User Confirmation Dialog */}
       <Dialog open={showSuspendUserDialog} onOpenChange={setShowSuspendUserDialog}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle className="flex items-center space-x-2">
               <AlertCircle className="h-5 w-5 text-red-500" />
               <span>Suspend User</span>
             </DialogTitle>
             <DialogDescription>
               Are you sure you want to suspend {selectedUser?.name}?
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                 <div className="text-sm text-red-800">
                   <p className="font-medium">User Suspension</p>
                   <p className="mt-1">
                     This will immediately suspend <strong>{selectedUser?.name}</strong> and prevent them from accessing the platform. 
                     They will not be able to log in until you reactivate their account.
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="flex justify-end space-x-2 pt-4">
               <Button 
                 variant="outline" 
                 onClick={() => setShowSuspendUserDialog(false)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={handleConfirmSuspendUser}
                 className="bg-red-600 hover:bg-red-700"
               >
                 <AlertCircle className="mr-2 h-4 w-4" />
                 Suspend User
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Delete User Confirmation Dialog */}
       <Dialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
         <DialogContent className="max-w-lg">
           <DialogHeader>
             <DialogTitle className="flex items-center space-x-2">
               <Trash2 className="h-5 w-5 text-red-500" />
               <span>Delete User</span>
             </DialogTitle>
             <DialogDescription>
               Are you sure you want to delete {selectedUser?.name}?
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4">
             <div className="bg-red-50 border border-red-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                 <div className="text-sm text-red-800">
                   <p className="font-medium">Permanent Deletion Warning</p>
                   <p className="mt-1">
                     This action will <strong>permanently delete</strong> <strong>{selectedUser?.name}</strong> and all their data. 
                     This action cannot be undone.
                   </p>
                 </div>
               </div>
             </div>

             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                 <div className="text-sm text-yellow-800">
                   <p className="font-medium">Consider Suspension Instead</p>
                   <p className="mt-1">
                     If you want to temporarily restrict access, consider suspending the user instead. 
                     Suspended users can be reactivated later.
                   </p>
                 </div>
               </div>
             </div>
             
             <div className="flex justify-end space-x-2 pt-4">
               <Button 
                 variant="outline" 
                 onClick={() => setShowDeleteUserDialog(false)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={handleDeleteAsSuspend}
                 className="bg-yellow-600 hover:bg-yellow-700"
               >
                 <AlertCircle className="mr-2 h-4 w-4" />
                 Suspend Instead
               </Button>
               <Button 
                 onClick={handleConfirmDeleteUser}
                 className="bg-red-600 hover:bg-red-700"
               >
                 <Trash2 className="mr-2 h-4 w-4" />
                 Delete Permanently
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Edit Tokens Dialog */}
       <Dialog open={showEditTokensDialog} onOpenChange={setShowEditTokensDialog}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle className="flex items-center space-x-2">
               <Target className="h-5 w-5 text-purple-500" />
               <span>Edit Token Settings</span>
             </DialogTitle>
             <DialogDescription>
               Manage token allocation and usage for {selectedUser?.name}
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="available">Available Tokens</Label>
                 <Input
                   id="available"
                   type="number"
                   value={tokenForm.available}
                   onChange={(e) => setTokenForm({...tokenForm, available: parseInt(e.target.value) || 0})}
                   placeholder="Enter available tokens"
                 />
                 <p className="text-xs text-gray-500 mt-1">Current tokens available for today</p>
               </div>
               <div>
                 <Label htmlFor="usedToday">Used Today</Label>
                 <Input
                   id="usedToday"
                   type="number"
                   value={tokenForm.usedToday}
                   onChange={(e) => setTokenForm({...tokenForm, usedToday: parseInt(e.target.value) || 0})}
                   placeholder="Enter tokens used today"
                 />
                 <p className="text-xs text-gray-500 mt-1">Tokens consumed today</p>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <Label htmlFor="totalUsed">Total Used (Lifetime)</Label>
                 <Input
                   id="totalUsed"
                   type="number"
                   value={tokenForm.totalUsed}
                   onChange={(e) => setTokenForm({...tokenForm, totalUsed: parseInt(e.target.value) || 0})}
                   placeholder="Enter total tokens used"
                 />
                 <p className="text-xs text-gray-500 mt-1">All-time token consumption</p>
               </div>
               <div>
                 <Label htmlFor="dailyLimit">Daily Limit</Label>
                 <Input
                   id="dailyLimit"
                   type="number"
                   value={tokenForm.dailyLimit}
                   onChange={(e) => setTokenForm({...tokenForm, dailyLimit: parseInt(e.target.value) || 0})}
                   placeholder="Enter daily token limit"
                 />
                 <p className="text-xs text-gray-500 mt-1">Maximum tokens per day</p>
               </div>
             </div>

             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <div className="flex items-start space-x-3">
                 <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                 <div className="text-sm text-blue-800">
                   <p className="font-medium">Token Management Tips</p>
                   <p className="mt-1">
                     • Available tokens should not exceed daily limit<br/>
                     • Used today + available should equal daily limit<br/>
                     • Total used tracks lifetime consumption<br/>
                     • Changes will take effect immediately
                   </p>
                 </div>
               </div>
             </div>

             <div className="flex justify-end space-x-2 pt-4">
               <Button 
                 variant="outline" 
                 onClick={() => setShowEditTokensDialog(false)}
               >
                 Cancel
               </Button>
               <Button 
                 onClick={handleUpdateTokens}
                 className="bg-gradient-to-r from-purple-600 to-blue-600"
               >
                 <Target className="mr-2 h-4 w-4" />
                 Update Tokens
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>
     </div>
   )
 }
