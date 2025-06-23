"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Calendar, CheckCircle, XCircle, Building2, User, } from "lucide-react"

// Mock venue booking data
const bookings = [
  { id: "1", venue: "Venue X", user: "Alice", date: "2024-06-10", status: "Confirmed" },
  { id: "2", venue: "Venue Y", user: "Bob", date: "2024-06-12", status: "Pending" },
  { id: "3", venue: "Venue Z", user: "Charlie", date: "2024-06-15", status: "Cancelled" },
  { id: "4", venue: "Venue X", user: "Diana", date: "2024-06-18", status: "Confirmed" },
]

export default function AdminVenueBooking() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10

  // Statistics
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    pending: bookings.filter(b => b.status === "Pending").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  }

  // Filtered bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.venue.toLowerCase().includes(searchQuery.toLowerCase()) || booking.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Venue Booking Management</h2>
                <Button onClick={() => router.push("/admin/venuebooking/add")}>Add Venue Booking</Button>
              </div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
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
                        <p className="text-sm text-gray-600">Confirmed</p>
                        <p className="text-2xl font-bold">{stats.confirmed}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending</p>
                        <p className="text-2xl font-bold">{stats.pending}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-yellow-500" />
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
              </div>
              {/* Bookings Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Venue Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by venue or user..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Venue</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.venue}</TableCell>
                              <TableCell>{booking.user}</TableCell>
                              <TableCell>{booking.date}</TableCell>
                              <TableCell>
                                <Badge variant={booking.status === "Confirmed" ? "default" : booking.status === "Pending" ? "secondary" : "outline"}>
                                  {booking.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex space-x-2">
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/venuebooking/${booking.id}`)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/venuebooking/${booking.id}/edit`)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="destructive" onClick={() => { /* TODO: Implement delete functionality */ }}>
                                    <Trash2 className="h-4 w-4" />
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
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                    <span className="self-center">Page {currentPage} of {totalPages}</span>
                    <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
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