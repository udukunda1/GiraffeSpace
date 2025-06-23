"use client"

import { use, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Users as UsersIcon, Calendar, MapPin, Home } from "lucide-react"
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

interface EditUserProps {
  params: {
    id: string
  }
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function EditUser({ params }: EditUserProps) {
  const id = params.id;
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    isActive: true,
  })
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    // In a real app, this would be an API call
    const rawUser = users.find(u => u.userId === id) as RawUser | undefined
    
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
      setFormData({
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        email: safeUser.email,
        phone: safeUser.phone || '',
        role: safeUser.role.roleName,
        isActive: safeUser.isActive,
      })
    } else {
      setError("User not found")
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords if provided
    if (formData.newPassword || formData.confirmNewPassword) {
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }
    }

    try {
      // TODO: Implement user update logic
      // This is where you would make an API call to update the user
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      router.push(`/admin/users/${id}`)
    } catch (err) {
      setError("Failed to update user")
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
     
      <div className="flex flex-1">
     
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            {/* --- Edit User Content --- */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/users/${id}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to User Details
                  </Button>
                  <h2 className="text-2xl font-bold">Edit User</h2>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Edit User Information</CardTitle>
                  <CardDescription>
                    Update the user account details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      {/* Account Settings */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role">User Role</Label>
                          <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({ ...formData, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USER">User</SelectItem>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MANAGER">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="isActive">Account Status</Label>
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                          />
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            Leave password fields empty to keep the current password.
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password (Optional)</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={formData.newPassword || ''}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                          <Input
                            id="confirmNewPassword"
                            type="password"
                            value={formData.confirmNewPassword || ''}
                            onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/admin/users/${id}`)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 