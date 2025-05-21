"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Ticket, Calendar, MapPin, Search, Filter, Download, ArrowUpDown } from "lucide-react"
import Link from "next/link"

// Sample ticket data
const sampleTickets = [
  {
    id: "ticket-1",
    eventName: "Tech Innovation Summit",
    eventDate: "June 15, 2025",
    eventTime: "9:00 AM - 5:00 PM",
    venue: "Kigali Convention Center",
    ticketType: "VIP",
    ticketPrice: "$150",
    ticketStatus: "upcoming",
  },
  {
    id: "ticket-2",
    eventName: "Annual Business Conference",
    eventDate: "July 22, 2025",
    eventTime: "10:00 AM - 4:00 PM",
    venue: "Marriott Hotel",
    ticketType: "Standard",
    ticketPrice: "$75",
    ticketStatus: "upcoming",
  },
  {
    id: "ticket-3",
    eventName: "Music Festival",
    eventDate: "August 5, 2025",
    eventTime: "4:00 PM - 11:00 PM",
    venue: "Amahoro Stadium",
    ticketType: "General Admission",
    ticketPrice: "$45",
    ticketStatus: "upcoming",
  },
  {
    id: "ticket-4",
    eventName: "Startup Pitch Day",
    eventDate: "May 10, 2025",
    eventTime: "1:00 PM - 6:00 PM",
    venue: "Innovation Hub",
    ticketType: "Standard",
    ticketPrice: "$25",
    ticketStatus: "past",
  },
  {
    id: "ticket-5",
    eventName: "Art Exhibition Opening",
    eventDate: "April 28, 2025",
    eventTime: "6:00 PM - 9:00 PM",
    venue: "National Art Gallery",
    ticketType: "Standard",
    ticketPrice: "$15",
    ticketStatus: "past",
  },
]

export default function TicketsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Filter tickets based on active tab and search query
  const filteredTickets = sampleTickets.filter(
    (ticket) =>
      ticket.ticketStatus === activeTab &&
      (searchQuery === "" ||
        ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.venue.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="tickets" />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-purple-50 py-16">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl">
            <h1 className="text-4xl font-bold mb-4">My Tickets</h1>
            <p className="text-gray-600">View and manage your event tickets.</p>
          </div>
        </div>

        {/* Tickets Content */}
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "past"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past
            </button>
          </div>

          {/* Tickets List */}
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Ticket className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No {activeTab} tickets found</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming event tickets. Browse events to purchase tickets."
                  : "You don't have any past event tickets."}
              </p>
              {activeTab === "upcoming" && (
                <Link href="/events" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                  Browse Events
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Event Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2">{ticket.eventName}</h3>
                      <div className="flex flex-col space-y-2 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {ticket.eventDate} • {ticket.eventTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{ticket.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Info */}
                    <div className="flex flex-col md:items-end justify-between">
                      <div className="flex flex-col md:items-end">
                        <span className="text-sm text-gray-500">Ticket Type</span>
                        <span className="font-medium">{ticket.ticketType}</span>
                      </div>
                      <div className="flex flex-col md:items-end mt-2 md:mt-0">
                        <span className="text-sm text-gray-500">Price</span>
                        <span className="font-medium">{ticket.ticketPrice}</span>
                      </div>
                      <button className="flex items-center mt-4 text-purple-600 hover:text-purple-800">
                        <Download className="h-4 w-4 mr-1" />
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
