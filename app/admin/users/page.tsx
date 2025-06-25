"use client"

import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import ApiService from "@/api/apiConfig"

// Define TypeScript interfaces for better type safety
interface UserRole {
  roleName: string;
  permissions?: string[];
}

interface User {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles: UserRole;
  isActive: boolean;
  createdAt: string;
}

interface RawUser {
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roles?: {
    roleName?: string;
    permissions?: string[];
  };
  isActive?: boolean;
  createdAt?: string;
}

function UserForm({ initialData, onSubmit, loading, mode }: {
  initialData?: Partial<User>,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    username: initialData?.username || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phoneNumber || '',
    role: initialData?.roles?.roleName || '',
    isActive: initialData?.isActive ?? true,
  })
  const [error, setError] = useState<string | null>(null)
 

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Debug: Log the raw form data
    console.log("Raw form data:", form)
    
    // Client-side validation: Check if username or email already exists
    const existingUser = users.find(user => 
      user.username === form.username || user.email === form.email
    )
    
    if (existingUser) {
      if (existingUser.username === form.username) {
        setError("Username already exists. Please choose a different username.")
        toast.error("Username already exists. Please choose a different username.")
        return
      }
      if (existingUser.email === form.email) {
        setError("Email already exists. Please use a different email address.")
        toast.error("Email already exists. Please use a different email address.")
        return
      }
    }
    
    // Map form data to match API expectations
    const apiData = {
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phone,
      roles: [form.role], // Send as array of role names
      isActive: form.isActive,
      password: "DefaultPassword123!", // Add default password for API
    }
    
    // Debug: Log the mapped API data
    console.log("Mapped API data:", apiData)
    
    onSubmit(apiData)
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">User Role</Label>
            <Select value={form.role} onValueChange={val => setForm(f => ({ ...f, role: val }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="GUEST">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Account Status</Label>
            <Switch id="isActive" checked={form.isActive} onCheckedChange={val => setForm(f => ({ ...f, isActive: val }))} />
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'add' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            mode === 'add' ? 'Create User' : 'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminUsers() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 5
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const [users, setUsers] = useState<User[]>([])
  
  // fetch all users from database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ApiService.getAllUser()
        if (response && response.users) {
          setUsers(response.users)
        } else {
          setUsers([])
        }
      } catch (error) {
        setUsers([])
        setError('Failed to fetch users')
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // If users are not loaded, show loading state
  if (loading) {  
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Ensure users data is properly typed and has default values
  const safeUsers: User[] = users.map(user => ({
    userId: user.userId || 'unknown',
    username: user.username || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    roles: {
      roleName: user.roles?.roleName || 'USER',
      permissions: user.roles?.permissions || []
    },
    isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
    createdAt: user.createdAt || new Date().toISOString()
  }))

  // Calculate user statistics with safe values
  const stats = {
    totalUsers: safeUsers.length,
    adminUsers: safeUsers.filter(user => user.roles.roleName === "ADMIN").length,
    activeUsers: safeUsers.filter(user => user.isActive).length,
    newUsersThisMonth: safeUsers.filter(user => {
      const userCreatedDate = new Date(user.createdAt)
      const now = new Date()
      return userCreatedDate.getMonth() === now.getMonth() && 
             userCreatedDate.getFullYear() === now.getFullYear()
    }).length,
  }

  // Get unique roles with safe handling
  const uniqueRoles = Array.from(new Set(safeUsers.map(user => user.roles.roleName)))

  // Filter users with safe string comparisons
  const filteredUsers = safeUsers.filter(user => {
    const searchString = searchQuery.toLowerCase()
    const matchesSearch = 
      (user.firstName?.toLowerCase() || '').includes(searchString) ||
      (user.lastName?.toLowerCase() || '').includes(searchString) ||
      (user.email?.toLowerCase() || '').includes(searchString)
    
    const matchesRole = filterRole === "all" || user.roles.roleName === filterRole
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

  const handleAdd = async (data: any) => {
    try {
      setLoading(true)
      
      // Debug: Log the data being sent to API
      console.log("Data being sent to API:", data)
      
      // Call API to create user
      const response = await ApiService.registerUser(data)
      
      // Debug: Log the API response
      console.log("API Response:", response)
      
      if (response && response.success) {
        // Refresh the users list
        const updatedResponse = await ApiService.getAllUser()
        if (updatedResponse && updatedResponse.users) {
          setUsers(updatedResponse.users)
        }
        setAddOpen(false)
        toast.success("User created successfully!")
      } else {
        // Handle specific error messages from the server
        const errorMessage = response?.message || "Failed to create user"
        console.log("Error response:", response)
        
        if ((response as any)?.results && (response as any).results.length > 0) {
          // Show the first validation error
          const firstError = (response as any).results[0]
          console.log("First validation error:", firstError)
          const specificError = firstError.message || errorMessage
          toast.error(specificError)
          // Also set the error in the form for display
          setError(specificError)
        } else {
          toast.error(errorMessage)
          setError(errorMessage)
        }
      }
    } catch (error: any) {
      // Handle axios error response
      console.log("Caught error:", error)
      console.log("Error response data:", error.response?.data)
      
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to create user"
        
        // Log the full error details
        console.log("Error data:", errorData)
        console.log("Error results:", errorData.results)
        
        if (errorData.results && errorData.results.length > 0) {
          // Show the first validation error
          const firstError = errorData.results[0]
          console.log("First validation error from catch:", firstError)
          const specificError = firstError.message || errorMessage
          toast.error(specificError)
          // Also set the error in the form for display
          setError(specificError)
        } else {
          toast.error(errorMessage)
          setError(errorMessage)
        }
      } else {
        const genericError = "Failed to create user. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error creating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      setLoading(true)
      // Call API to update user
      if (!editUser?.userId) {
        setError('User ID is required for update')
        return
      }
      const response = await ApiService.updateUserById(editUser.userId, data)
      if (response && response.success) {
        // Refresh the users list
        const updatedResponse = await ApiService.getAllUser()
        if (updatedResponse && updatedResponse.users) {
          setUsers(updatedResponse.users)
        }
        setEditOpen(null)
        setEditUser(null)
      } else {
        setError('Failed to update user')
      }
    } catch (error) {
      setError('Failed to update user')
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      setLoading(true)
      const response = await ApiService.deleteUser(userId)
      if (response && response.success) {
        // Refresh the users list
        const updatedResponse = await ApiService.getAllUser()
        if (updatedResponse && updatedResponse.users) {
          setUsers(updatedResponse.users)
        }
        toast.success("User deleted successfully!")
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      toast.error("Failed to delete user")
      console.error('Error deleting user:', error)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setDeleteUser(null)
    }
  }

  const openDeleteDialog = (user: User) => {
    setDeleteUser(user)
    setDeleteDialogOpen(true)
  }

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
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new user account.
                      </DialogDescription>
                    </DialogHeader>
                    <UserForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
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
                                <Badge variant={user.roles.roleName === "ADMIN" ? "default" : "secondary"}>
                                  {user.roles.roleName}
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
                                  <Button size="icon" variant="outline" onClick={() => { setEditUser(user); setEditOpen(user.userId); }}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog open={deleteDialogOpen && deleteUser?.userId === user.userId} onOpenChange={setDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                      <Button size="icon" variant="destructive" onClick={() => openDeleteDialog(user)}>
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the user{" "}
                                          <span className="font-semibold">{deleteUser?.firstName} {deleteUser?.lastName}</span>{" "}
                                          and remove their data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteUser && handleDelete(deleteUser.userId)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete User
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
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
     
      {editUser && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm mode="edit" initialData={editUser} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 