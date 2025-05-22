"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, Plus, Filter, ChevronDown, Users, MapPin, Clock } from "lucide-react"
import Link from "next/link"

// Sample event data with updated status values
const sampleEvents = [
  {
    id: "event-1",
    name: "Annual Conference",
    date: "April 15, 2025",
    venue: "Main Conference Hall",
    registrations: 145,
    capacity: 300,
    status: "published", // approved by admin
  },
  {
    id: "event-2",
    name: "Product Launch",
    date: "April 20, 2025",
    venue: "Exhibition Center",
    registrations: 78,
    capacity: 150,
    status: "pending", // pending admin approval
  },
  {
    id: "event-3",
    name: "Team Building Retreat",
    date: "April 25, 2025",
    venue: "Mountain Resort",
    registrations: 32,
    capacity: 50,
    status: "published", // approved by admin
  },
  {
    id: "event-4",
    name: "Client Appreciation Day",
    date: "May 5, 2025",
    venue: "Company Headquarters",
    registrations: 0,
    capacity: 100,
    status: "pending", // pending admin approval
  },
]

export default function ManageEventsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("my-events")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Filter events based on status
  const filteredEvents =
    statusFilter === "all" ? sampleEvents : sampleEvents.filter((event) => event.status === statusFilter.toLowerCase())

  // Stats for the dashboard
  const stats = {
    totalEvents: 24,
    totalEventsChange: "+12%",
    totalAttendees: 1892,
    totalAttendeesChange: "+5%",
    venuesUsed: 12,
    venuesUsedChange: "+2",
    upcomingEvents: 8,
    upcomingEventsPeriod: "Next 30 days",
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Organizer Dashboard</h1>
              <p className="text-gray-600">Manage your events and track performance</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <button
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => router.push("/manage/events/create")}
              >
                <Plus className="h-4 w-4" />
                Create Event
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Events</p>
                  <h2 className="text-3xl font-bold">{stats.totalEvents}</h2>
                  <p className="text-gray-600 text-sm">{stats.totalEventsChange}</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Attendees</p>
                  <h2 className="text-3xl font-bold">{stats.totalAttendees}</h2>
                  <p className="text-gray-600 text-sm">{stats.totalAttendeesChange}</p>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Venues Used</p>
                  <h2 className="text-3xl font-bold">{stats.venuesUsed}</h2>
                  <p className="text-gray-600 text-sm">{stats.venuesUsedChange}</p>
                </div>
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Upcoming Events</p>
                  <h2 className="text-3xl font-bold">{stats.upcomingEvents}</h2>
                  <p className="text-gray-600 text-sm">{stats.upcomingEventsPeriod}</p>
                </div>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b mb-6">
            <div className="flex -mb-px">
              <button
                className={`px-6 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "my-events"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("my-events")}
              >
                My Events
              </button>
              <button
                className={`px-6 py-2 font-medium text-sm border-b-2 ${
                  activeTab === "analytics"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </div>
          </div>

          {activeTab === "my-events" && (
            <>
              {/* Events Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Events</h2>

                {/* Filter */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("all")
                            setIsStatusDropdownOpen(false)
                          }}
                        >
                          All
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("published")
                            setIsStatusDropdownOpen(false)
                          }}
                        >
                          Published
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("pending")
                            setIsStatusDropdownOpen(false)
                          }}
                        >
                          Pending
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Events Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Event
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Venue
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Registrations
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
                            <p className="text-gray-500 mb-4">
                              {statusFilter !== "all"
                                ? `You don't have any ${statusFilter.toLowerCase()} events.`
                                : "You haven't created any events yet."}
                            </p>
                            <button
                              onClick={() => router.push("/manage/events/create")}
                              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Create New Event
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{event.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{event.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{event.venue}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {event.registrations} / {event.capacity}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                event.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {event.status === "published" ? "Published" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/manage/events/${event.id}/edit`}
                              className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md mr-2"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/manage/events/${event.id}`}
                              className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Event Analytics</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Popular Events */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Most Popular Events</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Annual Conference</p>
                        <p className="text-sm text-gray-500">April 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">145 registrations</p>
                        <p className="text-sm text-green-600">48% of capacity</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "48%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Product Launch</p>
                        <p className="text-sm text-gray-500">April 20, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">78 registrations</p>
                        <p className="text-sm text-green-600">52% of capacity</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "52%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Team Building Retreat</p>
                        <p className="text-sm text-gray-500">April 25, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">32 registrations</p>
                        <p className="text-sm text-green-600">64% of capacity</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Traffic Sources</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Direct</p>
                      <p className="font-medium">45%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-medium">Social Media</p>
                      <p className="font-medium">30%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-medium">Email</p>
                      <p className="font-medium">15%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="font-medium">Other</p>
                      <p className="font-medium">10%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
