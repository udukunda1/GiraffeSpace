"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, ChevronDown, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// This would normally come from a database
const events = [
  {
    id: "tech-conference",
    title: "Annual Tech Conference",
    type: "Conference",
    typeColor: "blue",
    date: "April 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    registeredCount: 145,
    imageSrc: "/techconference.png",
  },
  {
    id: "cultural-festival",
    title: "Cultural Festival",
    type: "Festival",
    typeColor: "purple",
    date: "April 20, 2025",
    time: "10:00 AM - 8:00 PM",
    location: "University Grounds",
    registeredCount: 320,
    imageSrc: "/cultural.png",
  },
  {
    id: "research-symposium",
    title: "Research Symposium",
    type: "Academic",
    typeColor: "green",
    date: "April 25, 2025",
    time: "1:00 PM - 6:00 PM",
    location: "Science Building",
    registeredCount: 78,
    imageSrc: "/research.png",
  },
  {
    id: "career-fair",
    title: "Career Fair",
    type: "Networking",
    typeColor: "blue",
    date: "May 5, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Business School",
    registeredCount: 210,
    imageSrc: "/career.png",
  },
  {
    id: "alumni-meetup",
    title: "Alumni Meetup",
    type: "Networking",
    typeColor: "blue",
    date: "May 12, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "University Club",
    registeredCount: 95,
    imageSrc: "/alumni.png?height=300&width=400",
  },
  {
    id: "sports-tournament",
    title: "Sports Tournament",
    type: "Sports",
    typeColor: "green",
    date: "May 18-20, 2025",
    time: "All Day",
    location: "Sports Complex",
    registeredCount: 180,
    imageSrc: "/sports.png?height=300&width=400",
  },
]

export default function EventsPage() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All categories")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const categoryOptions = [
    "All categories",
    "Conference",
    "Festival",
    "Academic",
    "Networking",
    "Sports",
    "Workshop",
    "Seminar",
  ]

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setIsCategoryOpen(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Select date"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="events" />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-purple-50 py-16">
          <div className="container mx-auto px-16 max-w-7xl text-center">
            <h1 className="text-4xl font-bold mb-4">Events</h1>
            <p className="text-gray-600">Browse and register for upcoming events at the University of Rwanda.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-16 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center justify-between gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white min-w-[160px]"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                    <ul className="py-1">
                      {categoryOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleCategorySelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="relative">
                <button
                  className="flex items-center justify-between gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white min-w-[160px]"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(selectedDate)}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDatePickerOpen && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                    <input
                      type="date"
                      className="border rounded-md p-2"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                        setIsDatePickerOpen(false)
                      }}
                    />
                  </div>
                )}
              </div>

              <button className="bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-800">Create Event</button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="container mx-auto px-16 max-w-7xl pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow">
                <div className="h-48 relative">
                  <Image src={event.imageSrc || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2 
                    ${event.type === "Conference" ? "bg-blue-100 text-blue-800" : ""}
                    ${event.type === "Festival" ? "bg-purple-100 text-purple-800" : ""}
                    ${event.type === "Academic" ? "bg-green-100 text-green-800" : ""}
                    ${event.type === "Networking" ? "bg-blue-100 text-blue-800" : ""}
                    ${event.type === "Sports" ? "bg-green-100 text-green-800" : ""}
                  `}
                  >
                    {event.type}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.registeredCount} registered</span>
                    </div>
                  </div>
                  <Link href={`/events/${event.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
