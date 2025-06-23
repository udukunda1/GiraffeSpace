"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Activity,
  Clock,
  MapPin,
  Users as UsersIcon,
  Home,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { users } from "@/data/users"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface UserRole {
  roleName: string;
  permissions?: string[];
}

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface RawUser {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: {
    roleName?: string;
    permissions?: string[];
  };
  isActive?: boolean;
  createdAt?: string;
}

interface UserDetailsProps {
  params: {
    id: string
  }
}

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export default function UserDetails({ params }: UserDetailsProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "users", label: "Users", icon: UsersIcon, href: "/admin/users" },
  ]

  useEffect(() => {
    // In a real app, this would be an API call
    const rawUser = users.find(u => u.userId === params.id) as RawUser | undefined
    
    if (rawUser) {
      const safeUser: User = {
        userId: rawUser.userId || 'unknown',
        firstName: rawUser.firstName || '',
        lastName: rawUser.lastName || '',
        email: rawUser.email || '',
        phone: rawUser.phone || '',
        role: {
          roleName: rawUser.role?.roleName || 'USER',
          permissions: rawUser.role?.permissions || []
        },
        isActive: typeof rawUser.isActive === 'boolean' ? rawUser.isActive : true,
        createdAt: rawUser.createdAt || new Date().toISOString()
      }
      setUser(safeUser)
    }
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    )
  }

  // Mock activity data (in a real app, this would come from the backend)
  const recentActivity: ActivityItem[] = [
    {
      id: 1,
      type: "login",
      description: "Logged in successfully",
      timestamp: "2024-03-20T10:30:00",
    },
    {
      id: 2,
      type: "profile_update",
      description: "Updated profile information",
      timestamp: "2024-03-19T15:45:00",
    },
    {
      id: 3,
      type: "event_registration",
      description: "Registered for Tech Conference 2024",
      timestamp: "2024-03-18T09:15:00",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="admin" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <UsersIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.id === "users"
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            {/* --- User Details Content --- */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/admin/users")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                  </Button>
                  <h2 className="text-2xl font-bold">User Details</h2>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/users/${params.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Profile Card */}
                <Card className="md:col-span-1">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-4">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                      <h3 className="text-xl font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge className="mt-2" variant={user.role.roleName === "ADMIN" ? "default" : "secondary"}>
                        {user.role.roleName}
                      </Badge>
                      <div className="mt-4 space-y-2 w-full">
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone || "Not provided"}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Information</CardTitle>
                          <CardDescription>Detailed information about the user account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Account Status</p>
                              <Badge variant={user.isActive ? "success" : "destructive"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last Login</p>
                              <p>2 hours ago</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Account Type</p>
                              <p>{user.role.roleName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Member Since</p>
                              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="activity" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                          <CardDescription>User's recent actions and events.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {recentActivity.map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex items-center space-x-4">
                                  <Activity className="h-5 w-5 text-blue-500" />
                                  <div>
                                    <p className="font-medium">{activity.description}</p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Settings</CardTitle>
                          <CardDescription>Manage user account settings and permissions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                              </div>
                              <Button variant="outline">Enable</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-gray-500">Manage email preferences</p>
                              </div>
                              <Button variant="outline">Configure</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 