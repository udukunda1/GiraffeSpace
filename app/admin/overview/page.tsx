"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Home,
} from "lucide-react"
import { events } from "@/data/events"
import { venues } from "@/data/venues"
import { users } from "@/data/users"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useRouter } from "next/navigation"

// Sample data for the charts (imported from statistics page)
const eventsByCategory = [
  { name: "Conference", value: 35 },
  { name: "Workshop", value: 25 },
  { name: "Seminar", value: 20 },
  { name: "Exhibition", value: 15 },
  { name: "Other", value: 5 },
]

const eventsByStatus = [
  { name: "Upcoming", value: 45 },
  { name: "Ongoing", value: 15 },
  { name: "Completed", value: 35 },
  { name: "Cancelled", value: 5 },
]

// Colors for the charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminOverview() {
  // Mock data for pending approvals
  const pendingEvents = events.filter((event) => event.status === "Draft").slice(0, 3)
  const pendingVenues = venues.filter((venue) => !venue.isAvailable).slice(0, 3)

  // Statistics
  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    totalVenues: venues.length,
    pendingApprovals: pendingEvents.length + pendingVenues.length,
    activeEvents: events.filter((event) => event.status === "Active").length,
    completedEvents: events.filter((event) => event.status === "Completed").length,
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

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
      </div>

      {/* Pending Approvals */}
      <div className="grid md:grid-cols-2 gap-8">
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
              {pendingEvents.length > 0 ? (
                pendingEvents.map((event) => (
                  <div
                    key={event.eventId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{event.eventTitle}</p>
                      <p className="text-sm text-gray-600">{event.eventDate}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending event approvals</p>
              )}
            </div>
          </CardContent>
        </Card>

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
              {pendingVenues.length > 0 ? (
                pendingVenues.map((venue) => (
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
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No pending venue approvals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 