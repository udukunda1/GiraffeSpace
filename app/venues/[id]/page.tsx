"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Users, Calendar, Clock, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// This would normally come from a database
const getVenueData = (id: string) => {
  const venues = {
    "main-auditorium": {
      name: "Main Auditorium",
      location: "Main Campus, Block A",
      address: "University of Rwanda, Kigali",
      capacity: 500,
      amenities: ["Projector", "Sound System", "Air Conditioning", "Stage", "Wi-Fi", "Microphones", "Lighting"],
      description:
        "The Main Auditorium is a spacious venue perfect for large conferences, ceremonies, and performances. It features a large stage, professional sound system, and comfortable seating for up to 500 attendees.",
      rules: [
        "No food or drinks inside the auditorium",
        "No smoking",
        "All equipment must be returned in original condition",
        "Booking must be made at least 3 days in advance",
      ],
      availability: [
        { date: "May 15, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
        { date: "May 16, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
        { date: "May 17, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
      ],
      imageSrc: "/main.png?height=500&width=1000",
    },
    "science-building-conference-room": {
      name: "Science Building Conference Room",
      location: "Science Campus, Block C",
      address: "University of Rwanda, Science Campus, Kigali",
      capacity: 150,
      amenities: ["Projector", "Whiteboard", "Video Conferencing", "Wi-Fi", "Air Conditioning"],
      description:
        "Modern conference room located in the Science Building. Equipped with the latest video conferencing technology, making it ideal for meetings, presentations, and small conferences.",
      rules: [
        "No food or drinks near electronic equipment",
        "No smoking",
        "All equipment must be returned in original condition",
        "Booking must be made at least 2 days in advance",
      ],
      availability: [
        { date: "May 15, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
        { date: "May 16, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
        { date: "May 17, 2025", timeSlots: ["9:00 AM - 12:00 PM", "1:00 PM - 5:00 PM"] },
      ],
      imageSrc: "/muhabura.png?height=500&width=1000",
    },
    "university-grounds": {
      name: "University Grounds",
      location: "Main Campus",
      address: "University of Rwanda, Kigali",
      capacity: 2000,
      amenities: ["Open Space", "Power Supply", "Parking", "Restrooms"],
      description:
        "Spacious outdoor area perfect for large gatherings, festivals, and outdoor activities. The grounds can accommodate up to 2000 people and offer beautiful green spaces.",
      rules: [
        "Clean up after your event",
        "No damage to grass or plants",
        "Noise restrictions after 10:00 PM",
        "Booking must be made at least 5 days in advance",
      ],
      availability: [
        { date: "May 15, 2025", timeSlots: ["8:00 AM - 8:00 PM"] },
        { date: "May 16, 2025", timeSlots: ["8:00 AM - 8:00 PM"] },
        { date: "May 17, 2025", timeSlots: ["8:00 AM - 8:00 PM"] },
      ],
      imageSrc: "/grounds.png?height=500&width=1000",
    },
  }

  return venues[id as keyof typeof venues]
}

export default function VenuePage({ params }: { params: { id: string } }) {
  const venue = getVenueData(params.id)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")

  if (!venue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header activePage="venues" />
        <main className="flex-1 container mx-auto px-16 py-8">
          <h1 className="text-3xl font-bold mb-4">Venue Not Found</h1>
          <p className="mb-8">The venue you're looking for doesn't exist or has been removed.</p>
          <Link href="/venues" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Venues
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  // Generate time slots based on selected date
  const getTimeSlots = () => {
    if (!selectedDate) return []

    const matchingDay = venue.availability.find(
      (day) => new Date(day.date).toISOString().split("T")[0] === selectedDate,
    )

    return matchingDay ? matchingDay.timeSlots : []
  }

  const timeSlots = getTimeSlots()

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="venues" />

      <main className="flex-1 container mx-auto px-16 py-8 max-w-7xl">
        <Link href="/venues" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venues
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Venue Banner */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <Image
                src={venue.imageSrc || "/placeholder.svg"}
                alt={venue.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Venue Title */}
            <h1 className="text-3xl font-bold mb-6">{venue.name}</h1>

            {/* Venue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{venue.location}</p>
                  <p className="text-sm text-gray-500">{venue.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium">{venue.capacity} people</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "details"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "availability"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("availability")}
                >
                  Availability
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
              <>
                {/* About This Venue */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">About This Venue</h2>
                  <p className="text-gray-600 mb-4">{venue.description}</p>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Venue Rules</h2>
                  <ul className="space-y-2">
                    {venue.rules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mt-1 mr-2">
                          <div className="h-4 w-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-gray-600">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {activeTab === "availability" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Venue Availability</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Available Dates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {venue.availability.map((day) => (
                        <div
                          key={day.date}
                          className={`border p-3 rounded-md cursor-pointer transition-colors ${
                            selectedDate === new Date(day.date).toISOString().split("T")[0]
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedDate(new Date(day.date).toISOString().split("T")[0])}
                        >
                          <p className="font-medium">{day.date}</p>
                          <p className="text-sm text-gray-500">{day.timeSlots.length} time slots available</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot}
                            className={`border p-3 rounded-md cursor-pointer flex items-center ${
                              selectedTimeSlot === slot ? "bg-blue-50 border-blue-200" : "hover:bg-gray-100"
                            }`}
                            onClick={() => setSelectedTimeSlot(slot)}
                          >
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{slot}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
                        !selectedDate || !selectedTimeSlot ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!selectedDate || !selectedTimeSlot}
                    >
                      Book This Time Slot
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Booking Card */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Book This Venue</h2>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slot
                </label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={`w-full py-2 rounded-md mb-4 ${
                  selectedDate && selectedTimeSlot
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Book Now
              </button>
            </div>

            {/* Availability Card */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Availability</h2>
              <div className="space-y-4">
                {venue.availability.map((day) => (
                  <div key={day.date} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <p className="font-medium mb-2">{day.date}</p>
                    <div className="space-y-2">
                      {day.timeSlots.map((slot) => (
                        <div key={slot} className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{slot}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
