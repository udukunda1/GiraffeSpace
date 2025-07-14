"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import Link from "next/link"
import { Header } from "@/components/header"
import {  useMemo } from "react"
import { MapPin, Edit, Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



// Sample venue data
const venuesData = [
  {
    id: "grand-conference-hall",
    name: "Grand Conference Hall",
    address: "123 Main Street, City Center",
    capacity: 500,
    pricePerHour: 1000,
    bookings: 8,
    status: "Active",
    type: "Conference",
    image: "/main.png",
  },
  {
    id: "riverside-meeting-room",
    name: "Riverside Meeting Room",
    address: "45 River Road, Waterfront",
    capacity: 50,
    pricePerHour: 200,
    bookings: 3,
    status: "Active",
    type: "Meeting",
    image: "/main.png",
  },
  {
    id: "downtown-studio",
    name: "Downtown Studio",
    address: "78 Urban Avenue, Downtown",
    capacity: 100,
    pricePerHour: 350,
    bookings: 1,
    status: "Inactive",
    type: "Studio",
    image: "/main.png",
  },
  {
    id: "luxury-ballroom",
    name: "Luxury Ballroom",
    address: "90 Elite Street, Uptown",
    capacity: 300,
    pricePerHour: 800,
    bookings: 12,
    status: "Active",
    type: "Event",
    image: "/main.png",
  },
  {
    id: "creative-workspace",
    name: "Creative Workspace",
    address: "56 Innovation Drive, Tech District",
    capacity: 75,
    pricePerHour: 250,
    bookings: 5,
    status: "Active",
    type: "Workspace",
    image: "/main.png",
  },
  {
    id: "outdoor-pavilion",
    name: "Outdoor Pavilion",
    address: "12 Garden Lane, Park Area",
    capacity: 200,
    pricePerHour: 400,
    bookings: 2,
    status: "Inactive",
    type: "Outdoor",
    image: "/main.png",
  },
  {
    id: "boardroom-executive",
    name: "Executive Boardroom",
    address: "34 Corporate Plaza, Business District",
    capacity: 20,
    pricePerHour: 150,
    bookings: 7,
    status: "Active",
    type: "Boardroom",
    image: "/main.png",
  },
  {
    id: "rooftop-lounge",
    name: "Rooftop Lounge",
    address: "88 Sky Tower, Downtown",
    capacity: 150,
    pricePerHour: 600,
    bookings: 4,
    status: "Active",
    type: "Lounge",
    image: "/main.png",
  },
]

export default function ManageVenuesPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])


  const ITEMS_PER_PAGE = 5
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Get unique types for filter
  const venueTypes = [...new Set(venuesData.map(venue => venue.type))]

  // Filter and search venues
  const filteredVenues = useMemo(() => {
    return venuesData.filter((venue) => {
      const matchesSearch = 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || venue.status.toLowerCase() === statusFilter
      const matchesType = typeFilter === "all" || venue.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [searchQuery, statusFilter, typeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredVenues.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVenues = filteredVenues.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleEdit = (venueId: string) => {
    console.log("Edit venue:", venueId)
    // TODO: Navigate to edit page
  }

  const handleView = (venueId: string) => {
    console.log("View venue:", venueId)
    // TODO: Navigate to view page
  }

  const handleDelete = (venueId: string) => {
    console.log("Delete venue:", venueId)
    // TODO: Implement delete functionality
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary"
  }

  return (
    <>
    <div className="min-h-screen flex">
      {/* <Sidebar /> */}

      <main className="flex-1 bg-white ml-44 p-4">
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Venues</h1>
            <p className="text-muted-foreground">Manage your venues and their availability</p>
          </div>
          <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-md px-5 py-2 rounded-lg">
          
            <Link href="manage/venues/create">
              <span className="text-lg">+</span>
            Add New Venue</Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search venues..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  handleFilterChange()
                }}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              handleFilterChange()
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value)
              handleFilterChange()
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {venueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>Venue</TableHead>
                
               
                <TableHead>Price</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Type</TableHead>
               
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVenues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-14 h-14 rounded-lg object-cover border shadow-sm"
                      />
                      <div>
                        <div className="font-medium">{venue.name}</div>
                      </div>
                    </div>
                  </TableCell>
                 
                
                  <TableCell>${venue.pricePerHour}</TableCell>
                  <TableCell>{venue.bookings}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{venue.type}</Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <div className="group relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(venue.id)}
                          className="h-8 w-8 p-0"
                        >
                                <Link
                      href={`/manage/venues/${venue.id}`}
                      
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                          
                        </Button>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-1 w-max px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">View</span>
                      </div>
                      <div className="group relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(venue.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-1 w-max px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">Edit</span>
                      </div>
                      <div className="group relative">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Venue</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{venue.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(venue.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-1 w-max px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">Delete</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-2">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredVenues.length} total venues
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
 
      </main>
    </div>
    </>
  )
}
