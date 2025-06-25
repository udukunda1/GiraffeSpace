"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, CheckCircle, Trash2, MapPin, Calendar, Building2, Clock, Search, Home, UsersIcon, Plus } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import ApiService from "@/api/apiConfig"
import ImageUpload from "@/app/manage/venues/create/uploadImage"
import { cn } from "@/lib/utils"
import { useUserOrganizations } from "@/hooks/useUserOrganizations"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { toast } from "sonner"

// Define TypeScript interfaces for better type safety
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
    resource: {
      resourceName: string;
      description: string;
      costPerUnit: number;
    };
    quantity: number;
  }>;
}

interface RawVenue {
  venueId?: string;
  venueName?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  venueType?: string;
  capacity?: number;
  amount?: number;
  isAvailable?: boolean;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteURL?: string;
  imageSrc?: string;
  googleMapsLink?: string;
  amenities?: string;
  status?: string;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  resources?: Array<{
    resource: {
      resourceName: string;
      description: string;
      costPerUnit: number;
    };
    quantity: number;
  }>;
}

// Interface for decoded JWT token
interface DecodedToken extends JwtPayload {
  userId?: string;
  role?: string;
  email?: string;
}

// Utility function to get userId from JWT token
const getUserIdFromToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.userId || null;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

function VenueForm({ initialData, onSubmit, loading, mode }: {
  initialData?: Partial<Venue>,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Get current user ID from JWT token
  const currentUserId = getUserIdFromToken()
  const { organizations, loading: orgLoading } = useUserOrganizations(currentUserId || undefined)

  const [form, setForm] = useState({
    venueName: initialData?.venueName || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    latitude: initialData?.latitude?.toString() || '',
    longitude: initialData?.longitude?.toString() || '',
    capacity: initialData?.capacity ? String(initialData.capacity) : '',
    amount: initialData?.amount ? String(initialData.amount) : '',
    venueType: initialData?.venueType || '',
    contactPerson: initialData?.contactPerson || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
    websiteURL: initialData?.websiteURL || '',
    imageSrc: initialData?.imageSrc || '',
    googleMapsLink: initialData?.googleMapsLink || '',
    amenities: initialData?.amenities || '',
    status: initialData?.status || 'PENDING',
    isAvailable: initialData?.isAvailable ?? true,
    organizationId: initialData?.organizationId || '',
  })

  const [resourceForm, setResourceForm] = useState({
    resourceName: "",
    description: "",
    costPerUnit: "",
    quantity: ""
  })

  const [resources, setResources] = useState<Array<{
    resource: {
      resourceName: string;
      description: string;
      costPerUnit: number;
    };
    quantity: number;
  }>>(initialData?.resources || [])

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddResource = () => {
    if (!resourceForm.resourceName || !resourceForm.quantity) return
    setResources(prev => [
      ...prev,
      {
        resource: {
          resourceName: resourceForm.resourceName,
          description: resourceForm.description,
          costPerUnit: parseFloat(resourceForm.costPerUnit) || 0,
        },
        quantity: parseInt(resourceForm.quantity, 10) || 1,
      },
    ])
    setResourceForm({ resourceName: "", description: "", costPerUnit: "", quantity: "" })
  }

  const handleRemoveResource = (idx: number) => {
    setResources(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
      return
    }
    
    setError(null)
    
    // Validate required fields before submission
    if (!form.venueName || !form.capacity || !form.location || !form.amount) {
      const errorMessage = 'Please fill in all required fields'
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }
    
    // Validate latitude and longitude
    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (isNaN(lat) || lat < -90 || lat > 90) {
      const errorMessage = 'Invalid latitude. Must be a number between -90 and 90.'
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      const errorMessage = 'Invalid longitude. Must be a number between -180 and 180.'
      setError(errorMessage)
      toast.error(errorMessage)
      return
    }
    
    // Transform resources to match API format
    const transformedResources = resources.map(item => ({
      resourceName: item.resource.resourceName,
      description: item.resource.description,
      costPerUnit: item.resource.costPerUnit,
      quantity: item.quantity
    }))
    
    const payload = {
      ...form,
      capacity: parseInt(form.capacity, 10) || 0,
      amount: parseFloat(form.amount) || 0,
      latitude: parseFloat(form.latitude) || 0,
      longitude: parseFloat(form.longitude) || 0,
      organizationId: form.organizationId,
      resources: transformedResources
    }
    onSubmit(payload)
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1: // Basic Information
        return !!form.venueName && !!form.description && !!form.venueType && !!form.capacity && !!form.amount && !!form.organizationId
      case 2: // Location
        return !!form.location && !!form.latitude && !!form.longitude
      case 3: // Contact
        return !!form.contactPerson && !!form.contactEmail && !!form.contactPhone
      case 4: // Resources
        return true // Resources are optional
      case 5: // Image & Availability
        return true // Image is optional
      default:
        return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            
            {/* Organization Selection */}
            <div>
              <Label htmlFor="organizationId">Organization</Label>
              <Select 
                value={form.organizationId} 
                onValueChange={val => setForm(f => ({ ...f, organizationId: val }))} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {orgLoading ? (
                    <SelectItem value="loading" disabled>Loading organizations...</SelectItem>
                  ) : organizations.length > 0 ? (
                    organizations.map((org) => (
                      <SelectItem key={org.organizationId} value={org.organizationId}>
                        {org.organizationName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-organizations" disabled>No organizations found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="venueName">Venue Name</Label>
              <Input
                id="venueName"
                name="venueName"
                value={form.venueName}
                onChange={handleChange}
                placeholder="Enter venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your venue"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="amenities">Amenities</Label>
              <Textarea
                id="amenities"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g., Wi-Fi, Parking, Stage, Air Conditioning"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Max number of people"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (RWF)</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Venue cost"
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="venueType">Venue Type</Label>
                <Select value={form.venueType} onValueChange={val => setForm(f => ({ ...f, venueType: val }))} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                    <SelectItem value="Hall">Hall</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Conference Room">Conference Room</SelectItem>
                    <SelectItem value="Stadium">Stadium</SelectItem>
                    <SelectItem value="Theater">Theater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Location Details</h2>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter venue location"
                required
              />
            </div>

            <div>
              <Label htmlFor="googleMapsLink">Google Maps Link</Label>
              <Input
                id="googleMapsLink"
                name="googleMapsLink"
                value={form.googleMapsLink}
                onChange={handleChange}
                placeholder="https://maps.google.com/?q=Your+Venue+Name"
                type="url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="Enter latitude"
                  type="number"
                  step="any"
                  required
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="Enter longitude"
                  type="number"
                  step="any"
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div>
              <Label htmlFor="contactPerson">Owner Name</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Enter venue owner name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Owner Email</Label>
              <Input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="Enter owner email"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Owner Phone Number</Label>
              <Input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="Enter owner phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="websiteURL">Website URL</Label>
              <Input
                id="websiteURL"
                name="websiteURL"
                value={form.websiteURL}
                onChange={handleChange}
                placeholder="Enter venue website URL"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Resources</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <Input
                  name="resourceName"
                  value={resourceForm.resourceName}
                  onChange={handleResourceInputChange}
                  placeholder="Resource Name"
                />
                <Input
                  name="description"
                  value={resourceForm.description}
                  onChange={handleResourceInputChange}
                  placeholder="Description"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    name="costPerUnit"
                    value={resourceForm.costPerUnit}
                    onChange={handleResourceInputChange}
                    placeholder="Cost Per Unit"
                  />
                  <Input
                    type="number"
                    name="quantity"
                    value={resourceForm.quantity}
                    onChange={handleResourceInputChange}
                    placeholder="Quantity"
                  />
                </div>
                <Button type="button" onClick={handleAddResource} className="w-full">
                  Add Resource
                </Button>
              </div>

              {resources.length > 0 && (
                <div className="mt-4 space-y-2">
                  {resources.map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                      <div>
                        <p className="font-medium">{resource.resource.resourceName}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {resource.quantity} | Cost: ${resource.resource.costPerUnit}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveResource(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Image & Availability</h2>
            <div>
              <Label>Venue Image</Label>
              <ImageUpload />
              <p className="text-xs text-gray-500 mt-1">
                Upload a high-quality image of your venue. Recommended size: 1200x600px.
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Label htmlFor="isAvailable">Availability Status</Label>
              <Switch
                id="isAvailable"
                checked={form.isAvailable}
                onCheckedChange={(checked) => setForm(f => ({ ...f, isAvailable: checked }))}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`w-1/5 h-2 rounded-full mx-1 ${
                idx + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {renderStepContent()}

      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <DialogFooter>
        <div className="flex justify-between w-full">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={loading || !validateStep()}
            >
              {currentStep < totalSteps 
                ? "Next" 
                : loading 
                  ? (mode === 'add' ? 'Creating...' : 'Saving...') 
                  : (mode === 'add' ? 'Create Venue' : 'Save Changes')}
            </Button>
          </div>
        </div>
      </DialogFooter>
    </form>
  )
}

export default function AdminVenues() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterAvailability, setFilterAvailability] = useState("all")
  const itemsPerPage = 5
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [editVenue, setEditVenue] = useState<Venue | null>(null)
  const [venues, setVenues] = useState<Venue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deleteVenueId, setDeleteVenueId] = useState<string | null>(null)

  // Fetch venues from database
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await ApiService.getAllVenues()
        console.log('Fetched venues:', response)
        if (response.success) {
          setVenues(response.data || [])
          if (response.data && response.data.length > 0) {
            toast.success(`Loaded ${response.data.length} venues successfully`)
          }
        } else {
          setVenues([])
          const errorMessage = response?.message || response?.error || 'Failed to fetch venues'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } catch (error: any) {
        setVenues([])
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch venues'
        setError(errorMessage)
        toast.error(errorMessage)
        console.error('Error fetching venues:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  // If venues are not loaded, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading venues...</div>
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

  // Ensure venues data is properly typed and has default values
  const safeVenues: Venue[] = venues.map((venue, index) => ({
    venueId: venue.venueId || `temp-${index}-${Date.now()}`,
    venueName: venue.venueName || '',
    description: venue.description || '',
    location: venue.location || '',
    latitude: venue.latitude || 0,
    longitude: venue.longitude || 0,
    venueType: venue.venueType || 'Hall',
    capacity: venue.capacity || 0,
    amount: venue.amount || 0,
    isAvailable: typeof venue.isAvailable === 'boolean' ? venue.isAvailable : true,
    contactPerson: venue.contactPerson || '',
    contactEmail: venue.contactEmail || '',
    contactPhone: venue.contactPhone || '',
    websiteURL: venue.websiteURL || '',
    imageSrc: venue.imageSrc || '',
    googleMapsLink: venue.googleMapsLink || '',
    amenities: venue.amenities || '',
    status: venue.status || '',
    organizationId: venue.organizationId || '',
    createdAt: venue.createdAt || new Date().toISOString(),
    updatedAt: venue.updatedAt || new Date().toISOString(),
    resources: venue.resources || []
  }))

  // Calculate venue statistics with safe values
  const stats = {
    totalVenues: safeVenues.length,
    availableVenues: safeVenues.filter(venue => venue.isAvailable).length,
    pendingApproval: safeVenues.filter(venue => !venue.isAvailable).length,
    totalCapacity: safeVenues.reduce((sum, venue) => sum + venue.capacity, 0),
    averageBookingRate: "85%", // This would come from actual booking data
  }

  // Get unique venue types with safe handling
  const uniqueVenueTypes = Array.from(new Set(safeVenues.map(venue => venue.venueType)))

  // Filter venues with safe string comparisons
  const filteredVenues = safeVenues.filter(venue => {
    const searchString = searchQuery.toLowerCase()
    const matchesSearch = 
      (venue.venueName?.toLowerCase() || '').includes(searchString) ||
      (venue.location?.toLowerCase() || '').includes(searchString) ||
      (venue.description?.toLowerCase() || '').includes(searchString)
    
    const matchesType = filterType === "all" || venue.venueType === filterType
    const matchesAvailability = filterAvailability === "all" || 
                               (filterAvailability === "available" && venue.isAvailable) ||
                               (filterAvailability === "pending" && !venue.isAvailable)
    
    return matchesSearch && matchesType && matchesAvailability
  })

  // Pagination with safe calculations
  const totalPages = Math.max(1, Math.ceil(filteredVenues.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedVenues = filteredVenues.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    try {
      setLoading(true)
      console.log('Adding new venue with data:', data)
      const response = await ApiService.createVenue(data)
      if (response && response.success) {
        // Refresh the venues list
        const updatedResponse = await ApiService.getAllVenues()
        if (updatedResponse && updatedResponse.success) {
          setVenues(updatedResponse.data || [])
        }
        setAddOpen(false)
        toast.success('Venue created successfully')
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to create venue'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create venue'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error creating venue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      setLoading(true)
      if (!editVenue?.venueId) {
        const errorMessage = 'Venue ID is required for update'
        setError(errorMessage)
        toast.error(errorMessage)
        return
      }
      const response = await ApiService.updateVenueById(editVenue.venueId, data)
      if (response && response.success) {
        // Refresh the venues list
        const updatedResponse = await ApiService.getAllVenues()
        if (updatedResponse && updatedResponse.success) {
          setVenues(updatedResponse.data || [])
        }
        setEditOpen(null)
        setEditVenue(null)
        toast.success('Venue updated successfully')
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to update venue'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update venue'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error updating venue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (venueId: string) => {
    try {
      setLoading(true)
      const response = await ApiService.deleteVenue(venueId)
      if (response && response.success) {
        // Refresh the venues list
        const updatedResponse = await ApiService.getAllVenues()
        if (updatedResponse && updatedResponse.success) {
          setVenues(updatedResponse.data || [])
        }
        setDeleteVenueId(null)
        toast.success('Venue deleted successfully')
      } else {
        const errorMessage = response?.message || response?.error || 'Failed to delete venue'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete venue'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error deleting venue:', error)
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
                <h2 className="text-2xl font-bold">Venue Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Venue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add New Venue</DialogTitle>
                    </DialogHeader>
                    <VenueForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Venues</p>
                        <p className="text-2xl font-bold">{stats.totalVenues}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {stats.availableVenues} Available • {stats.pendingApproval} Pending
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
                        <p className="text-sm text-gray-600">Available Venues</p>
                        <p className="text-2xl font-bold">{stats.availableVenues}</p>
                        <p className="text-sm text-gray-500 mt-1">Ready for booking</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

              

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Booking Rate</p>
                        <p className="text-2xl font-bold">{stats.averageBookingRate}</p>
                        <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Venues Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Venues</CardTitle>
                  <CardDescription>Manage venue availability and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search venues..."
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
                        {uniqueVenueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Venue Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedVenues.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No venues found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedVenues.map((venue) => (
                            <TableRow key={venue.venueId}>
                              <TableCell className="font-medium">{venue.venueName}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  {venue.location}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={venue.venueType === "Auditorium" ? "default" : "secondary"}>
                                  {venue.venueType}
                                </Badge>
                              </TableCell>
                              <TableCell>{venue.capacity.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={venue.isAvailable ? "default" : "outline"}>
                                  {venue.isAvailable ? "Available" : "Pending Approval"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => router.push(`/admin/venues/${venue.venueId}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    onClick={() => { setEditVenue(venue); setEditOpen(venue.venueId); }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="icon" 
                                        variant="destructive"
                                        onClick={() => setDeleteVenueId(venue.venueId)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{venue.venueName}"? This action cannot be undone and will permanently remove the venue from the system.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(venue.venueId)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete Venue
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVenues.length)} of {filteredVenues.length} venues
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

                    {editVenue && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) { setEditOpen(null); setEditVenue(null); }}}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Venue</DialogTitle>
            </DialogHeader>
            <VenueForm mode="edit" initialData={editVenue} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 