"use client"
import { useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getVenueById } from "@/data/venues"
import { notFound } from "next/navigation"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const venue = getVenueById(id)

  if (!venue) {
    notFound()
  }

  // Add mocked comments if not present
  if (!venue.comments) {
    venue.comments = [
      {
        userName: "Alice Johnson",
        userEmail: "alice@example.com",
        content: "Great venue! Spacious and clean. Would book again.",
      },
      {
        userName: "Bob Smith",
        userEmail: "bob@example.com",
        content: "The staff was very helpful and the location is perfect.",
      },
      {
        userName: "Carol Lee",
        userEmail: "carol@example.com",
        content: "Had a wonderful experience hosting our event here!",
      },
    ]
  }
  const [activeTab, setActiveTab] = useState("details")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Sample photos for the gallery (in real app, these would come from venue data)
  const photos = [
    venue.imageSrc || "/placeholder.svg",
    "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
  ]

  // Generate available dates for calendar
  const getAvailableDates = () => {
    if (!venue.availability) return []
    return venue.availability.map((day) => new Date(day.date))
  }

  const availableDates = getAvailableDates()

  // Generate time slots based on selected date
  const getTimeSlots = () => {
    if (!selectedDate || !venue.availability) return []
    const selectedDateStr = selectedDate.toISOString().split("T")[0]
    const matchingDay = venue.availability.find(
      (day) => new Date(day.date).toISOString().split("T")[0] === selectedDateStr,
    )
    return matchingDay ? matchingDay.timeSlots : []
  }

  const timeSlots = getTimeSlots()

  const amenitiesList = venue.amenities.split(",").map((amenity) => amenity.trim())

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some((availableDate) => availableDate.toDateString() === date.toDateString())
  }

  // Get the number of time slots for a specific date
  const getTimeSlotsCount = (date: Date) => {
    if (!venue.availability) return 0
    const dateStr = date.toISOString().split("T")[0]
    const matchingDay = venue.availability.find((day) => new Date(day.date).toISOString().split("T")[0] === dateStr)
    return matchingDay ? matchingDay.timeSlots.length : 0
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="venues" />
      <main className="flex-1 container mx-auto px-4 md:px-16 py-8 max-w-7xl">
        <Link href="/venues" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venues
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            <div className="mb-8">
              {/* Main Photo */}
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <Image
                  src={photos[currentPhotoIndex] || "/placeholder.svg"}
                  alt={`${venue.venueName} - Photo ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {venue.venueType}
                  </span>
                </div>
                {venue.isBooked && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Currently Booked
                    </span>
                  </div>
                )}

                {/* Photo Navigation */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Photo Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </div>
              {/* Sub Photos */}
              <div className="grid grid-cols-6 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`relative h-16 rounded-md overflow-hidden cursor-pointer transition-all ${
                      index === currentPhotoIndex ? "ring-2 ring-blue-500" : "hover:opacity-80"
                    }`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`${venue.venueName} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Title */}
            <h1 className="text-3xl font-bold mb-6">{venue.venueName}</h1>

            {/* Venue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{venue.location}</p>
                  <a
                    href={venue.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Google Maps
                  </a>
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
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">{venue.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{venue.contactPhone}</p>
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
                {venue.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">About This Venue</h2>
                    <p className="text-gray-600 mb-4">{venue.description}</p>
                  </div>
                )}

                {/* Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">{venue.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{venue.contactPhone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{venue.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Website Link */}
                {venue.websiteURL && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">More Information</h2>
                    <a
                      href={venue.websiteURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Visit Venue Website
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </>
            )}

            {activeTab === "availability" && venue.availability && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Venue Availability</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Select a Date
                      </h3>
                      <div className="bg-white p-4 rounded-lg border">
                        <CalendarComponent
                          numberOfMonths={2}
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today || !isDateAvailable(date)
                          }}
                          fromDate={new Date()}
                          className="rounded-md"
                          modifiers={{
                            available: (date) => isDateAvailable(date),
                            selected: (date) => selectedDate?.toDateString() === date.toDateString(),
                          }}
                          modifiersStyles={{
                            available: {
                              backgroundColor: "#dbeafe",
                              color: "#1d4ed8",
                              fontWeight: "bold",
                              borderRadius: "6px",
                            },
                            selected: {
                              backgroundColor: "#2563eb",
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        />
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                            <span className="text-gray-600">Available dates</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                            <span className="text-gray-600">Selected date</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                            <span className="text-gray-600">Unavailable dates</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Book This Venue</h2>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{venue.contactEmail}</span>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{venue.contactPhone}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateAvailable(date)}
                  className="rounded-md border"
                  modifiers={{
                    available: (date) => isDateAvailable(date),
                  }}
                  modifiersStyles={{
                    available: {
                      backgroundColor: "#dbeafe",
                      color: "#1d4ed8",
                      fontWeight: "bold",
                    },
                  }}
                />
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
                  disabled={venue.isBooked || !selectedDate}
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
                  selectedDate && selectedTimeSlot && !venue.isBooked
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!selectedDate || !selectedTimeSlot || venue.isBooked}
              >
                {venue.isBooked ? "Currently Booked" : "Book Now"}
              </button>
            </div>

            {/* Availability Overview */}
            {venue.availability && (
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Venue Rating & Comments</h2>
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl mr-1 focus:outline-none ${star <= (venue.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      // onClick={() => setVenueRating(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{venue.rating ? venue.rating.toFixed(1) : 'No rating yet'}</span>
                </div>
                {/* Comment Form */}
                <form className="mb-4">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Name"
                    // value={userName}
                    // onChange={e => setUserName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Email"
                    // value={userEmail}
                    // onChange={e => setUserEmail(e.target.value)}
                    required
                  />
                  <textarea
                    className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Share your experience..."
                    // value={comment}
                    // onChange={e => setComment(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                    // onClick={handleCommentSubmit}
                  >
                    Submit
                  </button>
                </form>
                {/* Existing Comments */}
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Comments</h3>
                  {(venue.comments && venue.comments.length > 0) ? (
                    <div className="space-y-4 max-h-48 overflow-y-auto">
                      {venue.comments.map((c: any, idx: number) => (
                        <div key={idx} className="border-b pb-2 last:border-b-0 last:pb-0">
                          <div className="flex items-center mb-1">
                            <span className="font-semibold text-gray-800 mr-2">{c.userName}</span>
                            <span className="text-xs text-gray-500">{c.userEmail}</span>
                          </div>
                          <p className="text-gray-700 text-sm">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
