"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import ApiService from "@/api/apiConfig"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 5

export default function AdminOverview() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([])
  const [venues, setVenues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [eventPage, setEventPage] = useState(1)
  const [venuePage, setVenuePage] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      ApiService.getAllEvents(),
      ApiService.getAllVenues(),
    ])
      .then(([eventsRes, venuesRes]) => {
        setEvents(Array.isArray(eventsRes) ? eventsRes : (eventsRes.data || []))
        setVenues(Array.isArray(venuesRes) ? venuesRes : (venuesRes.data || []))
      })
      .catch((err) => {
        setError("Failed to load data.")
      })
      .finally(() => setLoading(false))
  }, [])

  // Filter for pending status
  const pendingEvents = events.filter((event) => (event.status?.toUpperCase?.() === "PENDING" || event.status?.toUpperCase?.() === "DRAFT"))
  const pendingVenues = venues.filter((venue) => venue.status?.toUpperCase?.() === "PENDING")

  // Pagination logic
  const totalEventPages = Math.max(1, Math.ceil(pendingEvents.length / ITEMS_PER_PAGE))
  const totalVenuePages = Math.max(1, Math.ceil(pendingVenues.length / ITEMS_PER_PAGE))
  const paginatedEvents = pendingEvents.slice((eventPage - 1) * ITEMS_PER_PAGE, eventPage * ITEMS_PER_PAGE)
  const paginatedVenues = pendingVenues.slice((venuePage - 1) * ITEMS_PER_PAGE, venuePage * ITEMS_PER_PAGE)

  // Approve/Reject handlers
  const handleApproveEvent = async (eventId: string) => {
    try {
      await ApiService.updateEventById(eventId, { status: "APPROVED" })
      setEvents((prev) => prev.map(e => e.eventId === eventId ? { ...e, status: "APPROVED" } : e))
      toast({ title: "Event Approved", description: "The event has been approved." })
    } catch {
      toast({ title: "Error", description: "Failed to approve event.", variant: "destructive" })
    }
  }
  const handleRejectEvent = async (eventId: string) => {
    try {
      await ApiService.updateEventById(eventId, { status: "REJECTED" })
      setEvents((prev) => prev.map(e => e.eventId === eventId ? { ...e, status: "REJECTED" } : e))
      toast({ title: "Event Rejected", description: "The event has been rejected." })
    } catch {
      toast({ title: "Error", description: "Failed to reject event.", variant: "destructive" })
    }
  }
  const handleApproveVenue = async (venueId: string) => {
    try {
      await ApiService.approveVenue(venueId)
      setVenues((prev) => prev.map(v => v.venueId === venueId ? { ...v, status: "APPROVED", isAvailable: true } : v))
      toast({ title: "Venue Approved", description: "The venue has been approved." })
    } catch {
      toast({ title: "Error", description: "Failed to approve venue.", variant: "destructive" })
    }
  }
  const handleRejectVenue = async (venueId: string) => {
    try {
      await ApiService.cancelVenue(venueId, { status: "REJECTED", isAvailable: false })
      setVenues((prev) => prev.map(v => v.venueId === venueId ? { ...v, status: "REJECTED", isAvailable: false } : v))
      toast({ title: "Venue Rejected", description: "The venue has been rejected." })
    } catch {
      toast({ title: "Error", description: "Failed to reject venue.", variant: "destructive" })
    }
  }

  // Statistics (optional, can be improved with real data)
  const stats = {
    totalEvents: events.length,
    totalVenues: venues.length,
    pendingApprovals: pendingEvents.length + pendingVenues.length,
    approvedEvents: events.filter((event) => event.status?.toUpperCase?.() === "APPROVED").length,
    approvedVenues: venues.filter((venue) => venue.status?.toUpperCase?.() === "APPROVED").length,
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Venues</p>
                <p className="text-2xl font-bold">{stats.totalVenues}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Events</p>
                <p className="text-2xl font-bold">{stats.approvedEvents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Venues</p>
                <p className="text-2xl font-bold">{stats.approvedVenues}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pending Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pending Event Approvals
              </CardTitle>
              <CardDescription>Events waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event) => (
                    <div
                      key={event.eventId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{event.eventTitle}</p>
                        <p className="text-sm text-gray-600">{event.startDate ? new Date(event.startDate).toLocaleDateString() : "-"}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleApproveEvent(event.eventId)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectEvent(event.eventId)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending event approvals</p>
                )}
              </div>
              {/* Pagination controls */}
              {totalEventPages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" disabled={eventPage === 1} onClick={() => setEventPage(eventPage - 1)}>Previous</Button>
                  <span className="px-2 py-1 text-sm">Page {eventPage} of {totalEventPages}</span>
                  <Button size="sm" variant="outline" disabled={eventPage === totalEventPages} onClick={() => setEventPage(eventPage + 1)}>Next</Button>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Pending Venues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pending Venue Approvals
              </CardTitle>
              <CardDescription>Venues waiting for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedVenues.length > 0 ? (
                  paginatedVenues.map((venue) => (
                    <div
                      key={venue.venueId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{venue.venueName}</p>
                        <p className="text-sm text-gray-600">
                          {venue.location} • Capacity: {venue.capacity}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleApproveVenue(venue.venueId)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectVenue(venue.venueId)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending venue approvals</p>
                )}
              </div>
              {/* Pagination controls */}
              {totalVenuePages > 1 && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" disabled={venuePage === 1} onClick={() => setVenuePage(venuePage - 1)}>Previous</Button>
                  <span className="px-2 py-1 text-sm">Page {venuePage} of {totalVenuePages}</span>
                  <Button size="sm" variant="outline" disabled={venuePage === totalVenuePages} onClick={() => setVenuePage(venuePage + 1)}>Next</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 