"use client"

import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
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
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9m7QZsRVcRP5PzKB678XCzqRchcPk8.png",
  },
  {
    id: "riverside-meeting-room",
    name: "Riverside Meeting Room",
    address: "45 River Road, Waterfront",
    capacity: 50,
    pricePerHour: 200,
    bookings: 3,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9m7QZsRVcRP5PzKB678XCzqRchcPk8.png",
  },
  {
    id: "downtown-studio",
    name: "Downtown Studio",
    address: "78 Urban Avenue, Downtown",
    capacity: 100,
    pricePerHour: 350,
    bookings: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9m7QZsRVcRP5PzKB678XCzqRchcPk8.png",
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

  // Filter venues based on search query
  const filteredVenues = venuesData.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Venues</h1>
              <p className="text-gray-600">Manage your venues and their availability</p>
            </div>

            <Link
              href="/manage/venues/create"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              <span className="text-lg">+</span>
              Add New Venue
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex mb-8">
            <input
              type="text"
              placeholder="Search venues..."
              className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-200">Search</button>
          </div>

          {/* Venues Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-lg border overflow-hidden">
                <div className="h-48 relative">
                  <img
                    src={venue.image || "/placeholder.svg"}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{venue.name}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <span className="sr-only">More options</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 10.8333C10.4603 10.8333 10.8334 10.4602 10.8334 9.99998C10.8334 9.53974 10.4603 9.16665 10 9.16665C9.53978 9.16665 9.16669 9.53974 9.16669 9.99998C9.16669 10.4602 9.53978 10.8333 10 10.8333Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.8334 10.8333C16.2936 10.8333 16.6667 10.4602 16.6667 9.99998C16.6667 9.53974 16.2936 9.16665 15.8334 9.16665C15.3731 9.16665 15 9.53974 15 9.99998C15 10.4602 15.3731 10.8333 15.8334 10.8333Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.16669 10.8333C4.62693 10.8333 5.00002 10.4602 5.00002 9.99998C5.00002 9.53974 4.62693 9.16665 4.16669 9.16665C3.70645 9.16665 3.33336 9.53974 3.33336 9.99998C3.33336 10.4602 3.70645 10.8333 4.16669 10.8333Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 inline" />
                    {venue.address}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium">{venue.capacity} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${venue.pricePerHour}/hour</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{venue.bookings} bookings</p>
                    <Link
                      href={`/manage/venues/${venue.id}`}
                      className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-md text-sm font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
