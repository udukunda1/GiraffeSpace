"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Layers, Building2, CheckCircle, XCircle, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock resource data
const resources = [
  { id: "1", name: "Projector", venue: "Venue X", status: "Available" },
  { id: "2", name: "Sound System", venue: "Venue Y", status: "In Use" },
  { id: "3", name: "Microphone", venue: "Venue Z", status: "Available" },
  { id: "4", name: "Stage Lights", venue: "Venue X", status: "Maintenance" },
]

export default function AdminResource() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10

  // Statistics
  const stats = {
    total: resources.length,
    available: resources.filter(r => r.status === "Available").length,
    inUse: resources.filter(r => r.status === "In Use").length,
    maintenance: resources.filter(r => r.status === "Maintenance").length,
  }

  // Filtered resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || resource.venue.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || resource.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const paginatedResources = filteredResources.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Resource Management</h2>
                <Button onClick={() => router.push("/admin/resource/add")}>Add New Resource</Button>
              </div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Resources</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <Layers className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="text-2xl font-bold">{stats.available}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">In Use</p>
                        <p className="text-2xl font-bold">{stats.inUse}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Maintenance</p>
                        <p className="text-2xl font-bold">{stats.maintenance}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Resources Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by resource or venue..."
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
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Resource</TableHead>
                          <TableHead>Venue</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedResources.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                              No resources found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedResources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell>{resource.name}</TableCell>
                              <TableCell>{resource.venue}</TableCell>
                              <TableCell>
                                <Badge variant={resource.status === "Available" ? "default" : resource.status === "In Use" ? "secondary" : "outline"}>
                                  {resource.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex space-x-2">
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/resource/${resource.id}`)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="outline" onClick={() => router.push(`/admin/resource/${resource.id}/edit`)}>
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