"use client"
import { useState, use } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Users,
  CheckCircle,
  ExternalLink,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getVenueById } from "@/data/venues"
import { notFound } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import BookingForm from "../BookingForm"

export default function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const venue = getVenueById(id)
  const router = useRouter()

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

  const [activeTab, setActiveTab] = useState("availability")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [newComment, setNewComment] = useState({
    userName: "",
    userEmail: "",
    content: "",
    rating: 0,
  })
  const [userComments, setUserComments] = useState<any[]>([])

  // Sample photos for the gallery
  const photos = [
    venue.imageSrc || "/placeholder.svg",
    "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
  ]

  // Mock booked dates for demonstration
  const mockBookedDates: { [key: string]: boolean } = {
    "2025-01-10": true,
    "2025-01-17": true,
    "2025-01-27": true,
    "2025-08-14": true,
    "2025-11-10": true,
  }

  // Check if a date is fully booked
  const isDateFullyBooked = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return mockBookedDates[dateStr] || false
  }

  const amenitiesList = venue.amenities.split(",").map((amenity) => amenity.trim())

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  // Calculate current month info for availability guide
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const currentMonthDates = Array.from(
    { length: daysInCurrentMonth },
    (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1),
  )

  const fullyBookedDatesCurrent = currentMonthDates.filter((date) => isDateFullyBooked(date))

  // Helper to format date
  function formatDate(date: Date) {
    const day = date.getDate()
    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()
    const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th"
    return `${month} ${day}${suffix} ${year}`
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.userName.trim() || !newComment.userEmail.trim() || !newComment.content.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (newComment.rating === 0) {
      alert("Please select a rating")
      return
    }

    // Add the new comment to the list
    const commentToAdd = {
      ...newComment,
      timestamp: new Date().toISOString(),
    }

    setUserComments((prev) => [commentToAdd, ...prev])

    // Reset form
    setNewComment({
      userName: "",
      userEmail: "",
      content: "",
      rating: 0,
    })

    alert("Comment added successfully!")
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
              <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                <Image
                  src={photos[currentPhotoIndex] || "/placeholder.svg"}
                  alt={`${venue.venueName} - Photo ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {venue.venueType}
                  </span>
                </div>
                {venue.isBooked && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                      Currently Booked
                    </span>
                  </div>
                )}
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`relative h-16 rounded-md overflow-hidden cursor-pointer transition-all ${
                      index === currentPhotoIndex ? "ring-2 ring-purple-500" : "hover:opacity-80"
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
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center mt-1"
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
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "availability"
                      ? "border-b-2 border-purple-600 text-purple-600"
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

                {/* Venue Location */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Venue Location</h2>
                  <div className="rounded-lg overflow-hidden border shadow-sm" style={{ height: 350 }}>
                    <iframe
                      title="Venue Location Map"
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.478847756123!2d30.0600754!3d-1.9583425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca539fce426b1%3A0x1e077dd0f5854efc!2sKigali%20Conference%20%26%20Exhibition%20Village!5e0!3m2!1sen!2srw!4v1709923456789!5m2!1sen!2srw"
                    ></iframe>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Conditions */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Booking Conditions & Policies</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Cancellation Policy</h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Free Cancellation:</strong> Up to 48 hours before the event date
                          </p>
                          <p>
                            <strong>Late Cancellation:</strong> 50% fee for cancellations within 48 hours
                          </p>
                          <p>
                            <strong>No-Show:</strong> Full charge applies for no-shows
                          </p>
                          <p>
                            <strong>Force Majeure:</strong> Full refund for events beyond our control
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Payment Terms</h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Deposit:</strong> 50% of total booking fee required upon confirmation
                          </p>
                          <p>
                            <strong>Final Payment:</strong> Remaining balance due 7 days before event
                          </p>
                          <p>
                            <strong>Payment Methods:</strong> Bank transfer, mobile money, or cash
                          </p>
                          <p>
                            <strong>Late Payment:</strong> 10% late fee applies after due date
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Venue Rules & Regulations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">General Rules</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>No smoking inside the venue premises</li>
                              <li>Maximum capacity must not be exceeded</li>
                              <li>Setup and cleanup time included in booking</li>
                              <li>External catering allowed with prior approval</li>
                              <li>No pets allowed (except service animals)</li>
                              <li>Quiet hours after 10:00 PM</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Safety & Security</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Fire safety equipment must not be tampered with</li>
                              <li>Emergency exits must remain accessible</li>
                              <li>Security deposit may be required for large events</li>
                              <li>Venue staff must be notified of any incidents</li>
                              <li>First aid kit available on premises</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Insurance & Liability</h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Event Liability Insurance:</strong> Strongly recommended for all bookings
                          </p>
                          <p>
                            <strong>Venue Insurance:</strong> Covers venue damage up to $10,000
                          </p>
                          <p>
                            <strong>Personal Property:</strong> Venue not responsible for personal items
                          </p>
                          <p>
                            <strong>Third-Party Vendors:</strong> Must provide their own insurance certificates
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Additional Services</h3>
                        <div className="space-y-2">
                          <p>
                            <strong>Setup Services:</strong> Available at additional cost
                          </p>
                          <p>
                            <strong>Cleaning Services:</strong> Post-event cleaning included
                          </p>
                          <p>
                            <strong>Technical Support:</strong> AV equipment support available
                          </p>
                          <p>
                            <strong>Parking:</strong> Free parking available for up to 50 vehicles
                          </p>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                        <h4 className="font-semibold text-purple-900 mb-2">Important Notice</h4>
                        <p className="text-purple-800 text-sm">
                          By booking this venue, you agree to all terms and conditions outlined above. Please read
                          carefully and contact us if you have any questions about our policies.
                        </p>
                      </div>
                    </div>
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
              </>
            )}

            {activeTab === "availability" && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Venue Availability</h2>
                <div className="bg-white p-8 rounded-xl shadow-lg border">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Date</h3>
                    <p className="text-gray-600">Choose an available date to book this venue</p>
                  </div>

                  {/* Enhanced Calendar */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                      <Calendar
                        numberOfMonths={2}
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          // Scroll to booking form
                          const bookingForm = document.getElementById("booking-form-section")
                          if (bookingForm) {
                            bookingForm.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || isDateFullyBooked(date)
                        }}
                        fromDate={new Date()}
                        className="rounded-lg border-0"
                        modifiers={{
                          fullyBooked: (date) => isDateFullyBooked(date),
                          available: (date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date >= today && !isDateFullyBooked(date)
                          },
                        }}
                        modifiersStyles={{
                          fullyBooked: {
                            backgroundColor: "#fee2e2",
                            color: "#dc2626",
                            textDecoration: "line-through",
                            cursor: "not-allowed",
                            fontWeight: "bold",
                          },
                          available: {
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            fontWeight: "600",
                            cursor: "pointer",
                          },
                        }}
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
                          caption_label: "text-lg font-bold",
                          nav: "space-x-1 flex items-center",
                          nav_button:
                            "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md hover:bg-gray-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-gray-500 rounded-md w-10 font-medium text-sm text-center",
                          row: "flex w-full mt-2",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-100 transition-colors",
                          day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white",
                          day_today: "bg-gray-100 text-gray-900 font-semibold",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center items-center gap-6 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
                      <span className="text-gray-700">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                      <span className="text-gray-700">Fully Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                      <span className="text-gray-700">Past Dates</span>
                    </div>
                  </div>

                  {/* Selected Date Display */}
                  {selectedDate && (
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                      <h4 className="text-xl font-bold text-blue-900 mb-2">📅 Selected Date</h4>
                      <p className="text-lg text-blue-800">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-blue-600 mt-2">Proceed to booking form to complete your reservation</p>
                    </div>
                  )}

                  {/* Quick Availability Guide */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-900">Quick Availability Guide:</h4>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium text-red-600 mb-1">Fully Booked Dates:</div>
                      {fullyBookedDatesCurrent.length > 0 ? (
                        <div className="space-y-1">
                          {fullyBookedDatesCurrent.map((date) => (
                            <div key={date.toISOString()}>• {formatDate(date)}</div>
                          ))}
                        </div>
                      ) : (
                        <div>No fully booked dates this month</div>
                      )}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <div className="text-center mt-8">
                    <button
                      onClick={() => {
                        const bookingForm = document.getElementById("booking-form-section")
                        if (bookingForm) {
                          bookingForm.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      }}
                      className="bg-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Book This Venue
                    </button>
                    <p className="text-sm text-gray-600 mt-3">Select a date above and proceed to booking</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1" id="booking-form-section">
            {/* Booking Form */}
            <BookingForm venue={venue} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {/* Venue Rating & Comments */}
            <div className="bg-white border rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Venue Rating & Comments</h2>

              {/* Star Rating Display */}
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl mr-1 focus:outline-none ${
                      star <= (venue.rating || 0) ? "text-purple-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {venue.rating ? venue.rating.toFixed(1) : "No rating yet"}
                </span>
              </div>

              {/* Add Comment Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Rate & Comment</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  {/* Star Rating Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewComment((prev) => ({ ...prev, rating: star }))}
                          className={`text-2xl mr-1 focus:outline-none transition-colors ${
                            star <= newComment.rating
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-300 hover:text-gray-400"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {newComment.rating > 0 ? `${newComment.rating}/5` : "Select rating"}
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label htmlFor="commentName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="commentName"
                      value={newComment.userName}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, userName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="commentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="commentEmail"
                      value={newComment.userEmail}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, userEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Comment *
                    </label>
                    <textarea
                      id="commentContent"
                      value={newComment.content}
                      onChange={(e) => setNewComment((prev) => ({ ...prev, content: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Share your experience with this venue..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
                  >
                    Submit Comment
                  </button>
                </form>
              </div>

              {/* Display Comments */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-4">
                  Comments ({userComments.length + (venue.comments?.length || 0)})
                </h3>

                {/* User Comments (newly added) */}
                {userComments.length > 0 && (
                  <div className="space-y-4 mb-4">
                    {userComments.map((comment, idx) => (
                      <div key={`user-${idx}`} className="border-b pb-4 bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-800 mr-2">{comment.userName}</span>
                            <span className="text-xs text-gray-500">{comment.userEmail}</span>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${star <= comment.rating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Existing Comments */}
                {venue.comments && venue.comments.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {venue.comments.map((c: any, idx: number) => (
                      <div key={`existing-${idx}`} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-gray-800 mr-2">{c.userName}</span>
                          <span className="text-xs text-gray-500">{c.userEmail}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !userComments.length && (
                    <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
