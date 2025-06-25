"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, Package, Clock, Users } from "lucide-react"
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

interface Organization {
  organizationId: string;
  organizationName: string;
  description: string;
  contactEmail: string;
  contactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  stateProvince?: string | null;
  organizationType?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

interface UseUserOrganizationsReturn {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserOrganizations = (userId?: string): UseUserOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserOrganizations = async () => {
    if (!userId) {
      setOrganizations([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await ApiService.getUserById(userId)
      if (response && response.success && response.user && Array.isArray(response.user.organizations)) {
        setOrganizations(response.user.organizations)
      } else {
        setOrganizations([])
        setError('No organizations found for this user.')
      }
    } catch (error) {
      setOrganizations([])
      setError('Failed to fetch user organizations')
      console.error('Error fetching user organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserOrganizations()
  }, [userId])

  const refetch = async () => {
    await fetchUserOrganizations()
  }

  return {
    organizations,
    loading,
    error,
    refetch
  }
}

export default function ResourceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch resource details
  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!id || typeof id !== 'string') {
          setError('Invalid resource ID')
          return
        }

        const response = await ApiService.getResourceById(id)
        
        if (response) {
          setResource(response)
        } else {
          setError(response?.error || 'Failed to fetch resource details')
        }
      } catch (error) {
        setError('Failed to fetch resource details')
        console.error('Error fetching resource:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [id])

  const handleDelete = async () => {
    try {
      if (!resource?.resourceId) {
        toast.error("Invalid resource ID")
        return
      }
      
      setLoading(true)
      const response = await ApiService.deleteResource(resource.resourceId)
      
      if (response && response.success) {
        toast.success("Resource deleted successfully!")
        router.push("/admin/resource")
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading resource details...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error}</div>
          <div className="space-x-2">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" onClick={() => router.push("/admin/resource")}>
              Back to Resources
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No resource found
  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Resource not found</div>
          <Button variant="outline" onClick={() => router.push("/admin/resource")}>
            Back to Resources
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEventResourceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen flex  flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8 i">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.push("/admin/resource")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">{resource.resourceName}</h1>
                    <p className="text-gray-600">Resource Details</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Resource
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="flex items-center justify-center ">
                {/* Main Resource Information */}
                <div className="md:col-span-2 space-y-6 flex-1">
                  {/* Basic Information and Cost Information Combined */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Resource Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Resource Name</label>
                            <p className="text-lg font-semibold">{resource.resourceName}</p>
                          </div>
                          
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Description</label>
                          <p className="text-gray-900 mt-1">{resource.description}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Cost Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <DollarSign className="h-5 w-5 mr-2" />
                          Cost Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Cost Per Unit</label>
                            <p className="text-2xl font-bold text-gray-600">
                              ${resource.costPerUnit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Event Usage ({resource.eventResources.length})
                      </CardTitle>
                      <CardDescription>
                        Events where this resource is being used
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {resource.eventResources.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>This resource is not currently being used in any events</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {resource.eventResources.map((eventResource, index) => (
                            <div key={eventResource.id || index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">Event {eventResource.eventId}</span>
                                </div>
                                <Badge className={getEventResourceStatusColor(eventResource.status)}>
                                  {eventResource.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Quantity:</span>
                                  <span className="ml-1 font-medium">{eventResource.quantity}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Start:</span>
                                  <span className="ml-1">{formatDate(eventResource.startDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">End:</span>
                                  <span className="ml-1">{formatDate(eventResource.endDate)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total Cost:</span>
                                  <span className="ml-1 font-medium">
                                    ${(resource.costPerUnit * eventResource.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 