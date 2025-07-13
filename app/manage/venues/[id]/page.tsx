"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Users, DollarSign, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

// Sample venue data
const venuesData = [
  {
    id: "grand-conference-hall",
    name: "Grand Conference Hall",
    address: "123 Main Street, City Center",
    capacity: 500,
    pricePerHour: 1000,
    bookings: 8,
    image: "/main.png",
    description: "A spacious venue perfect for large conferences and events.",
    amenities: ["Wi-Fi", "Projector", "Sound System", "Catering"],
    totalBookings: 12,
    pendingApprovals: 2,
    totalRevenue: 12000,
    upcomingBookings: [
      {
        id: "booking-3",
        event: "Product Launch",
        customer: "Tech Startup",
        date: "5/20/2025",
        time: "10:00-13:00",
        status: "Approved",
      },
    ],
  },
  {
    id: "riverside-meeting-room",
    name: "Riverside Meeting Room",
    address: "45 River Road, Waterfront",
    capacity: 50,
    pricePerHour: 200,
    bookings: 3,
    image: "/main.png",
    description: "A comfortable meeting room with a beautiful view of the river.",
    amenities: ["Wi-Fi", "Whiteboard", "Coffee Machine"],
    totalBookings: 3,
    pendingApprovals: 0,
    totalRevenue: 1200,
    upcomingBookings: [],
  },
  {
    id: "downtown-studio",
    name: "Downtown Studio",
    address: "78 Urban Avenue, Downtown",
    capacity: 100,
    pricePerHour: 350,
    bookings: 1,
    image: "/main.png",
    description: "A modern studio space perfect for workshops and creative events.",
    amenities: ["Wi-Fi", "Sound System", "Projector", "Accessibility"],
    totalBookings: 1,
    pendingApprovals: 1,
    totalRevenue: 1050,
    upcomingBookings: [],
  },
]

export default function VenueDetailsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [venue, setVenue] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Fetch venue data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVenue = () => {
      setLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const foundVenue = venuesData.find((v) => v.id === id)
        setVenue(foundVenue || null)
        setLoading(false)
      }, 500)
    }

    if (id) {
      fetchVenue()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="ml-44 flex-1 bg-white">
          <div className="p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className=" ml-44 flex-1 bg-white">
          <div className="p-8">
            <Link href="/manage/venues/myvenues" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venues
            </Link>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Venue Not Found</h1>
              <p className="text-gray-600 mb-6">The venue you're looking for doesn't exist or has been removed.</p>
              <Link href="/manage/venues/myvenues" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Return to Venues
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="ml-44 flex-1 bg-white">
         <div className="flex items-center justify-between m-8">
            <div className="flex items-center">
              <Link href="/manage/venues/myvenues" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">{venue.name}</h1>
            </div>

            <div className="flex gap-2">
              <Link
                href="#"
                className="flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Book this venue
              </Link>
              <Link
                href={`/manage/venues/${id}/edit`}
                className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-md px-5 py-2 rounded-lg"
              >
                <Edit className="h-4 w-4" />
                Edit Venue
              </Link>
            </div>
          </div>


          {/* Statistics Card Section: Shows total bookings, pending approvals, and total revenue for the venue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 m-8">
          <div className="bg-white border rounded-lg p-6 flex items-center gap-4 shadow-sm">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{venue.totalBookings}</p>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-6 flex items-center gap-4 shadow-sm">
            <Eye className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold">{venue.pendingApprovals}</p>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-6 flex items-center gap-4 shadow-sm">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">${venue.totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="p-8">
         

          

          <div className=" w-full">
            {/* Venue Details */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg overflow-hidden">
                <h2 className="text-lg font-bold p-4 border-b">Venue Details</h2>
                <div className="p-4">
                  <div className="mb-6">
                    <img
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium">{venue.capacity} people</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">${venue.pricePerHour}/hour</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities.map((amenity: string) => (
                        <span key={amenity} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{venue.description}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Address</h3>
                    <p className="text-gray-700">{venue.address}</p>
                  </div>
                </div>
              </div>
            </div>

          
          </div>

          {/* Bookings */}
          <div className="mt-8">
            <div className="border-b mb-6">
              <div className="flex -mb-px">
                <button
                  className={`px-6 py-2 font-medium text-sm border-b-2 ${
                    activeTab === "upcoming"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming Bookings
                </button>
                <button
                  className={`px-6 py-2 font-medium text-sm border-b-2 ${
                    activeTab === "pending"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending Approvals
                </button>
                <button
                  className={`px-6 py-2 font-medium text-sm border-b-2 ${
                    activeTab === "past"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("past")}
                >
                  Past Bookings
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
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
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {venue.upcomingBookings.filter((booking: any) => {
                    if (activeTab === "upcoming") return booking.status === "Approved"
                    if (activeTab === "pending") return booking.status === "Pending"
                    return false // For past bookings, we'd need to check dates
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
                          <p className="text-gray-500">
                            {activeTab === "upcoming"
                              ? "You don't have any upcoming bookings."
                              : activeTab === "pending"
                                ? "You don't have any pending approvals."
                                : "You don't have any past bookings."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    venue.upcomingBookings
                      .filter((booking: any) => {
                        if (activeTab === "upcoming") return booking.status === "Approved"
                        if (activeTab === "pending") return booking.status === "Pending"
                        return false // For past bookings, we'd need to check dates
                      })
                      .map((booking: any) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.event}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.customer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.date}</div>
                            <div className="text-sm text-gray-500">{booking.time}</div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
