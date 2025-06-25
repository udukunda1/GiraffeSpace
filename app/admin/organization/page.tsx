"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Users, Building2, MapPin, Link2, Search, Plus } from "lucide-react"
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
import { toast } from "sonner"
import ApiService from "@/api/apiConfig"

// Define TypeScript interfaces for better type safety
interface Organization {
  id: string;
  organizationId?: string;
  organizationName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  organizationType: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RawOrganization {
  id?: string;
  organizationName?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  organizationType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

function OrganizationForm({ initialData, onSubmit, loading, mode }: {
  initialData?: Partial<Organization>,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    organizationName: initialData?.organizationName || '',
    description: initialData?.description || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    address: initialData?.address || '',
    organizationType: initialData?.organizationType || '',
    status: initialData?.status || 'Active',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Debug: Log the form data being sent
    console.log("Organization form data:", form)
    
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input 
              id="organizationName" 
              name="organizationName" 
              value={form.organizationName} 
              onChange={handleChange} 
              placeholder="Enter organization name"
              required 
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Enter organization description"
              required 
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input 
              id="contactEmail" 
              name="contactEmail" 
              type="email" 
              value={form.contactEmail} 
              onChange={handleChange} 
              placeholder="Enter contact email"
              required 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input 
              id="contactPhone" 
              name="contactPhone" 
              type="tel" 
              value={form.contactPhone} 
              onChange={handleChange} 
              placeholder="Enter contact phone"
              required 
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              placeholder="Enter organization address"
              required 
            />
          </div>
          <div>
            <Label htmlFor="organizationType">Organization Type</Label>
            <Input 
              id="organizationType" 
              name="organizationType" 
              value={form.organizationType} 
              onChange={handleChange} 
              placeholder="Enter organization type (e.g., Event Management, Technology, etc.)"
              required 
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
            mode === 'add' ? 'Create Organization' : 'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminOrganization() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 5
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOrg, setEditOrg] = useState<Organization | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null)

  // Fetch organizations from database
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ApiService.getAllOrganization()
        console.log("API Response for getAllOrganization:", response)
        console.log("Organizations data:", response?.data)
        if (response && response.success) {
          console.log("First organization structure:", response.data?.[0])
          setOrganizations(response.data || [])
        } else {
          setOrganizations([])
          setError(response?.error || 'Failed to fetch organizations')
        }
      } catch (error) {
        setOrganizations([])
        setError('Failed to fetch organizations')
        console.error('Error fetching organizations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  // If organizations are not loaded, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading organizations...</div>
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

  // Ensure organizations data is properly typed and has default values
  const safeOrganizations: Organization[] = organizations.map((org, index) => ({
    id: org.organizationId || org.id || '',
    organizationName: org.organizationName || '',
    description: org.description || '',
    contactEmail: org.contactEmail || '',
    contactPhone: org.contactPhone || '',
    address: org.address || '',
    organizationType: org.organizationType || 'Event Management',
    status: org.status || 'Active',
    createdAt: org.createdAt || new Date().toISOString(),
    updatedAt: org.updatedAt || new Date().toISOString()
  }))

  // Calculate organization statistics with safe values
  const stats = {
    totalOrganizations: safeOrganizations.length,
    active: safeOrganizations.filter(o => o.status === "Active").length,
    inactive: safeOrganizations.filter(o => o.status === "Inactive").length,
    eventAssigned: safeOrganizations.filter(o => o.organizationType === "Event Management").length,
    venueAssigned: safeOrganizations.filter(o => o.organizationType === "Venue Management").length,
  }

  // Get unique types with safe handling
  const uniqueTypes = Array.from(new Set(safeOrganizations.map(org => org.organizationType)))

  // Filter organizations with safe string comparisons
  const filteredOrganizations = safeOrganizations.filter(org => {
    const searchString = searchQuery.toLowerCase()
    const matchesSearch = 
      (org.organizationName?.toLowerCase() || '').includes(searchString) ||
      (org.description?.toLowerCase() || '').includes(searchString) ||
      (org.contactEmail?.toLowerCase() || '').includes(searchString) ||
      (org.contactPhone?.toLowerCase() || '').includes(searchString) ||
      (org.address?.toLowerCase() || '').includes(searchString)
    
    const matchesType = filterType === "all" || org.organizationType === filterType
    const matchesStatus = filterStatus === "all" || org.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination with safe calculations
  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    try {
      setLoading(true)
      
      // Debug: Log the data being sent to API
      console.log("Data being sent to API:", data)
      
      const response = await ApiService.addOrganization(data)
      
      // Debug: Log the API response
      console.log("API Response suceess :", response)
      
      if (response && response.success) {
        // Refresh the organizations list
        const updatedResponse = await ApiService.getAllOrganization()
        if (updatedResponse && updatedResponse.success) {
          setOrganizations(updatedResponse.data || [])
        }
        setAddOpen(false)
        toast.success("Organization created successfully!")
      } else {
        const errorMessage = response?.error || 'Failed to create organization'
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } catch (error: any) {
      // Handle axios error response
      console.log("Caught error:", error)
      console.log("Error response data:", error.response?.data)
      
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to create organization"
        
        // Log the full error details
        console.log("Error data:", errorData)
        
        toast.error(errorMessage)
        setError(errorMessage)
      } else {
        const genericError = "Failed to create organization. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error creating organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      setLoading(true)
      if (!editOrg?.id) {
        setError('Organization ID is required for update')
        return
      }
      const response = await ApiService.updateOrganizationById(editOrg.id, data)
      if (response && response.success) {
        // Refresh the organizations list
        const updatedResponse = await ApiService.getAllOrganization()
        if (updatedResponse && updatedResponse.success) {
          setOrganizations(updatedResponse.data || [])
        }
        setEditOpen(null)
        setEditOrg(null)
      } else {
        setError(response?.error || 'Failed to update organization')
      }
    } catch (error) {
      setError('Failed to update organization')
      console.error('Error updating organization:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (orgId: string) => {
    try {
      if (!orgId || orgId === 'undefined' || orgId === 'null') {
        toast.error("Invalid organization ID");
        return;
      }
      
      setLoading(true)
      const response = await ApiService.deleteOrganization(orgId)
      if (response && response.success) {
        // Refresh the organizations list
        const updatedResponse = await ApiService.getAllOrganization()
        if (updatedResponse && updatedResponse.success) {
          setOrganizations(updatedResponse.data || [])
        }
        setDeleteOrgId(null)
        toast.success("Organization deleted successfully!")
      } else {
        const errorMessage = response?.error || 'Failed to delete organization'
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } catch (error: any) {
      // Handle axios error response
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to delete organization"
        toast.error(errorMessage)
        setError(errorMessage)
      } else {
        const genericError = "Failed to delete organization. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error deleting organization:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Organization Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Organization</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new organization.
                      </DialogDescription>
                    </DialogHeader>
                    <OrganizationForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Organizations</p>
                        <p className="text-2xl font-bold">{stats.totalOrganizations}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stats.active} Active • {stats.inactive} Inactive
                        </p>
                      </div>
                      <Building2 className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Event Organizations</p>
                        <p className="text-2xl font-bold">{stats.eventAssigned}</p>
                        <p className="text-sm text-gray-500 mt-1">Assigned to events</p>
                      </div>
                      <Link2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Venue Organizations</p>
                        <p className="text-2xl font-bold">{stats.venueAssigned}</p>
                        <p className="text-sm text-gray-500 mt-1">Assigned to venues</p>
                      </div>
                      <MapPin className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Inactive Organizations</p>
                        <p className="text-2xl font-bold">{stats.inactive}</p>
                        <p className="text-sm text-gray-500 mt-1">Currently inactive</p>
                      </div>
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Organizations Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Organizations</CardTitle>
                  <CardDescription>Manage organization accounts and assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search organizations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrganizations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No organizations found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedOrganizations.map(org => (
                            <TableRow key={org.id}>
                              <TableCell className="font-medium">{org.organizationName}</TableCell>
                              <TableCell>
                                <Badge variant={org.organizationType === "Event Management" ? "default" : "secondary"}>
                                  {org.organizationType}
                                </Badge>
                              </TableCell>
                              <TableCell>{org.contactEmail}</TableCell>
                              <TableCell>
                                <Badge variant={org.status === "Active" ? "default" : "outline"}>
                                  {org.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => router.push(`/admin/organization/${org.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => { setEditOrg(org); setEditOpen(org.id); }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="icon" 
                                        variant="destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Organization</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{org.organizationName}"? This action cannot be undone and will permanently remove the organization from the system.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(org.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete Organization
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
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

      {editOrg && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
            </DialogHeader>
            <OrganizationForm mode="edit" initialData={editOrg} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 