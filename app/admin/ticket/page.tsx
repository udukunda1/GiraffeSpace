"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Plus, Ticket, Users, CheckCircle, XCircle, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Mock event and ticket data
const events = [
  { id: "1", title: "Tech Conference 2024" },
  { id: "2", title: "Music Festival" },
  { id: "3", title: "Art Expo" },
]

const tickets = [
  {
    id: "1",
    code: "TCKT-001",
    eventId: "1",
    holder: "John Doe",
    status: "Active",
    date: "2024-06-01",
  },
  {
    id: "2",
    code: "TCKT-002",
    eventId: "2",
    holder: "Jane Smith",
    status: "Used",
    date: "2024-06-02",
  },
  {
    id: "3",
    code: "TCKT-003",
    eventId: "1",
    holder: "Alice Johnson",
    status: "Cancelled",
    date: "2024-06-03",
  },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Used", label: "Used" },
  { value: "Cancelled", label: "Cancelled" },
]

function TicketForm({ initialData, onSubmit, loading, mode }: {
  initialData?: any,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    event: initialData?.event || '',
    holder: initialData?.holder || '',
    type: initialData?.type || '',
    price: initialData?.price || '',
    status: initialData?.status || 'Active',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Event" name="event" value={form.event} onChange={handleChange} required />
      <Input placeholder="Holder" name="holder" value={form.holder} onChange={handleChange} required />
      <Input placeholder="Type" name="type" value={form.type} onChange={handleChange} required />
      <Input placeholder="Price" name="price" value={form.price} onChange={handleChange} required type="number" min={0} />
      <Select value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val }))} required>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Used">Used</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Ticket' : 'Save Changes')}</Button>
      </DialogFooter>
    </form>
  )
}

export default function TicketList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [data, setData] = useState(tickets)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editTicket, setEditTicket] = useState<any>(null)

  // Statistics
  const stats = {
    total: data.length,
    active: data.filter(t => t.status === "Active").length,
    used: data.filter(t => t.status === "Used").length,
    cancelled: data.filter(t => t.status === "Cancelled").length,
  }

  // Filtered tickets
  const filteredTickets = data.filter(ticket => {
    const search = searchQuery.toLowerCase()
    const matchesSearch =
      ticket.code.toLowerCase().includes(search) ||
      ticket.holder.toLowerCase().includes(search)
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesEvent = eventFilter === "all" || ticket.eventId === eventFilter
    return matchesSearch && matchesStatus && matchesEvent
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage)

  function handleDelete(id: string) {
    setData(prev => prev.filter(t => t.id !== id))
  }

  const handleAdd = async (data: any) => {
    setLoading(true)
    // TODO: Add ticket logic
    setTimeout(() => {
      setLoading(false)
      setAddOpen(false)
      // Optionally update ticket list
    }, 1000)
  }

  const handleEdit = async (data: any) => {
    setLoading(true)
    // TODO: Edit ticket logic
    setTimeout(() => {
      setLoading(false)
      setEditOpen(null)
      // Optionally update ticket list
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button>Add New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm mode="add" loading={loading} onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm text-gray-600">Used</p>
                <p className="text-2xl font-bold">{stats.used}</p>
              </div>
              <Badge variant="secondary">Used</Badge>
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
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by code or holder..."
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
      {/* Ticket Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>Manage all tickets in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Holder</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.code}</TableCell>
                    <TableCell>{events.find(ev => ev.id === ticket.eventId)?.title || "-"}</TableCell>
                    <TableCell>{ticket.holder}</TableCell>
                    <TableCell>
                      <Badge variant={ticket.status === "Active" ? "default" : ticket.status === "Used" ? "secondary" : "destructive"}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/admin/ticket/${ticket.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => { setEditTicket(ticket); setEditOpen(ticket.id); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(ticket.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">No tickets found.</TableCell>
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
      {editTicket && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm mode="edit" initialData={editTicket} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
