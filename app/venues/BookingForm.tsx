"use client"

import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar, Clock, User, Mail, Phone, MapPin, Eye, Edit, Trash2 } from "lucide-react"

interface BookingFormProps {
  venue: any
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  selectedTimeSlot: string
  setSelectedTimeSlot: (slot: string) => void
  timeSlots: string[]
}

export default function BookingForm({
  venue,
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  timeSlots
}: BookingFormProps) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    eventType: "",
    attendees: "",
    specialRequirements: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showExistingBookings, setShowExistingBookings] = useState(false)

  // Static booking data for demonstration - other users' bookings (August, September, November)
  const otherUsersBookings = [
    {
      date: "2025-08-12",
      timeSlot: "02:00 PM - 04:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-08-18", 
      timeSlot: "06:00 PM - 08:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-08-25",
      timeSlot: "09:00 AM - 11:00 AM",
      status: "pending"
    },
    {
      date: "2025-09-05",
      timeSlot: "04:00 PM - 06:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-09-15",
      timeSlot: "11:00 AM - 01:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-09-22",
      timeSlot: "08:00 PM - 10:00 PM",
      status: "pending"
    },
    {
      date: "2025-11-03",
      timeSlot: "02:00 PM - 04:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-11-10",
      timeSlot: "06:00 PM - 08:00 PM",
      status: "confirmed"
    },
    {
      date: "2025-11-18",
      timeSlot: "09:00 AM - 11:00 AM",
      status: "pending"
    },
    {
      date: "2025-11-25",
      timeSlot: "04:00 PM - 06:00 PM",
      status: "confirmed"
    }
  ]

  // Check if a date is already booked by other users
  const isDateBookedByOthers = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return otherUsersBookings.some(booking => booking.date === dateStr)
  }

  // Get booked time slots for a specific date
  const getBookedTimeSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return otherUsersBookings
      .filter(booking => booking.date === dateStr)
      .map(booking => booking.timeSlot)
  }

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot");
      return;
    }
    if (selectedDate < today) {
      alert("You cannot book a past date.");
      setSelectedDate(undefined);
      setSelectedTimeSlot("");
      return;
    }
    if (!userInfo.name || !userInfo.email || !userInfo.phone) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const bookingData = {
        venueId: venue.venueId,
        venueName: venue.venueName,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedTimeSlot,
        userInfo,
        bookingId: `BK-${Date.now()}`,
        status: "pending"
      }

      console.log("Booking submitted:", bookingData)
      setBookingSuccess(true)
      
      // Reset form
      setSelectedDate(undefined)
      setSelectedTimeSlot("")
      setUserInfo({
        name: "",
        email: "",
        phone: "",
        organization: "",
        eventType: "",
        attendees: "",
        specialRequirements: ""
      })
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="text-center py-8">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Your booking request has been submitted successfully. We'll contact you within 24 hours to confirm.
          </p>
          <button
            onClick={() => setBookingSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
        Book This Venue
      </h2>

      {/* Other Users' Bookings Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Recent Bookings</h3>
          <button
            onClick={() => setShowExistingBookings(!showExistingBookings)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            {showExistingBookings ? "Hide" : "View"} Recent Bookings
          </button>
        </div>
        
        {showExistingBookings && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              These dates have been booked by other users:
            </p>
            {otherUsersBookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-gray-500 ml-2">•</span>
                    <span className="text-gray-600 ml-2">{booking.timeSlot}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Venue Contact Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Venue Contact Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{venue.contactPerson}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{venue.contactEmail}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{venue.contactPhone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{venue.location}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (
                date &&
                !isDateBookedByOthers(date) &&
                date >= today
              ) {
                setSelectedDate(date);
              } else {
                setSelectedDate(undefined);
                setSelectedTimeSlot("");
              }
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || isDateBookedByOthers(date);
            }}
            className="rounded-md border"
            modifiers={{
              booked: (date) => isDateBookedByOthers(date),
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                fontWeight: "bold",
                textDecoration: "line-through",
                border: "1.5px solid #dc2626",
                cursor: "not-allowed",
              },
            }}
          />
          {/* Legend for calendar */}
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="inline-block w-4 h-4 rounded bg-red-200 border border-red-400 align-middle mr-1"></span>
            <span className="text-gray-700">Booked by other users</span>
          </div>
          {selectedDate && isDateBookedByOthers(selectedDate) && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ⚠️ This date is already booked by another user. Please select a different date.
            </div>
          )}
        </div>

        {/* Time Slot Selection */}
        <div>
          <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-1" />
            Time Slot
          </label>
          {selectedDate && isDateBookedByOthers(selectedDate) ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ⚠️ This date is fully booked by other users. No time slots are available. Please select a different date.
            </div>
          ) : (
            <>
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={venue.isBooked || !selectedDate}
              >
                <option value="">Select a time slot</option>
                {selectedDate && timeSlots.map((slot) => {
                  const isBooked = getBookedTimeSlotsForDate(selectedDate).includes(slot)
                  return (
                    <option key={slot} value={slot} disabled={isBooked}>
                      {slot} {isBooked ? '(Booked)' : ''}
                    </option>
                  )
                })}
              </select>
              {selectedDate && getBookedTimeSlotsForDate(selectedDate).length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  ⚠️ Some time slots on this date are already booked. Available slots are shown above.
                </div>
              )}
            </>
          )}
        </div>

        {/* User Information */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={userInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={userInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                value={userInfo.organization}
                onChange={(e) => handleInputChange("organization", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="eventType"
                value={userInfo.eventType}
                onChange={(e) => handleInputChange("eventType", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select event type</option>
                <option value="Conference">Conference</option>
                <option value="Meeting">Meeting</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Training">Training</option>
                <option value="Social Event">Social Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Attendees
              </label>
              <input
                type="number"
                id="attendees"
                value={userInfo.attendees}
                onChange={(e) => handleInputChange("attendees", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={venue.capacity || 100}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              value={userInfo.specialRequirements}
              onChange={(e) => handleInputChange("specialRequirements", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requirements or requests..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedDate || !selectedTimeSlot || venue.isBooked || isSubmitting || (selectedDate && isDateBookedByOthers(selectedDate))}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            selectedDate && selectedTimeSlot && !venue.isBooked && !isSubmitting && !isDateBookedByOthers(selectedDate)
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Booking...
            </span>
          ) : venue.isBooked ? (
            "Currently Booked"
          ) : selectedDate && isDateBookedByOthers(selectedDate) ? (
            "Date Already Booked"
          ) : (
            "Submit Booking Request"
          )}
        </button>
      </form>
    </div>
  )
} 