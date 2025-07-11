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
import BookingForm from "../BookingForm"
import React from "react"

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
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

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

  // Handle mouse events for calendar hover
  const handleCalendarMouseMove = (event: React.MouseEvent) => {
    // For now, disable hover tooltip as it's not working with this calendar component
    // We'll focus on the click-based detailed view instead
  }

  const handleCalendarMouseLeave = () => {
    setHoveredDate(null)
  }

  // Get all time slots for a specific date (both available and booked)
  const getAllTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    const matchingDay = venue.availability?.find(
      (day) => new Date(day.date).toISOString().split("T")[0] === dateStr,
    )
    
    if (matchingDay) {
      return matchingDay.timeSlots
    }
    
    // If no specific data for this date, return default time slots
    return [
      "09:00 AM - 11:00 AM",
      "11:00 AM - 01:00 PM", 
      "02:00 PM - 04:00 PM",
      "04:00 PM - 06:00 PM",
      "06:00 PM - 08:00 PM",
      "08:00 PM - 10:00 PM"
    ]
  }

  // Get booked time slots for a specific date
  const getBookedTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    // Mock booked slots - in real app, this would come from booking data
    const mockBookedSlots: { [key: string]: string[] } = {
      // January 2025 - Various booking scenarios
      "2025-01-03": ["09:00 AM - 11:00 AM", "02:00 PM - 04:00 PM"], // Partially booked
      "2025-01-05": ["06:00 PM - 08:00 PM"], // Partially booked
      "2025-01-08": ["11:00 AM - 01:00 PM", "04:00 PM - 06:00 PM", "08:00 PM - 10:00 PM"], // Partially booked
      "2025-01-10": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Fully booked
      "2025-01-12": ["09:00 AM - 11:00 AM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], // Partially booked
      "2025-01-15": ["11:00 AM - 01:00 PM", "04:00 PM - 06:00 PM"], // Partially booked
      "2025-01-17": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Fully booked
      "2025-01-20": ["06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Partially booked
      "2025-01-22": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM"], // Partially booked
      "2025-01-25": ["04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Partially booked
      "2025-01-27": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Fully booked
      "2025-01-29": ["11:00 AM - 01:00 PM"], // Partially booked
      "2025-01-31": ["09:00 AM - 11:00 AM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], // Partially booked
      // Additional partial booking scenarios
      "2025-01-02": ["09:00 AM - 11:00 AM"], // Early morning only
      "2025-01-04": ["08:00 PM - 10:00 PM"], // Late evening only
      "2025-01-06": ["11:00 AM - 01:00 PM", "06:00 PM - 08:00 PM"], // Lunch and dinner
      "2025-01-07": ["09:00 AM - 11:00 AM", "04:00 PM - 06:00 PM"], // Morning and afternoon
      "2025-01-09": ["02:00 PM - 04:00 PM", "08:00 PM - 10:00 PM"], // Afternoon and evening
      "2025-01-11": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "06:00 PM - 08:00 PM"], // Morning, lunch, dinner
      "2025-01-13": ["04:00 PM - 06:00 PM"], // Afternoon only
      "2025-01-14": ["09:00 AM - 11:00 AM", "08:00 PM - 10:00 PM"], // Morning and late evening
      "2025-01-16": ["11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], // Lunch, afternoon, dinner
      "2025-01-18": ["09:00 AM - 11:00 AM", "04:00 PM - 06:00 PM"], // Morning and afternoon
      "2025-01-19": ["06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"], // Evening slots only
      "2025-01-21": ["11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM"], // Lunch and afternoon
      "2025-01-23": ["09:00 AM - 11:00 AM", "06:00 PM - 08:00 PM"], // Morning and dinner
      "2025-01-24": ["04:00 PM - 06:00 PM", "08:00 PM - 10:00 PM"], // Afternoon and evening
      "2025-01-26": ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "04:00 PM - 06:00 PM"], // Morning, lunch, afternoon
      "2025-01-28": ["02:00 PM - 04:00 PM", "06:00 PM - 08:00 PM"], // Afternoon and dinner
      "2025-01-30": ["09:00 AM - 11:00 AM", "08:00 PM - 10:00 PM"], // Morning and late evening
    }
    return (mockBookedSlots as any)[dateStr] || []
  }

  // Check if a date is fully booked
  const isDateFullyBooked = (date: Date) => {
    const allSlots = getAllTimeSlotsForDate(date)
    const bookedSlots = getBookedTimeSlotsForDate(date)
    return bookedSlots.length === allSlots.length
  }

  // Check if a date is partially booked
  const isDatePartiallyBooked = (date: Date) => {
    const allSlots = getAllTimeSlotsForDate(date)
    const bookedSlots = getBookedTimeSlotsForDate(date)
    return bookedSlots.length > 0 && bookedSlots.length < allSlots.length
  }

  // Generate time slots based on selected date
  const getTimeSlots = () => {
    if (!selectedDate || !venue.availability) return []
    const selectedDateStr = selectedDate.toISOString().split("T")[0]
    const matchingDay = venue.availability.find(
      (day) => new Date(day.date).toISOString().split("T")[0] === selectedDateStr,
    )
    
    if (matchingDay) {
      const allSlots = matchingDay.timeSlots
      const bookedSlots = getBookedTimeSlotsForDate(selectedDate)
      // Return only available (not booked) slots
      return allSlots.filter(slot => !bookedSlots.includes(slot))
    }
    
    // If no specific data, return default slots minus booked ones
    const defaultSlots = [
      "09:00 AM - 11:00 AM",
      "11:00 AM - 01:00 PM", 
      "02:00 PM - 04:00 PM",
      "04:00 PM - 06:00 PM",
      "06:00 PM - 08:00 PM",
      "08:00 PM - 10:00 PM"
    ]
    const bookedSlots = getBookedTimeSlotsForDate(selectedDate)
    return defaultSlots.filter(slot => !bookedSlots.includes(slot))
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
    // Make all dates available and clickable
    return true
  }

  // Get the number of time slots for a specific date
  const getTimeSlotsCount = (date: Date) => {
    if (!venue.availability) return 0
    const dateStr = date.toISOString().split("T")[0]
    const matchingDay = venue.availability.find((day) => new Date(day.date).toISOString().split("T")[0] === dateStr)
    return matchingDay ? matchingDay.timeSlots.length : 0
  }

  // Check if a date is booked by others
  const isDateBookedByOthers = (date: Date) => {
    const allSlots = getAllTimeSlotsForDate(date);
    const bookedSlots = getBookedTimeSlotsForDate(date);
    return bookedSlots.length === allSlots.length;
  };

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
                  <a
                    href="https://www.google.com/maps/place/Kigali+Conference+%26+Exhibition+Village/@-1.9583425,30.0600754,805m/data=!3m2!1e3!4b1!4m6!3m5!1s0x19dca539fce426b1:0x1e077dd0f5854efc!8m2!3d-1.9583479!4d30.0626503!16s%2Fg%2F11fhk541tt?entry=ttu&g_ep=EgoyMDI1MDcwOC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>

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

                {/* Booking Conditions */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Booking Conditions & Policies</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Cancellation Policy</h3>
                        <div className="space-y-2">
                          <p><strong>Free Cancellation:</strong> Up to 48 hours before the event date</p>
                          <p><strong>Late Cancellation:</strong> 50% fee for cancellations within 48 hours</p>
                          <p><strong>No-Show:</strong> Full charge applies for no-shows</p>
                          <p><strong>Force Majeure:</strong> Full refund for events beyond our control</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Payment Terms</h3>
                        <div className="space-y-2">
                          <p><strong>Deposit:</strong> 50% of total booking fee required upon confirmation</p>
                          <p><strong>Final Payment:</strong> Remaining balance due 7 days before event</p>
                          <p><strong>Payment Methods:</strong> Bank transfer, mobile money, or cash</p>
                          <p><strong>Late Payment:</strong> 10% late fee applies after due date</p>
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
                          <p><strong>Event Liability Insurance:</strong> Strongly recommended for all bookings</p>
                          <p><strong>Venue Insurance:</strong> Covers venue damage up to $10,000</p>
                          <p><strong>Personal Property:</strong> Venue not responsible for personal items</p>
                          <p><strong>Third-Party Vendors:</strong> Must provide their own insurance certificates</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Additional Services</h3>
                        <div className="space-y-2">
                          <p><strong>Setup Services:</strong> Available at additional cost</p>
                          <p><strong>Cleaning Services:</strong> Post-event cleaning included</p>
                          <p><strong>Technical Support:</strong> AV equipment support available</p>
                          <p><strong>Parking:</strong> Free parking available for up to 50 vehicles</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-semibold text-blue-900 mb-2">Important Notice</h4>
                        <p className="text-blue-800 text-sm">
                          By booking this venue, you agree to all terms and conditions outlined above. 
                          Please read carefully and contact us if you have any questions about our policies.
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
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="text-sm text-yellow-800">
                              <strong>Tip:</strong> Click on any date to see available time slots in the booking form.
                            </div>
                          </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div 
                          onMouseMove={handleCalendarMouseMove}
                          onMouseLeave={handleCalendarMouseLeave}
                          className="relative"
                        >
                          <CalendarComponent
                            numberOfMonths={2}
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              // Only disable past dates, allow all future dates
                              return date < today
                            }}
                            fromDate={new Date()}
                            className="rounded-md"
                            modifiers={{
                              available: (date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return date >= today
                              },
                              partiallyBooked: (date) => isDatePartiallyBooked(date),
                              fullyBooked: (date) => isDateFullyBooked(date),
                              selected: (date) => selectedDate?.toDateString() === date.toDateString(),
                            }}
                            modifiersStyles={{
                              available: {
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                fontWeight: "bold",
                                borderRadius: "6px",
                              },
                              partiallyBooked: {
                                backgroundColor: "#fef3c7",
                                color: "#d97706",
                                fontWeight: "bold",
                                borderRadius: "6px",
                              },
                              fullyBooked: {
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
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
                        </div>
                        {/* Click-based Detailed Availability Display */}
                        {selectedDate && (
                          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">
                                📅 {selectedDate.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </h4>
                              <button 
                                onClick={() => setSelectedDate(undefined)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                ✕
                              </button>
                            </div>
                            
                            {isDateFullyBooked(selectedDate) ? (
                              <div className="text-center py-6">
                                <div className="text-red-600 font-medium text-lg mb-2">🚫 Fully Booked</div>
                                <p className="text-gray-600 mb-4">This date has no available time slots.</p>
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <div className="text-sm font-medium text-red-800 mb-2">All {getAllTimeSlotsForDate(selectedDate).length} slots are taken:</div>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {getBookedTimeSlotsForDate(selectedDate).map((slot: string, index: number) => (
                                      <div key={index} className="text-xs text-red-600 bg-red-100 p-2 rounded">
                                        {slot}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : isDatePartiallyBooked(selectedDate) ? (
                              <div className="space-y-4">
                                <div className="flex items-center">
                                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                                  <span className="text-orange-600 font-medium">Partially Booked</span>
                                  <span className="ml-auto text-sm text-gray-500">
                                    {getTimeSlots().length} of {getAllTimeSlotsForDate(selectedDate).length} slots available
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h5 className="font-medium text-red-600 mb-3 flex items-center">
                                      ❌ Booked Time Slots ({getBookedTimeSlotsForDate(selectedDate).length})
                                    </h5>
                                    <div className="space-y-2">
                                      {getBookedTimeSlotsForDate(selectedDate).map((slot: string, index: number) => (
                                        <div key={index} className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                                          {slot}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium text-green-600 mb-3 flex items-center">
                                      ✅ Available Time Slots ({getTimeSlots().length})
                                    </h5>
                                    <div className="space-y-2">
                                      {getTimeSlots().map((slot: string, index: number) => (
                                        <div key={index} className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                                          {slot}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <div className="text-green-600 font-medium text-lg mb-2">✅ All Slots Available</div>
                                <p className="text-gray-600 mb-4">You can book any time slot on this date.</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {getAllTimeSlotsForDate(selectedDate).map((slot: string, index: number) => (
                                    <div key={index} className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                                      {slot}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Book Now Button */}
                        <div className="mt-6 text-center">
                          <button
                            onClick={() => {
                              // Scroll to the booking form in the sidebar
                              const bookingForm = document.getElementById('booking-form-section');
                              if (bookingForm) {
                                bookingForm.scrollIntoView({ 
                                  behavior: 'smooth',
                                  block: 'start'
                                });
                              }
                            }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            Book Now
                          </button>
                          <p className="text-sm text-gray-600 mt-2">
                            Click to proceed to booking form
                          </p>
                        </div>

                        {/* Simple Availability Display */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Quick Availability Guide:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-blue-600 mb-1">Available Dates:</div>
                              <div className="space-y-1">
                                <div>• Jan 1st - All slots available</div>
                                <div>• Jan 2nd - 5 slots available (1 booked)</div>
                                <div>• Jan 3rd - 4 slots available (2 booked)</div>
                                <div>• Jan 4th - 5 slots available (1 booked)</div>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-orange-600 mb-1">Partially Booked:</div>
                              <div className="space-y-1">
                                <div>• Jan 5th, 6th, 7th, 8th, 9th</div>
                                <div>• Jan 11th, 12th, 13th, 14th, 15th</div>
                                <div>• Jan 16th, 18th, 19th, 20th, 21st</div>
                              </div>
                            </div>
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
          <div className="lg:col-span-1" id="booking-form-section">
            {/* Booking Form */}
            <BookingForm
              venue={venue}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTimeSlot={selectedTimeSlot}
              setSelectedTimeSlot={setSelectedTimeSlot}
              timeSlots={timeSlots}
            />

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
