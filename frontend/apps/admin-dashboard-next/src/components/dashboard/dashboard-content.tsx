"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const metrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    description: "Active users this month",
  },
  {
    title: "Registered Bars",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive",
    icon: Building2,
    description: "Partner establishments",
  },
  {
    title: "Events Created",
    value: "456",
    change: "+23.1%",
    changeType: "positive",
    icon: Calendar,
    description: "This month's events",
  },
  {
    title: "Revenue",
    value: "$45,231",
    change: "+18.3%",
    changeType: "positive",
    icon: DollarSign,
    description: "Monthly revenue",
  },
]

const chartData = [
  { name: "Jan", users: 400, events: 240, revenue: 2400 },
  { name: "Feb", users: 300, events: 139, revenue: 2210 },
  { name: "Mar", users: 200, events: 980, revenue: 2290 },
  { name: "Apr", users: 278, events: 390, revenue: 2000 },
  { name: "May", users: 189, events: 480, revenue: 2181 },
  { name: "Jun", users: 239, events: 380, revenue: 2500 },
  { name: "Jul", users: 349, events: 430, revenue: 2100 },
]

const pieData = [
  { name: "Active Users", value: 400, color: "#3b82f6" },
  { name: "Inactive Users", value: 300, color: "#6b7280" },
  { name: "New Users", value: 200, color: "#10b981" },
]

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "registered a new bar",
    target: "The Blue Moon",
    time: "2 minutes ago",
    avatar: "/avatars/01.png",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "created an event",
    target: "Summer Music Festival",
    time: "5 minutes ago",
    avatar: "/avatars/02.png",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "updated bar information",
    target: "Downtown Pub",
    time: "10 minutes ago",
    avatar: "/avatars/03.png",
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "joined the platform",
    target: "",
    time: "15 minutes ago",
    avatar: "/avatars/04.png",
  },
]

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {metric.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={metric.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {metric.change}
                </span>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Platform activity over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <Tooltip />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="events" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>
              Current user status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions from your platform users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback>
                    {activity.user.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                    {activity.target && (
                      <>
                        {" "}
                        <span className="font-semibold">{activity.target}</span>
                      </>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="secondary">New</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              View all activity
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
