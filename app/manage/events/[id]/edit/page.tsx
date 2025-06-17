"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, AlertCircle, Calendar, Clock, MapPin, Users, Upload } from "lucide-react"
import Link from "next/link"

// Sample event data - same as in the view page
const eventsData = [
  {
    id: "event-1",
    name: "Annual Conference",
    date: "2025-04-15",
    startTime: "09:00",
    endTime: "17:00",
    venue: "Main Conference Hall",
    address: "123 Conference Way, Kigali, Rwanda",
    registrations: 145,
    capacity: 300,
    status: "published",
    description:
      "Join us for our annual conference featuring industry experts, networking opportunities, and the latest innovations in technology. This full-day event includes keynote speeches, panel discussions, and interactive workshops.",
    organizer: "Tech Association of Rwanda",
    category: "Conference",
    ticketPrice: "50",
    featuredImage: "/placeholder.svg?height=400&width=800&text=ANNUAL+CONFERENCE",
    createdAt: "January 15, 2025",
  },
  {
    id: "event-2",
    name: "Product Launch",
    date: "2025-04-20",
    startTime: "10:00",
    endTime: "14:00",
    venue: "Exhibition Center",
    address: "456 Innovation Avenue, Kigali, Rwanda",
    registrations: 78,
    capacity: 150,
    status: "pending",
    description:
      "Be the first to experience our revolutionary new product. This exclusive launch event will showcase the features, benefits, and technology behind our latest innovation. Includes product demonstrations and Q&A with the development team.",
    organizer: "TechCorp Rwanda",
    category: "Product Launch",
    ticketPrice: "0",
    featuredImage: "/placeholder.svg?height=400&width=800&text=PRODUCT+LAUNCH",
    createdAt: "January 20, 2025",
  },
  {
    id: "event-3",
    name: "Team Building Retreat",
    date: "2025-04-25",
    startTime: "08:00",
    endTime: "18:00",
    venue: "Mountain Resort",
    address: "789 Mountain View Road, Northern Province, Rwanda",
    registrations: 32,
    capacity: 50,
    status: "published",
    description:
      "A day of team-building activities, strategic planning, and relaxation in the beautiful mountains of Rwanda. This retreat is designed to strengthen team bonds, improve communication, and align on company goals for the upcoming year.",
    organizer: "Corporate Events Rwanda",
    category: "Corporate",
    ticketPrice: "75",
    featuredImage: "/placeholder.svg?height=400&width=800&text=TEAM+BUILDING+RETREAT",
    createdAt: "January 25, 2025",
  },
  {
    id: "event-4",
    name: "Client Appreciation Day",
    date: "2025-05-05",
    startTime: "18:00",
    endTime: "21:00",
    venue: "Company Headquarters",
    address: "101 Business Park, Kigali, Rwanda",
    registrations: 0,
    capacity: 100,
    status: "pending",
    description:
      "An evening dedicated to thanking our valued clients for their continued support. Join us for cocktails, hors d'oeuvres, entertainment, and networking. Special recognition will be given to our long-term partners.",
    organizer: "Business Solutions Ltd",
    category: "Networking",
    ticketPrice: "0",
    featuredImage: "/placeholder.svg?height=400&width=800&text=CLIENT+APPRECIATION+DAY",
    createdAt: "February 5, 2025",
  },
]

export default function EditEventPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    address: "",
    capacity: "",
    description: "",
    organizer: "",
    category: "",
    ticketPrice: "",
    featuredImage: "",
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Fetch event data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchEvent = () => {
      setLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const foundEvent = eventsData.find((e) => e.id === id)
        if (foundEvent) {
          setFormData({
            name: foundEvent.name,
            date: foundEvent.date,
            startTime: foundEvent.startTime,
            endTime: foundEvent.endTime,
            venue: foundEvent.venue,
            address: foundEvent.address,
            capacity: String(foundEvent.capacity),
            description: foundEvent.description,
            organizer: foundEvent.organizer,
            category: foundEvent.category,
            ticketPrice: foundEvent.ticketPrice,
            featuredImage: foundEvent.featuredImage,
          })
        }
        setLoading(false)
      }, 500)
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // In a real app, this would be an API call to update the event
    // For now, just simulate success and redirect
    setTimeout(() => {
      router.push(`/manage/events/${id}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!formData.name) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
            <Link href="/manage/events" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
              <p className="text-gray-600 mb-6">The event you're trying to edit doesn't exist or has been removed.</p>
              <Link href="/manage/events" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Return to Events
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <Link href={`/manage/events/${id}`} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event Details
          </Link>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold">Edit Event</h1>
              <p className="text-gray-600">Update your event details</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Event Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time*
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time*
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue*
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity*
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Networking">Networking</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Organizer */}
                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer*
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Ticket Price */}
                <div>
                  <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Price ($)*
                  </label>
                  <input
                    type="number"
                    id="ticketPrice"
                    name="ticketPrice"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 0 for free events</p>
                </div>

                {/* Featured Image */}
                <div className="md:col-span-2">
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img
                        src={formData.featuredImage || "/placeholder.svg"}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Drag and drop an image, or click to browse</p>
                        <p className="text-xs text-gray-400">Recommended size: 1200 x 600 pixels</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Link
                  href={`/manage/events/${id}`}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
