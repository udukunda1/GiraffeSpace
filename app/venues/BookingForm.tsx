"use client"
import { useState } from "react"
import type React from "react"

import { CalendarIcon, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingFormProps {
  venue: any
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
}

export default function BookingForm({ venue, selectedDate, setSelectedDate }: BookingFormProps) {
  const [userName, setUserName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) {
      alert("Please select a date first")
      return
    }

    if (!userName.trim()) {
      alert("Please enter your name")
      return
    }

    setIsSubmitting(true)

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to login page
    router.push("/login")
  }

  // Check if date is in the past or fully booked
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Mock booked dates
    const mockBookedDates = ["2025-01-10", "2025-01-17", "2025-01-27", "2025-08-14", "2025-11-10"]

    const dateStr = date.toISOString().split("T")[0]
    return date < today || mockBookedDates.includes(dateStr)
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
        <CalendarIcon className="h-6 w-6 mr-3 text-purple-600" />
        Book This Venue
      </h2>

      {/* Venue Info Summary */}
      {/* <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <h3 className="font-semibold text-gray-900 mb-2">{venue.venueName}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📍 {venue.location}</p>
          <p>👥 Capacity: {venue.capacity} people</p>
          <p>🏢 Type: {venue.venueType}</p>
        </div>
      </div> */}

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">📅 Selected Date</h4>
          <p className="text-green-700 font-medium">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {!selectedDate && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <p className="text-yellow-800 font-medium">📅 Please select a date from the availability calendar first</p>
          </div>
        )}

        {selectedDate && isDateDisabled(selectedDate) && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
            <p className="text-red-800 font-medium">❌ This date is not available for booking</p>
          </div>
        )}

        {selectedDate && !isDateDisabled(selectedDate) && (
          <>
            {/* User Name Input */}
            <div>
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Your Name *
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Account Notice */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Account Required</h4>
              <p className="text-blue-700 text-sm">
                You'll need to log in or create an account to complete your booking. Don't worry - we'll save your
                booking details!
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!userName.trim() || isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all transform ${
                userName.trim() && !isSubmitting
                  ? "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                "Book Now - Continue to Login"
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By clicking "Book Now", you'll be redirected to login or create an account
            </p>
          </>
        )}
      </form>

      {/* Pricing Info */}
      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">💰 Pricing Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Contact venue for pricing details</p>
          <p>• Rates may vary by date and duration</p>
          <p>• Special packages available for events</p>
        </div>
      </div> */}
    </div>
  )
}
