"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Calendar, MapPin, Users as UsersIcon, Home, UserX, Search, Plus, CheckCircle, Clock, XCircle, Users } from "lucide-react"
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
import { format, parseISO, isSameDay } from "date-fns"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ApiService from "@/api/apiConfig"
import { jwtDecode, JwtPayload } from "jwt-decode"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserOrganizations } from "@/hooks/useUserOrganizations"

export default function AdminEvents() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const itemsPerPage = 10
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editEvent, setEditEvent] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [filteredVenues, setFilteredVenues] = useState([]);

  // Statistics
  const stats = {
    total: events.length,
    active: events.filter(e => e.status === "ACTIVE").length,
    draft: events.filter(e => e.status === "DRAFT").length,
    cancelled: events.filter(e => e.status === "CANCELLED").length,
    completed: events.filter(e => e.status === "COMPLETED").length,
  }

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Published", label: "Published" },
    { value: "Active", label: "Active" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Approved", label: "Approved" },
    { value: "Postponed", label: "Postponed" },
    { value: "Completed", label: "Completed" },
    { value: "Complete", label: "Complete" },
    { value: "Draft", label: "Draft" },
  ]

  // fetch all events from database
  useEffect(() => {   
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await ApiService.getAllEvents()
        setEvents(response)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Filtered events
  const filteredEvents = events.filter(event => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      (event.eventTitle?.toLowerCase() || '').includes(search) ||
      (event.organization?.organizationName?.toLowerCase() || '').includes(search)
    const matchesStatus = statusFilter === "all" || event.status === statusFilter.toUpperCase()
    const matchesDate = !dateFilter || (event.startDate && isSameDay(parseISO(event.startDate), dateFilter))
    return matchesSearch && matchesStatus && matchesDate
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading events...</div>

  const handleAdd = async (data: any) => {
    setLoading(true)
    // TODO: Add event logic
    setTimeout(() => {
      setLoading(false)
      setAddOpen(false)
      // Optionally update event list
    }, 1000)
  }
  const handleEdit = async (data: any) => {
    setLoading(true)
    // TODO: Edit event logic
    setTimeout(() => {
      setLoading(false)
      setEditOpen(null)
      // Optionally update event list
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Event Management</h2>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <EventForm mode="add" loading={loading} onSubmit={handleAdd} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Draft</p>
                    <p className="text-2xl font-bold">{stats.draft}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cancelled</p>
                    <p className="text-2xl font-bold">{stats.cancelled}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Input
                type="date"
                value={dateFilter ? format(dateFilter, "yyyy-MM-dd") : ""}
                onChange={e => setDateFilter(e.target.value ? parseISO(e.target.value) : null)}
                className="w-[160px]"
              />
            </div>
          </div>
          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage all events in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event) => (
                      <TableRow key={event.eventId}>
                        <TableCell>{event.eventTitle}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>{event.eventDate}</TableCell>
                        <TableCell>
                          <Badge variant={event.status === "Active" ? "default" : event.status === "Draft" ? "secondary" : "outline"}>
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => router.push(`/admin/events/${event.eventId}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => { setEditEvent(event); setEditOpen(event.eventId); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => {/* handle delete */}}>
                              <UserX className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No events found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {/* Pagination */}
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage(safeCurrentPage - 1)}
                >
                  Previous
                </Button>
                <span className="px-2 py-1 text-sm">
                  Page {safeCurrentPage} of {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => setCurrentPage(safeCurrentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {editEvent && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <EventForm mode="edit" initialData={editEvent} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function EventForm({ initialData, onSubmit, loading, mode }: {
  initialData?: any,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  // Get userId from JWT
  const getUserIdFromToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode<{ userId?: string } & JwtPayload>(token);
      return decoded.userId || null;
    } catch {
      return null;
    }
  };
  const userId = getUserIdFromToken();
  const { organizations, loading: orgLoading } = useUserOrganizations(userId || undefined);

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Step 1: Event basics
  const [eventBasics, setEventBasics] = useState({
    eventTitle: initialData?.eventTitle || '',
    eventDate: initialData?.eventDate || '',
    endDate: initialData?.endDate || '',
    eventStartTime: initialData?.eventStartTime || '',
    eventEndTime: initialData?.eventEndTime || '',
  })

  // Step 2: Venue selection (multi-select)
  const [availableVenues, setAvailableVenues] = useState<any[]>([])
  const [selectedVenues, setSelectedVenues] = useState<string[]>(initialData?.venues || [])
  const [venueOrganizationId, setVenueOrganizationId] = useState(initialData?.venueOrganizationId || '')
  // Pagination state for venues
  const [venuePage, setVenuePage] = useState(1);
  const venuesPerPage = 5;

  // Step 3: Event Details (Core)
  const [eventDetails, setEventDetails] = useState({
    description: initialData?.description || '',
    eventCategory: initialData?.eventCategory || '',
    eventType: initialData?.eventType || 'PUBLIC',
    maxAttendees: initialData?.maxAttendees || '',
    imageURL: initialData?.imageURL || '',
    ticketingDetails: initialData?.ticketingDetails || '',
    refundPolicy: initialData?.refundPolicy || '',
    dressCode: initialData?.dressCode || '',
    ageRestriction: initialData?.ageRestriction || '',
    tags: initialData?.tags || [],
    tagsInput: '',
    websiteURL: initialData?.websiteURL || '',
    hashtag: initialData?.hashtag || '',
    isFeatured: initialData?.isFeatured ?? false,
    qrCode: initialData?.qrCode || '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageURL || '')

  // Step 4: Media & Ticketing
  const [qrCode, setQrCode] = useState(initialData?.qrCode || '')

  // Step 5: Additional Details
  const [websiteURL, setWebsiteURL] = useState(initialData?.websiteURL || '')
  const [hashtag, setHashtag] = useState(initialData?.hashtag || '')

  // Add a loading state for venue fetching
  const [venueLoading, setVenueLoading] = useState(false);

  // Add a viewVenue state
  const [viewVenue, setViewVenue] = useState<any>(null);

  // Add local state for organization filter and all organizations
  const [organizationFilter, setOrganizationFilter] = useState('all');
  const [allOrganizations, setAllOrganizations] = useState<any[]>([]);

  // Fetch all organizations for filter dropdown when step 2 is reached
  useEffect(() => {
    if (currentStep === 2) {
      ApiService.getAllOrganization().then(res => {
        if (Array.isArray(res.data)) setAllOrganizations(res.data);
      });
    }
  }, [currentStep]);

  // Handlers for each step
  const handleBasicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEventBasics(prev => ({ ...prev, [name]: value }))
  }
  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === "checkbox"
    ) {
      setEventDetails((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setEventDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDetails(prev => ({ ...prev, tagsInput: e.target.value }))
  }
  const addTag = () => {
    if (eventDetails.tagsInput.trim()) {
      setEventDetails(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagsInput.trim()],
        tagsInput: '',
      }))
    }
  }
  const removeTag = (tag: string) => {
    setEventDetails(prev => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag),
    }))
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setEventDetails(prev => ({ ...prev, imageURL: result }))
      }
      reader.readAsDataURL(file)
    }
  }
  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview('')
    setEventDetails(prev => ({ ...prev, imageURL: '' }))
  }

  // Venue multi-select handler
  const handleVenueSelect = (venueId: string, orgId: string) => {
    if (organizationFilter === 'all') {
      setSelectedVenues([venueId]);
      setVenueOrganizationId(orgId);
    } else {
      setSelectedVenues(prev =>
        prev.includes(venueId)
          ? prev.filter(id => id !== venueId)
          : [...prev, venueId]
      );
      setVenueOrganizationId(orgId);
    }
  };

  // Step navigation
  const nextStep = async () => {
    console.log('Current step before increment:', currentStep, 'of', totalSteps);
    if (currentStep === 1) {
      if (eventBasics.eventDate && eventBasics.endDate && eventBasics.eventStartTime && eventBasics.eventEndTime && venueOrganizationId) {
        try {
          setAvailableVenues([])
          setVenueLoading(true)
          const venuesResponse = await ApiService.getAvailableVenues(
            eventBasics.eventDate,
            eventBasics.endDate,
            eventBasics.eventStartTime,
            eventBasics.eventEndTime
          )
          setAvailableVenues(Array.isArray(venuesResponse.data) ? venuesResponse.data : [])
          setVenuePage(1)
        } finally {
          setVenueLoading(false)
        }
      } else {
        // If required fields are missing, do not advance
        return;
      }
    }
    setCurrentStep(s => {
      const next = Math.min(s + 1, totalSteps);
      console.log('Next step:', next);
      return next;
    });
  }
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  // Validation per step
  const validateStep = () => {
    if (currentStep === 1) {
      return eventBasics.eventTitle && eventBasics.eventDate && eventBasics.endDate && eventBasics.eventStartTime && eventBasics.eventEndTime
    }
    if (currentStep === 2) {
      return selectedVenues.length > 0
    }
    if (currentStep === 3) {
      return eventDetails.description && eventDetails.eventCategory && eventDetails.eventType && eventDetails.maxAttendees
    }
    if (currentStep === 4) {
      // All fields in Media & Ticketing are optional
      return true
    }
    if (currentStep === 5) {
      // Additional details are all optional, so always valid
      return true
    }
    return true
  }

  // Final submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) {
      return
    }
    // Compose payload
    const startDate = new Date(eventBasics.eventDate + 'T' + eventBasics.eventStartTime).toISOString()
    const endDate = new Date(eventBasics.endDate + 'T' + eventBasics.eventEndTime).toISOString()
    const payload = {
      eventTitle: eventBasics.eventTitle,
      eventType: eventDetails.eventType,
      organizationId: venueOrganizationId,
      startDate,
      endDate,
      startTime: eventBasics.eventStartTime,
      endTime: eventBasics.eventEndTime,
      description: eventDetails.description,
      maxAttendees: Number(eventDetails.maxAttendees),
      isFeatured: !!eventDetails.isFeatured,
      qrCode: eventDetails.qrCode,
      imageURL: eventDetails.imageURL,
      venueOrganizationId,
      venues: selectedVenues,
    }
    console.log("PAYLOAD:", payload);
    onSubmit(payload)
    const response = await ApiService.createEvent(payload)
    console.log("RESPONSE:", response);
  }

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input id="eventTitle" name="eventTitle" value={eventBasics.eventTitle} onChange={handleBasicsChange} required />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Select
                value={venueOrganizationId}
                onValueChange={val => setVenueOrganizationId(val)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {orgLoading ? (
                    <SelectItem value="loading" disabled>Loading organizations...</SelectItem>
                  ) : organizations.length > 0 ? (
                    organizations.map(org => (
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
              <Label htmlFor="eventDate">Start Date</Label>
              <Input id="eventDate" name="eventDate" type="date" value={eventBasics.eventDate} onChange={handleBasicsChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={eventBasics.endDate} onChange={handleBasicsChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventStartTime">Start Time</Label>
                <Input id="eventStartTime" name="eventStartTime" type="time" value={eventBasics.eventStartTime} onChange={handleBasicsChange} required />
              </div>
              <div>
                <Label htmlFor="eventEndTime">End Time</Label>
                <Input id="eventEndTime" name="eventEndTime" type="time" value={eventBasics.eventEndTime} onChange={handleBasicsChange} required />
              </div>
            </div>
          </div>
        )
      case 2:
        // Derive organizations from availableVenues, using organization object if present
        const organizationsInVenues = Array.from(
          new Map(
            availableVenues.map(v => [
              v.organizationId,
              {
                organizationId: v.organizationId,
                organizationName: v.organization?.organizationName || v.organizationName || v.organizationId
              }
            ])
          ).values()
        );
        // Filter venues based on selected organization
        const venuesToShow = organizationFilter === 'all'
          ? availableVenues
          : availableVenues.filter(v => v.organizationId === organizationFilter);
        // Pagination logic
        const totalVenuePages = Math.max(1, Math.ceil(venuesToShow.length / venuesPerPage));
        const startVenueIdx = (venuePage - 1) * venuesPerPage;
        const paginatedVenues = venuesToShow.slice(startVenueIdx, startVenueIdx + venuesPerPage);
        return (
          <div className="space-y-4">
            <Label>Filter by Organization (optional)</Label>
            <Select value={organizationFilter} onValueChange={val => setOrganizationFilter(val)}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizationsInVenues.map(org => (
                  <SelectItem key={org.organizationId} value={org.organizationId}>{org.organizationName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>Venues (select {organizationFilter === 'all' ? 'one' : 'multiple'} from the same organization)</Label>
            <div className="space-y-2">
              {paginatedVenues.map(v => (
                <div key={v.venueId} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedVenues.includes(v.venueId)}
                    onChange={() => handleVenueSelect(v.venueId, v.organizationId)}
                    id={`venue-${v.venueId}`}
                    disabled={organizationFilter !== 'all' && v.organizationId !== organizationFilter}
                  />
                  <label htmlFor={`venue-${v.venueId}`}>{v.venueName}</label>
                  <Button type="button" size="sm" variant="outline" onClick={() => setViewVenue(v)}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            {/* Pagination controls */}
            {totalVenuePages > 1 && (
              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setVenuePage(p => Math.max(1, p - 1))} disabled={venuePage === 1}>Previous</Button>
                <span className="px-2 py-1 text-sm">Page {venuePage} of {totalVenuePages}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setVenuePage(p => Math.min(totalVenuePages, p + 1))} disabled={venuePage === totalVenuePages}>Next</Button>
              </div>
            )}
          </div>
        )
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={eventDetails.description} onChange={handleDetailsChange} required rows={2} />
            </div>
            <div>
              <Label htmlFor="eventCategory">Category</Label>
              <Input id="eventCategory" name="eventCategory" value={eventDetails.eventCategory} onChange={handleDetailsChange} required />
            </div>
            <div>
              <Label htmlFor="eventType">Type</Label>
              <select id="eventType" name="eventType" value={eventDetails.eventType} onChange={handleDetailsChange} required className="w-full border rounded-md px-3 py-2">
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={!!eventDetails.isFeatured} onChange={handleDetailsChange} />
              <Label htmlFor="isFeatured">Featured Event</Label>
            </div>
            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input id="maxAttendees" name="maxAttendees" type="number" value={eventDetails.maxAttendees} onChange={handleDetailsChange} required />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="imageURL">Event Image</Label>
              <Input id="imageURL" name="imageURL" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Event" className="h-32 rounded" />
                  <Button type="button" variant="outline" size="sm" onClick={removeImage} className="mt-2">Remove Image</Button>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="qrCode">QR Code URL</Label>
              <Input id="qrCode" name="qrCode" value={eventDetails.qrCode} onChange={handleDetailsChange} />
            </div>
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="ticketingDetails">Ticketing Details</Label>
              <Textarea id="ticketingDetails" name="ticketingDetails" value={eventDetails.ticketingDetails} onChange={handleDetailsChange} rows={2} />
            </div>
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <Textarea id="refundPolicy" name="refundPolicy" value={eventDetails.refundPolicy} onChange={handleDetailsChange} rows={2} />
            </div>
          </div>
        )
      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="md:col-span-2 flex gap-4">
              <div className="flex-1">
                <Label htmlFor="dressCode">Dress Code</Label>
                <Input id="dressCode" name="dressCode" value={eventDetails.dressCode} onChange={handleDetailsChange} />
              </div>
              <div className="flex-1">
                <Label htmlFor="ageRestriction">Age Restriction</Label>
                <Input id="ageRestriction" name="ageRestriction" value={eventDetails.ageRestriction} onChange={handleDetailsChange} />
              </div>
            </div>
            <div className="col-span-1 md:col-span-3">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input id="tagsInput" name="tagsInput" value={eventDetails.tagsInput} onChange={handleTagsChange} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); }}} placeholder="Add tag and press Enter" />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventDetails.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeTag(tag)}>&times;</Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="websiteURL">Website</Label>
              <Input id="websiteURL" name="websiteURL" value={eventDetails.websiteURL} onChange={handleDetailsChange} />
            </div>
            <div>
              <Label htmlFor="hashtag">Hashtag</Label>
              <Input id="hashtag" name="hashtag" value={eventDetails.hashtag} onChange={handleDetailsChange} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stepper */}
      <div className="flex justify-between mb-6">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`w-1/5 h-2 rounded-full mx-1 ${idx + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {renderStep()}
      <DialogFooter>
        <div className="flex justify-between w-full">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            {currentStep < totalSteps ? (
              <Button type="button" onClick={async () => await nextStep()} disabled={!validateStep() || venueLoading}>
                {venueLoading && currentStep === 1 ? 'Loading Venues...' : 'Next'}
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={loading}>{loading ? (mode === 'add' ? 'Creating...' : 'Saving...') : (mode === 'add' ? 'Create Event' : 'Save Changes')}</Button>
            )}
          </div>
        </div>
      </DialogFooter>
      {/* Venue Details Dialog */}
      <Dialog open={!!viewVenue} onOpenChange={open => { if (!open) setViewVenue(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewVenue?.venueName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Location:</strong> {viewVenue?.location}</p>
            <p><strong>Capacity:</strong> {viewVenue?.capacity}</p>
            <p><strong>Description:</strong> {viewVenue?.description}</p>
            {viewVenue?.amenities && <p><strong>Amenities:</strong> {viewVenue.amenities}</p>}
            {viewVenue?.amount && <p><strong>Amount:</strong> {viewVenue.amount}</p>}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setViewVenue(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
} 