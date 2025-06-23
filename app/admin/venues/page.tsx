"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, CheckCircle, Trash2, MapPin, Calendar, Building2, Clock, Search, Home, UsersIcon } from "lucide-react"
import { venues } from "@/data/venues"
import { events } from "@/data/events"
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

function VenueForm({ initialData, onSubmit, loading, mode }: {
  initialData?: any,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    venueName: initialData?.venueName || '',
    location: initialData?.location || '',
    venueType: initialData?.venueType || '',
    capacity: initialData?.capacity ? String(initialData.capacity) : '',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Venue Name"
        name="venueName"
        value={form.venueName}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        required
      />
      <Select value={form.venueType} onValueChange={val => setForm(f => ({ ...f, venueType: val }))} required>
        <SelectTrigger>
          <SelectValue placeholder="Venue Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Auditorium">Auditorium</SelectItem>
          <SelectItem value="Hall">Hall</SelectItem>
          <SelectItem value="Outdoor">Outdoor</SelectItem>
          <SelectItem value="Conference Room">Conference Room</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Capacity"
        name="capacity"
        value={form.capacity}
        onChange={handleChange}
        required
        min={1}
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={e => setForm(f => ({ ...f, isAvailable: e.target.checked }))}
          id="isAvailable"
        />
        <label htmlFor="isAvailable">Available</label>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Venue' : 'Save Changes')}</Button>
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
  const itemsPerPage = 10
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editVenue, setEditVenue] = useState<any>(null)

  // Calculate venue statistics
  const stats = {
    totalVenues: venues.length,
    availableVenues: venues.filter(venue => venue.isAvailable).length,
    pendingApproval: venues.filter(venue => !venue.isAvailable).length,
    totalCapacity: venues.reduce((sum, venue) => sum + venue.capacity, 0),
    averageBookingRate: "85%", // This would come from actual booking data
  }

  // Get unique venue types for filter
  const uniqueVenueTypes = Array.from(new Set(venues.map(venue => venue.venueType)))

  // Filter venues
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || venue.venueType === filterType
    const matchesAvailability = filterAvailability === "all" || 
                               (filterAvailability === "available" && venue.isAvailable) ||
                               (filterAvailability === "pending" && !venue.isAvailable)
    return matchesSearch && matchesType && matchesAvailability
  })

  // Pagination
  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVenues = filteredVenues.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    setLoading(true)
    // TODO: Add venue logic
    setTimeout(() => {
      setLoading(false)
      setAddOpen(false)
      // Optionally update venue list
    }, 1000)
  }
  const handleEdit = async (data: any) => {
    setLoading(true)
    // TODO: Edit venue logic
    setTimeout(() => {
      setLoading(false)
      setEditOpen(null)
      // Optionally update venue list
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
    
      <div className="flex flex-1">
      
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
           
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Venue Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New Venue</Button>
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
                        <p className="text-sm text-gray-600">Total Capacity</p>
                        <p className="text-2xl font-bold">{stats.totalCapacity}</p>
                        <p className="text-sm text-gray-500 mt-1">Across all venues</p>
                      </div>
                      <UsersIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Average Booking Rate</p>
                        <p className="text-2xl font-bold">{stats.averageBookingRate}</p>
                        <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-600" />
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
                        {paginatedVenues.map((venue) => (
                          <TableRow key={venue.venueId}>
                            <TableCell className="font-medium">{venue.venueName}</TableCell>
                            <TableCell>{venue.location}</TableCell>
                            <TableCell>{venue.venueType}</TableCell>
                            <TableCell>{venue.capacity}</TableCell>
                            <TableCell>
                              <Badge variant={venue.isAvailable ? "default" : "secondary"}>
                                {venue.isAvailable ? "Available" : "Pending Approval"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="icon" variant="outline" onClick={() => router.push(`/admin/venues/${venue.venueId}`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" onClick={() => { setEditVenue(venue); setEditOpen(venue.venueId); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Dialog open={editOpen === venue.venueId} onOpenChange={open => { if (!open) setEditOpen(null); }}>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Venue</DialogTitle>
                                    </DialogHeader>
                                    <VenueForm mode="edit" initialData={venue} loading={loading} onSubmit={handleEdit} />
                                  </DialogContent>
                                </Dialog>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
      
    </div>
  )
} 