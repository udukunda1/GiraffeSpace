"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Layers, CheckCircle, XCircle, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
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
interface EventResource {
  id: string;
  eventId: string;
  resourceId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface Resource {
  resourceId: string;
  resourceName: string;
  description: string;
  costPerUnit: number;
  eventResources: EventResource[];
}

function ResourceForm({ initialData, onSubmit, loading, mode }: {
  initialData?: Partial<Resource>,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    resourceName: initialData?.resourceName || '',
    description: initialData?.description || '',
    costPerUnit: initialData?.costPerUnit || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate required fields
    if (!form.resourceName || !form.description || !form.costPerUnit) {
      setError('All fields are required')
      return
    }

    // Convert to proper types
    const submitData = {
      resourceName: form.resourceName,
      description: form.description,
      costPerUnit: parseFloat(form.costPerUnit.toString()),
    }
    
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="resourceName">Resource Name</Label>
          <Input 
            id="resourceName" 
            name="resourceName" 
            value={form.resourceName} 
            onChange={handleChange} 
            placeholder="Enter resource name"
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
            placeholder="Enter resource description"
            required 
          />
        </div>
        <div>
          <Label htmlFor="costPerUnit">Cost Per Unit</Label>
          <Input 
            id="costPerUnit" 
            name="costPerUnit" 
            type="number" 
            step="0.01"
            min="0"
            value={form.costPerUnit} 
            onChange={handleChange} 
            placeholder="Enter cost per unit"
            required 
          />
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
            mode === 'add' ? 'Create Resource' : 'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminResource() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 10
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editResource, setEditResource] = useState<Resource | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resources, setResources] = useState<Resource[]>([])

  // Fetch resources from database
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ApiService.getAllResource()
        console.log('Fetched resources:', response)
        
        if (Array.isArray(response)) {
          // API returns array of resources directly
          setResources(response)
        } else {
          setResources([])
          setError('Failed to fetch resources')
        }
      } catch (error) {
        setResources([])
        setError('Failed to fetch resources')
        console.error('Error fetching resources:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  // If resources are not loaded, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading resources...</div>
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

  // Ensure resources data is properly typed and has default values
  const safeResources: Resource[] = resources.map((resource, index) => ({
    resourceId: resource.resourceId || `temp-${index}-${Date.now()}`,
    resourceName: resource.resourceName || '',
    description: resource.description || '',
    costPerUnit: resource.costPerUnit || 0,
    eventResources: resource.eventResources || []
  }))

  // Calculate resource statistics
  const stats = {
    totalResources: safeResources.length,
    totalValue: safeResources.reduce((sum, resource) => sum + resource.costPerUnit, 0),
    averageCost: safeResources.length > 0 ? safeResources.reduce((sum, resource) => sum + resource.costPerUnit, 0) / safeResources.length : 0,
  }

  // Filter resources
  const filteredResources = safeResources.filter(resource => {
    const searchString = searchQuery.toLowerCase()
    const matchesSearch = 
      (resource.resourceName?.toLowerCase() || '').includes(searchString) ||
      (resource.description?.toLowerCase() || '').includes(searchString)
    
    return matchesSearch
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    try {
      setLoading(true)
      
      const response = await ApiService.addResource(data)
      
      if (response && response.success) {
        // Refresh the resources list
        const updatedResponse = await ApiService.getAllResource()
        if (Array.isArray(updatedResponse)) {
          setResources(updatedResponse)
        }
        setAddOpen(false)
        toast.success("Resource created successfully!")
      } else {
        const errorMessage = response?.error || 'Failed to create resource'
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to create resource"
        toast.error(errorMessage)
        setError(errorMessage)
      } else {
        const genericError = "Failed to create resource. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error creating resource:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      setLoading(true)
      if (!editResource?.resourceId) {
        setError('Resource ID is required for update')
        return
      }
      const response = await ApiService.updateResourceById(editResource.resourceId, data)
      if (response && response.success) {
        // Refresh the resources list
        const updatedResponse = await ApiService.getAllResource()
        if (Array.isArray(updatedResponse)) {
          setResources(updatedResponse)
        }
        setEditOpen(null)
        setEditResource(null)
        toast.success("Resource updated successfully!")
      } else {
        const errorMessage = response?.error || 'Failed to update resource'
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to update resource"
        toast.error(errorMessage)
        setError(errorMessage)
      } else {
        const genericError = "Failed to update resource. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error updating resource:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resourceId: string) => {
    try {
      if (!resourceId || resourceId === 'undefined' || resourceId === 'null') {
        toast.error("Invalid resource ID");
        return;
      }
      
      setLoading(true)
      const response = await ApiService.deleteResource(resourceId)
      if (response && response.success) {
        // Refresh the resources list
        const updatedResponse = await ApiService.getAllResource()
        if (Array.isArray(updatedResponse)) {
          setResources(updatedResponse)
        }
        toast.success("Resource deleted successfully!")
      } else {
        const errorMessage = response?.error || 'Failed to delete resource'
        toast.error(errorMessage)
        setError(errorMessage)
      }
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data
        const errorMessage = errorData.message || "Failed to delete resource"
        toast.error(errorMessage)
        setError(errorMessage)
      } else {
        const genericError = "Failed to delete resource. Please try again."
        toast.error(genericError)
        setError(genericError)
      }
      console.error('Error deleting resource:', error)
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
                <h2 className="text-2xl font-bold">Resource Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Resource
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Resource</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new resource.
                      </DialogDescription>
                    </DialogHeader>
                    <ResourceForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Resources</p>
                        <p className="text-2xl font-bold">{stats.totalResources}</p>
                      </div>
                      <Layers className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Cost</p>
                        <p className="text-2xl font-bold">${stats.averageCost.toFixed(2)}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resources Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Resources</CardTitle>
                  <CardDescription>Manage resource inventory and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search resources..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resource Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Cost Per Unit</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedResources.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No resources found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedResources.map(resource => (
                            <TableRow key={resource.resourceId}>
                              <TableCell className="font-medium">{resource.resourceName}</TableCell>
                              <TableCell>{resource.description}</TableCell>
                              <TableCell>${resource.costPerUnit.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => router.push(`/admin/resource/${resource.resourceId}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => { setEditResource(resource); setEditOpen(resource.resourceId); }}
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
                                        <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{resource.resourceName}"? This action cannot be undone and will permanently remove the resource from the system.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(resource.resourceId)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete Resource
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResources.length)} of {filteredResources.length} resources
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

      {editResource && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription>
                Update the resource details.
              </DialogDescription>
            </DialogHeader>
            <ResourceForm mode="edit" initialData={editResource} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 