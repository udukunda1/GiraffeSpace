"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, ChevronDown, Search, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// This would normally come from a database
const venues = [
  {
    id: "main-auditorium",
    name: "Main Auditorium",
    location: "Main Campus, Block A",
    capacity: 500,
    amenities: ["Projector", "Sound System", "Air Conditioning", "Stage"],
    imageSrc: "/main.png?height=300&width=400",
  },
  {
    id: "science-building-conference-room",
    name: "Science Building Conference Room",
    location: "Science Campus, Block C",
    capacity: 150,
    amenities: ["Projector", "Whiteboard", "Video Conferencing"],
    imageSrc: "/muhabura.png?height=300&width=400",
  },
  {
    id: "university-grounds",
    name: "University Grounds",
    location: "Main Campus",
    capacity: 2000,
    amenities: ["Open Space", "Power Supply", "Parking"],
    imageSrc: "/grounds.png?height=300&width=400",
  },
  {
    id: "business-school-lecture-hall",
    name: "Business School Lecture Hall",
    location: "Business Campus, Block B",
    capacity: 200,
    amenities: ["Projector", "Sound System", "Air Conditioning"],
    imageSrc: "/hall.png?height=300&width=400",
  },
  {
    id: "sports-complex",
    name: "Sports Complex",
    location: "Sports Campus",
    capacity: 1000,
    amenities: ["Indoor Courts", "Changing Rooms", "Sound System"],
    imageSrc: "/sportscomplex.png?height=300&width=400",
  },
  {
    id: "library-seminar-room",
    name: "Library Seminar Room",
    location: "Main Campus, Library Building",
    capacity: 50,
    amenities: ["Projector", "Whiteboard", "Computers"],
    imageSrc: "/libsseminar.png?height=300&width=400",
  },
]

export default function VenuesPage() {
  const [isCapacityOpen, setIsCapacityOpen] = useState(false)
  const [selectedCapacity, setSelectedCapacity] = useState<string>("Any capacity")
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const capacityOptions = [
    "Any capacity",
    "Up to 50 people",
    "50-100 people",
    "100-200 people",
    "200-500 people",
    "500+ people",
  ]

  const handleCapacitySelect = (capacity: string) => {
    setSelectedCapacity(capacity)
    setIsCapacityOpen(false)
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
      <Header activePage="venues" />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-purple-50 py-16">
          <div className="container mx-auto px-16 max-w-7xl text-center">
            <h1 className="text-4xl font-bold mb-4">Venues</h1>
            <p className="text-gray-600">Browse and book venues for your events at the University of Rwanda.</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="container mx-auto px-16 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search venues..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Capacity Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center justify-between gap-2 border rounded-md px-4 py-2 text-gray-700 bg-white min-w-[160px]"
                  onClick={() => setIsCapacityOpen(!isCapacityOpen)}
                >
                  <span>{selectedCapacity}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCapacityOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                    <ul className="py-1">
                      {capacityOptions.map((option) => (
                        <li
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleCapacitySelect(option)}
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

              <button className="bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-800">
                Create New Venue
              </button>
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="container mx-auto px-16 max-w-7xl pb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow">
                <div className="h-48 relative">
                  <Image src={venue.imageSrc || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{venue.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Link href={`/venues/${venue.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
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
