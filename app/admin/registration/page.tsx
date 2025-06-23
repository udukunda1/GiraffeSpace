"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Plus, UserPlus, Users, CheckCircle, XCircle, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock event and registration data
const events = [
  { id: "1", title: "Tech Conference 2024" },
  { id: "2", title: "Music Festival" },
  { id: "3", title: "Art Expo" },
]

const registrations = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Approved",
    date: "2024-06-01",
    eventId: "1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Pending",
    date: "2024-06-02",
    eventId: "2",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Rejected",
    date: "2024-06-03",
    eventId: "1",
  },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Approved", label: "Approved" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
]

export default function RegistrationList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [data, setData] = useState(registrations)

  // Statistics
  const stats = {
    total: data.length,
    approved: data.filter(r => r.status === "Approved").length,
    pending: data.filter(r => r.status === "Pending").length,
    rejected: data.filter(r => r.status === "Rejected").length,
  }

  // Filtered registrations
  const filteredRegistrations = data.filter(reg => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      reg.name.toLowerCase().includes(search) ||
      reg.email.toLowerCase().includes(search)
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    const matchesEvent = eventFilter === "all" || reg.eventId === eventFilter
    return matchesSearch && matchesStatus && matchesEvent
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage)

  function handleDelete(id: string) {
    setData(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center space-x-2">
                <h2 className="text-2xl font-bold">Registrations</h2>
                <Button onClick={() => router.push("/admin/registration/add")}> 
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Registration
                </Button>
              </div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Approved</p>
                        <p className="text-2xl font-bold">{stats.approved}</p>
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
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold">{stats.rejected}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 w-full border rounded px-3 py-2"
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
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={eventFilter}
                    onChange={e => setEventFilter(e.target.value)}
                  >
                    <option value="all">All Events</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Registration Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Registrations</CardTitle>
                  <CardDescription>Manage all user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRegistrations.length > 0 ? (
                        paginatedRegistrations.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell>{reg.email}</TableCell>
                            <TableCell>{events.find(ev => ev.id === reg.eventId)?.title || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={reg.status === "Approved" ? "default" : reg.status === "Pending" ? "secondary" : "destructive"}>
                                {reg.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{reg.date}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/registration/${reg.id}`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => router.push(`/admin/registration/${reg.id}/edit`)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(reg.id)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">No registrations found.</TableCell>
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
        </div>
      </div>
    </div>
  )
} 