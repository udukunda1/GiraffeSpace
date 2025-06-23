"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Users, Building2, MapPin, Link2 } from "lucide-react"
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

// Mock organization data
const organizations = [
  { id: "1", name: "Org Alpha", type: "Event", assigned: "Event A", contact: "alpha@email.com", status: "Active" },
  { id: "2", name: "Org Beta", type: "Venue", assigned: "Venue X", contact: "beta@email.com", status: "Inactive" },
  { id: "3", name: "Org Gamma", type: "Event", assigned: "Event B", contact: "gamma@email.com", status: "Active" },
  { id: "4", name: "Org Delta", type: "Venue", assigned: "Venue Y", contact: "delta@email.com", status: "Active" },
]

function OrganizationForm({ initialData, onSubmit, loading, mode }: {
  initialData?: any,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    assigned: initialData?.assigned || '',
    contact: initialData?.contact || '',
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
      <Input placeholder="Organization Name" name="name" value={form.name} onChange={handleChange} required />
      <Select value={form.type} onValueChange={val => setForm(f => ({ ...f, type: val }))} required>
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Event">Event</SelectItem>
          <SelectItem value="Venue">Venue</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Assigned to (Event or Venue)" name="assigned" value={form.assigned} onChange={handleChange} required />
      <Input placeholder="Contact Email" name="contact" value={form.contact} onChange={handleChange} required />
      <Select value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val }))} required>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Organization' : 'Save Changes')}</Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminOrganization() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editOrg, setEditOrg] = useState<any>(null)

  // Statistics
  const stats = {
    totalOrganizations: organizations.length,
    active: organizations.filter(o => o.status === "Active").length,
    inactive: organizations.filter(o => o.status === "Inactive").length,
    eventAssigned: organizations.filter(o => o.type === "Event").length,
    venueAssigned: organizations.filter(o => o.type === "Venue").length,
  }

  // Filtered organizations
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || org.assigned.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || org.type === filterType
    const matchesStatus = filterStatus === "all" || org.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    setLoading(true)
    // TODO: Add organization logic
    setTimeout(() => {
      setLoading(false)
      setAddOpen(false)
      // Optionally update organization list
    }, 1000)
  }
  const handleEdit = async (data: any) => {
    setLoading(true)
    // TODO: Edit organization logic
    setTimeout(() => {
      setLoading(false)
      setEditOpen(null)
      // Optionally update organization list
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Organization Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New Organization</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Organization</DialogTitle>
                    </DialogHeader>
                    <OrganizationForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Organizations</p>
                        <p className="text-2xl font-bold">{stats.totalOrganizations}</p>
                        <p className="text-sm text-gray-500 mt-1">Active: {stats.active} • Inactive: {stats.inactive}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Assigned to Events</p>
                        <p className="text-2xl font-bold">{stats.eventAssigned}</p>
                      </div>
                      <Link2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Assigned to Venues</p>
                        <p className="text-2xl font-bold">{stats.venueAssigned}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Inactive Organizations</p>
                        <p className="text-2xl font-bold">{stats.inactive}</p>
                      </div>
                      <MapPin className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Organizations Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name or assignment..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Venue">Venue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Assigned</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrganizations.map(org => (
                          <TableRow key={org.id}>
                            <TableCell>{org.name}</TableCell>
                            <TableCell>{org.type}</TableCell>
                            <TableCell>{org.assigned}</TableCell>
                            <TableCell>{org.contact}</TableCell>
                            <TableCell>{org.status}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="icon" variant="outline" onClick={() => router.push(`/admin/organization/${org.id}`)}><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="outline" onClick={() => { setEditOrg(org); setEditOpen(org.id); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => {/* TODO: handle delete */}}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
      {editOrg && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
            </DialogHeader>
            <OrganizationForm mode="edit" initialData={editOrg} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 