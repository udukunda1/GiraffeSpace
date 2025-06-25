"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Clock, 
  DollarSign,
  Navigation,
  Wifi,
  Car,
  Star,
  Edit,
  Trash2,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle
} from "lucide-react"
import ApiService from "@/api/apiConfig"
import { toast } from "sonner"
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

interface Venue {
  venueId: string;
  venueName: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  venueType: string;
  capacity: number;
  amount: number;
  isAvailable: boolean;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  websiteURL?: string;
  imageSrc?: string;
  googleMapsLink?: string;
  amenities?: string;
  status?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  resources?: Array<{
    resourceName: string;
    description: string;
    costPerUnit: number;
    quantity: number;
  }>;
}

export default function VenueDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await ApiService.getVenueById(id as string)
        if (response.success) {
          setVenue(response.data)
          toast.success('Venue details loaded successfully')
        } else {
          const errorMessage = response?.message || 'Failed to load venue details'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Failed to load venue details'
        setError(errorMessage)
        toast.error(errorMessage)
        console.error('Error fetching venue:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVenue()
  }, [id])

  const handleDelete = async () => {
    if (!venue?.venueId) return
    
    try {
      setLoading(true)
      const response = await ApiService.deleteVenue(venue.venueId)
      if (response.success) {
        toast.success('Venue deleted successfully')
        router.push('/admin/venues')
      } else {
        const errorMessage = response?.message || 'Failed to delete venue'
        toast.error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete venue'
      toast.error(errorMessage)
      console.error('Error deleting venue:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue details...</p>
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Venue</h2>
          <p className="text-gray-600 mb-4">{error || 'Venue not found'}</p>
          <Button onClick={() => router.push('/admin/venues')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/venues')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{venue.venueName}</h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {venue.location}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button onClick={() => router.push(`/admin/venues/${venue.venueId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Venue
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{venue.venueName}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete Venue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Venue Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Venue Type</label>
                  <p className="text-lg font-semibold">{venue.venueType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge variant={venue.isAvailable ? "default" : "secondary"}>
                      {venue.isAvailable ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Approval
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Capacity</label>
                  <p className="text-lg font-semibold flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {venue.capacity.toLocaleString()} people
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg font-semibold flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {venue.amount.toLocaleString()} RWF
                  </p>
                </div>
              </div>
              
              {venue.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-gray-700 mt-1">{venue.description}</p>
                </div>
              )}

              {/* Amenities */}
              {venue.amenities && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.split(',').map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center">
                        {amenity.trim().toLowerCase().includes('wifi') && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity.trim().toLowerCase().includes('parking') && <Car className="h-3 w-3 mr-1" />}
                        {amenity.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {venue.resources && venue.resources.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 mb-3 block">Available Resources</label>
                  <div className="space-y-3">
                    {venue.resources.map((resource, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{resource.resourceName}</p>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{resource.quantity} units</p>
                          <p className="text-sm text-gray-600">{resource.costPerUnit} RWF each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <Separator />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Organization ID</span>
                  <p className="font-mono">{venue.organizationId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Created</span>
                  <p>{venue.createdAt ? new Date(venue.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Updated</span>
                  <p>{venue.updatedAt ? new Date(venue.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Contact & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Details */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Location Details</label>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Address</span>
                    <p className="text-gray-700">{venue.location}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Latitude</span>
                      <p className="text-gray-700">{venue.latitude}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Longitude</span>
                      <p className="text-gray-700">{venue.longitude}</p>
                    </div>
                  </div>
                  
                  {venue.googleMapsLink && (
                    <div>
                      <span className="text-sm text-gray-500">Google Maps</span>
                      <a 
                        href={venue.googleMapsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Contact Information</label>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Contact Person</span>
                    <p className="text-gray-700">{venue.contactPerson}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <a 
                      href={`mailto:${venue.contactEmail}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {venue.contactEmail}
                    </a>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <a 
                      href={`tel:${venue.contactPhone}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {venue.contactPhone}
                    </a>
                  </div>
                  
                  {venue.websiteURL && (
                    <div>
                      <span className="text-sm text-gray-500">Website</span>
                      <a 
                        href={venue.websiteURL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-500 mb-3 block">Quick Actions</label>
                <div className="space-y-2">
                  <Button 
                    onClick={() => router.push(`/admin/venues/${venue.venueId}/edit`)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Venue
                  </Button>
                  
                  {venue.googleMapsLink && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(venue.googleMapsLink, '_blank')}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  )}
                  
                  {venue.websiteURL && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(venue.websiteURL, '_blank')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 