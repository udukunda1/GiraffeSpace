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
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { format, parseISO, isSameDay } from "date-fns"

export default function AdminEvents() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | null>(null)
  const itemsPerPage = 10

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "users", label: "Users", icon: UsersIcon, href: "/admin/users" },
  ]

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="admin" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.id === "users"
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
             {/* --- Main Users Content --- */}
             <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Event Management</h2>
                <Button onClick={() => router.push("/admin/events/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Event
                </Button>
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
                  {/* Date filter: use your own DatePicker or a simple input for now */}
                  <Input
                    type="date"
                    value={dateFilter ? format(dateFilter, "yyyy-MM-dd") : ""}
                    onChange={e => setDateFilter(e.target.value ? parseISO(e.target.value) : null)}
                    className="text-sm"
                  />
                </div>
              </div>
              {/* Events Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                  <CardDescription>Manage and review all events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEvents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No events found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedEvents.map((event) => (
                            <TableRow key={event.eventId}>
                              <TableCell>{event.eventTitle}</TableCell>
                              <TableCell>{event.venue}</TableCell>
                              <TableCell>
                                <Badge variant={event.status === "Active" ? "default" : event.status === "Draft" ? "secondary" : "outline"}>
                                  {event.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{event.eventDate}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button size="sm" variant="outline" onClick={() => router.push(`/admin/manage/events/${event.eventId}`)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => router.push(`/admin/manage/events/${event.eventId}/edit`)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => alert('Delete event functionality will be implemented')}>
                                    <UserX className="h-4 w-4 text-red-600" />
                                  </Button>
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
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
    </div>
  )
} 