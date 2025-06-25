"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, Users, MapPin, Calendar, Mail, Phone, MapPinIcon, User, Eye, Edit, ArrowLeft } from "lucide-react"

import { toast } from "sonner"
import ApiService from "@/api/apiConfig"

interface User {
  userId: string
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  role: {
    roleId: string
    roleName: string
    description: string
  }
  createdAt: string
}

interface Venue {
  venueId: string
  venueName: string
  capacity: number
  amount: string
  location: string
  status: string
  createdAt: string
}

interface Event {
  eventId: string
  eventTitle: string
  description: string
  startDate: string
  endDate: string
  status: string
}

interface Organization {
  organizationId: string
  organizationName: string
  description: string
  contactEmail: string
  contactPhone: string | null
  address: string | null
  organizationType: string | null
  city: string | null
  country: string | null
  postalCode: string | null
  stateProvince: string | null
  createdAt: string
  updatedAt: string
  users: User[]
  venues: Venue[]
  events?: Event[]
}

export default function OrganizationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ApiService.getOrganizationById(id as string)
        
        if (response && response.success) {
          setOrganization(response.data)
        } else {
          setError(response?.error || 'Failed to fetch organization details')
          toast.error(response?.error || 'Failed to fetch organization details')
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch organization details'
        setError(errorMessage)
        toast.error(errorMessage)
        console.error('Error fetching organization:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrganization()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading organization details...</div>
      </div>
    )
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">{error || 'Organization not found'}</div>
          <Button onClick={() => router.push("/admin/organization")}>Back to Organizations</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => router.push("/admin/organization")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold">{organization.organizationName}</h1>
                    <p className="text-gray-600">Organization Details</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/admin/organization/${organization.organizationId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              {/* Organization Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Organization Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                     
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="font-medium">{organization.organizationName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-sm">{organization.description || 'No description available'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type</label>
                        <p className="text-sm">{organization.organizationType || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Email</label>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{organization.contactEmail}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{organization.contactPhone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">
                            {organization.address || 'Address not provided'}
                            {organization.city && `, ${organization.city}`}
                            {organization.stateProvince && `, ${organization.stateProvince}`}
                            {organization.postalCode && ` ${organization.postalCode}`}
                            {organization.country && `, ${organization.country}`}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created</label>
                        <p className="text-sm">{new Date(organization.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Users ({organization.users?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {organization.users && organization.users.length > 0 ? (
                    <div className="space-y-4">
                      {organization.users.map((user) => (
                        <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-600">@{user.username}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{user.role.roleName}</Badge>
                           
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No users found for this organization</p>
                  )}
                </CardContent>
              </Card>

              {/* Venues Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Venues ({organization.venues?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {organization.venues && organization.venues.length > 0 ? (
                    <div className="space-y-4">
                      {organization.venues.map((venue) => (
                        <div key={venue.venueId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{venue.venueName}</p>
                              <p className="text-sm text-gray-600">{venue.location}</p>
                              <p className="text-sm text-gray-500">Capacity: {venue.capacity} people</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={venue.status === 'ACTIVE' ? 'default' : 'secondary'}
                            >
                              {venue.status}
                            </Badge>
                           
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No venues found for this organization</p>
                  )}
                </CardContent>
              </Card>

              {/* Events Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Events ({organization.events?.length || 0})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {organization.events && organization.events.length > 0 ? (
                    <div className="space-y-4">
                      {organization.events.map((event) => (
                        <div key={event.eventId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{event.eventTitle}</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={event.status === 'ACTIVE' ? 'default' : 'secondary'}
                            >
                              {event.status}
                            </Badge>
                           
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No events found for this organization</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 