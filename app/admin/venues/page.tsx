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

// Define TypeScript interfaces for better type safety
interface Venue {
  venueId: string;
  venueName: string;
  location: string;
  venueType: string;
  capacity: number;
  isAvailable: boolean;
  description?: string;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface RawVenue {
  venueId?: string;
  venueName?: string;
  location?: string;
  venueType?: string;
  capacity?: number;
  isAvailable?: boolean;
  description?: string;
  amenities?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function VenueForm({ initialData, onSubmit, loading, mode }: {
  initialData?: Partial<Venue>,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    venueName: initialData?.venueName || '',
    location: initialData?.location || '',
    venueType: initialData?.venueType || '',
    capacity: initialData?.capacity ? String(initialData.capacity) : '',
    description: initialData?.description || '',
    isAvailable: initialData?.isAvailable ?? true,
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    onSubmit({ ...form, capacity: Number(form.capacity) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="venueName">Venue Name</Label>
            <Input
              id="venueName"
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="venueType">Venue Type</Label>
            <Select value={form.venueType} onValueChange={val => setForm(f => ({ ...f, venueType: val }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Select venue type" />
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
        <div className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              type="number"
              id="capacity"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              required
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the venue"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Availability Status</Label>
            <Switch 
              id="isAvailable" 
              checked={form.isAvailable} 
              onCheckedChange={val => setForm(f => ({ ...f, isAvailable: val }))} 
            />
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? (mode === 'add' ? 'Creating...' : 'Saving...') : (mode === 'add' ? 'Create Venue' : 'Save Changes')}
        </Button>
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
        if (response && response.success) {
          setVenues(response.data || [])
        } else {
          setVenues([])
          setError(response?.error || 'Failed to fetch venues')
        }
      } catch (error) {
        setVenues([])
        setError('Failed to fetch venues')
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
    location: venue.location || '',
    venueType: venue.venueType || 'Hall',
    capacity: venue.capacity || 0,
    isAvailable: typeof venue.isAvailable === 'boolean' ? venue.isAvailable : true,
    description: venue.description || '',
    amenities: venue.amenities || [],
    createdAt: venue.createdAt || new Date().toISOString(),
    updatedAt: venue.updatedAt || new Date().toISOString()
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
      const response = await ApiService.createVenue(data)
      if (response && response.success) {
        // Refresh the venues list
        const updatedResponse = await ApiService.getAllVenues()
        if (updatedResponse && updatedResponse.success) {
          setVenues(updatedResponse.data || [])
        }
        setAddOpen(false)
      } else {
        setError(response?.error || 'Failed to create venue')
      }
    } catch (error) {
      setError('Failed to create venue')
      console.error('Error creating venue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data: any) => {
    try {
      setLoading(true)
      if (!editVenue?.venueId) {
        setError('Venue ID is required for update')
        return
      }
      const response = await ApiService.updateVenueById(editVenue.venueId)
      if (response && response.success) {
        // Refresh the venues list
        const updatedResponse = await ApiService.getAllVenues()
        if (updatedResponse && updatedResponse.success) {
          setVenues(updatedResponse.data || [])
        }
        setEditOpen(null)
        setEditVenue(null)
      } else {
        setError(response?.error || 'Failed to update venue')
      }
    } catch (error) {
      setError('Failed to update venue')
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
      } else {
        setError(response?.error || 'Failed to delete venue')
      }
    } catch (error) {
      setError('Failed to delete venue')
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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Venue</DialogTitle>
                    </DialogHeader>
                    <VenueForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        <p className="text-sm text-gray-600">Total Capacity</p>
                        <p className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Across all venues</p>
                      </div>
                      <UsersIcon className="h-8 w-8 text-purple-600" />
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
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
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