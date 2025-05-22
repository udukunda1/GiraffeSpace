"use client"

import { useAuth } from "@/components/providers"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

// Sample booking data
const bookingsData = [
  {
    id: "booking-1",
    event: "Corporate Meeting",
    customer: "Acme Inc.",
    customerEmail: "events@acmeinc.com",
    venue: "Grand Conference Hall",
    date: "5/15/2025",
    time: "09:00-11:00",
    status: "Pending",
  },
  {
    id: "booking-2",
    event: "Team Building",
    customer: "Marketing Agency",
    customerEmail: "team@marketingagency.com",
    venue: "Riverside Meeting Room",
    date: "5/16/2025",
    time: "14:00-16:00",
    status: "Approved",
  },
  {
    id: "booking-3",
    event: "Product Launch",
    customer: "Tech Startup",
    customerEmail: "events@techstartup.com",
    venue: "Grand Conference Hall",
    date: "5/20/2025",
    time: "10:00-13:00",
    status: "Approved",
  },
  {
    id: "booking-4",
    event: "Annual Conference",
    customer: "Industry Association",
    customerEmail: "conference@association.org",
    venue: "Grand Conference Hall",
    date: "6/10/2025",
    time: "09:00-17:00",
    status: "Approved",
  },
  {
    id: "booking-5",
    event: "Workshop",
    customer: "Educational Institute",
    customerEmail: "workshops@education.edu",
    venue: "Downtown Studio",
    date: "5/25/2025",
    time: "13:00-16:00",
    status: "Pending",
  },
]

export default function BookingRequestsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get("status") || "all"
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Filter bookings based on search query and status
  const filteredBookings = bookingsData.filter((booking) => {
    const matchesSearch =
      booking.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.venue.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  return (
    <>
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-white">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Booking Requests</h1>
            <p className="text-gray-600">Manage and approve booking requests for your venues</p>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none w-40 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 pr-8"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Approved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Filter</button>
          </div>

          {/* Bookings Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.event}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.customer}</div>
                      <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.venue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.date}</div>
                      <div className="text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === "Pending" ? (
                        <div className="flex space-x-2">
                          <button className="text-green-600 hover:text-green-900">
                            <Check className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}
