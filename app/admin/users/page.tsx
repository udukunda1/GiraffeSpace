"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, UserX, Users, Mail, Shield, Search, UserCheck, UserPlus, Calendar, MapPin, Home } from "lucide-react"
import { users } from "@/data/users"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Define TypeScript interfaces for better type safety
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

export default function AdminUsers() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  ]

  // Ensure users data is properly typed and has default values
  const safeUsers: User[] = (users as RawUser[]).map(user => ({
    userId: user.userId || 'unknown',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    role: {
      roleName: user.role?.roleName || 'USER',
      permissions: user.role?.permissions || []
    },
    isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
    createdAt: user.createdAt || new Date().toISOString()
  }))

  // Calculate user statistics with safe values
  const stats = {
    totalUsers: safeUsers.length,
    adminUsers: safeUsers.filter(user => user.role.roleName === "ADMIN").length,
    activeUsers: safeUsers.filter(user => user.isActive).length,
    newUsersThisMonth: safeUsers.filter(user => {
      const userCreatedDate = new Date(user.createdAt)
      const now = new Date()
      return userCreatedDate.getMonth() === now.getMonth() && 
             userCreatedDate.getFullYear() === now.getFullYear()
    }).length,
  }

  // Get unique roles with safe handling
  const uniqueRoles = Array.from(new Set(safeUsers.map(user => user.role.roleName)))

  // Filter users with safe string comparisons
  const filteredUsers = safeUsers.filter(user => {
    const searchString = searchQuery.toLowerCase()
    const matchesSearch = 
      (user.firstName?.toLowerCase() || '').includes(searchString) ||
      (user.lastName?.toLowerCase() || '').includes(searchString) ||
      (user.email?.toLowerCase() || '').includes(searchString)
    
    const matchesRole = filterRole === "all" || user.role.roleName === filterRole
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination with safe calculations
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex flex-1">
       
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            {/* --- Main Users Content --- */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Button onClick={() => router.push("/admin/users/create")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stats.activeUsers} Active Users
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Admin Users</p>
                        <p className="text-2xl font-bold">{stats.adminUsers}</p>
                        <p className="text-sm text-gray-500 mt-1">With admin privileges</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold">{stats.activeUsers}</p>
                        <p className="text-sm text-gray-500 mt-1">Currently active</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">New Users</p>
                        <p className="text-2xl font-bold">{stats.newUsersThisMonth}</p>
                        <p className="text-sm text-gray-500 mt-1">This month</p>
                      </div>
                      <UserX className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search users..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {uniqueRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedUsers.map((user) => (
                            <TableRow key={user.userId}>
                              <TableCell>{user.firstName} {user.lastName}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  {user.email || 'No email'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.role.roleName === "ADMIN" ? "default" : "secondary"}>
                                  {user.role.roleName}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.isActive ? "default" : "outline"}>
                                  {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex space-x-2">
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/users/${user.userId}`)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/users/${user.userId}/edit`)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="destructive" onClick={() => { /* TODO: Implement delete functionality */ }}>
                                    <UserX className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  )
} 