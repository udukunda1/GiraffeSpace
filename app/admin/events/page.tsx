"use client"

import { useState } from "react"
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

  // Statistics
  const stats = {
    total: events.length,
    active: events.filter(e => e.status === "Active").length,
    draft: events.filter(e => e.status === "Draft").length,
    cancelled: events.filter(e => e.status === "Cancelled").length,
    completed: events.filter(e => e.status === "Completed").length,
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

  // Filtered events
  const filteredEvents = events.filter(event => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      event.eventTitle.toLowerCase().includes(search) ||
      event.venue.toLowerCase().includes(search)
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesDate = !dateFilter || isSameDay(parseISO(event.eventDate), dateFilter)
    return matchesSearch && matchesStatus && matchesDate
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage)

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
  const [form, setForm] = useState({
    eventTitle: initialData?.eventTitle || '',
    venue: initialData?.venue || '',
    eventDate: initialData?.eventDate || '',
    status: initialData?.status || '',
    description: initialData?.description || '',
    organizer: initialData?.organizer || '',
    category: initialData?.eventCategory || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="eventTitle">Event Title</Label>
            <Input id="eventTitle" name="eventTitle" value={form.eventTitle} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" value={form.venue} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input id="status" name="status" value={form.status} onChange={handleChange} required />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="organizer">Organizer</Label>
            <Input id="organizer" name="organizer" value={form.organizer} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={form.category} onChange={handleChange} />
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? (mode === 'add' ? 'Creating...' : 'Saving...') : (mode === 'add' ? 'Create Event' : 'Save Changes')}</Button>
      </DialogFooter>
    </form>
  )
} 