"use client"
import { useState } from "react"
import type React from "react"

import { CalendarIcon, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/contexts/auth-context"

interface BookingFormProps {
  venue: any
  checkIn: Date | undefined
  checkOut: Date | undefined
}

export default function BookingForm({ venue, checkIn, checkOut }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Remove all required validation for checkIn and checkOut
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/login")
  }

  return (
    <div className="bg-white border rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900">
        <CalendarIcon className="h-6 w-6 mr-3 text-black" />
        Book This Venue
      </h2>
      {/* Venue Info Summary */}
      {/* <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2">{venue.venueName}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📍 {venue.location}</p>
          <p>👥 Capacity: {venue.capacity} people</p>
          <p>🏢 Type: {venue.venueType}</p>
        </div>
      </div> */}
      {/* Selected Dates Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-semibold text-black mb-2">Selected Dates</h4>
        <p className="text-black">
          Check-in: {checkIn ? checkIn.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : <span className="text-gray-400">Not selected</span>}
        </p>
        <p className="text-black">
          Check-out: {checkOut ? checkOut.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : <span className="text-gray-400">Not selected</span>}
        </p>
      </div>
      <form onSubmit={handleBookingSubmit} className="space-y-6">
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all transform ${
            !isSubmitting
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </span>
          ) : (
            isLoggedIn ? "Book Now" : "Book Now - Continue to Login"
          )}
        </button>
        <p className="text-xs text-gray-500 text-center">
          By clicking above button, you'll be redirected to login or create an account if you didn't have an account or your are not logged in,,,if you have an account or you are logged in it will redirect you to the booking form
        </p>
      </form>
      {/* Pricing Info */}
      {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Pricing Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Contact venue for pricing details</p>
          <p>• Rates may vary by date and duration</p>
          <p>• Special packages available for events</p>
        </div>
      </div> */}
    </div>
  )
}
