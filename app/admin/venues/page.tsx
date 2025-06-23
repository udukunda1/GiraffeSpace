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

export default function AdminVenues() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterAvailability, setFilterAvailability] = useState("all")
  const itemsPerPage = 10

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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "users", label: "Users", icon: UsersIcon, href: "/admin/users" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="admin" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <MapPin className="h-6 w-6 text-blue-600 mr-3" />
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
                      item.id === "venues"
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
           
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Venue Management</h2>
                <Button>Add New Venue</Button>
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
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {!venue.isAvailable && (
                                  <Button size="sm" variant="outline">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
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
      <Footer />
    </div>
  )
} 