"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, MapPin, Users, Edit, Share2, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"

// Sample event data - in a real app, this would come from an API or database
const eventsData = [
  {
    id: "event-1",
    name: "Annual Conference",
    date: "April 15, 2025",
    time: "9:00 AM - 5:00 PM",
    venue: "Main Conference Hall",
    address: "123 Conference Way, Kigali, Rwanda",
    registrations: 145,
    capacity: 300,
    status: "published",
    description:
      "Join us for our annual conference featuring industry experts, networking opportunities, and the latest innovations in technology. This full-day event includes keynote speeches, panel discussions, and interactive workshops.",
    organizer: "Tech Association of Rwanda",
    category: "Conference",
    ticketPrice: "$50",
    featuredImage: "/techconference.png?height=300&width=400",
    createdAt: "January 15, 2025",
  },
  {
    id: "event-2",
    name: "Product Launch",
    date: "April 20, 2025",
    time: "10:00 AM - 2:00 PM",
    venue: "Exhibition Center",
    address: "456 Innovation Avenue, Kigali, Rwanda",
    registrations: 78,
    capacity: 150,
    status: "pending",
    description:
      "Be the first to experience our revolutionary new product. This exclusive launch event will showcase the features, benefits, and technology behind our latest innovation. Includes product demonstrations and Q&A with the development team.",
    organizer: "TechCorp Rwanda",
    category: "Product Launch",
    ticketPrice: "Free",
    featuredImage: "/techconference.png?height=300&width=400",
    createdAt: "January 20, 2025",
  },
  {
    id: "event-3",
    name: "Team Building Retreat",
    date: "April 25, 2025",
    time: "8:00 AM - 6:00 PM",
    venue: "Mountain Resort",
    address: "789 Mountain View Road, Northern Province, Rwanda",
    registrations: 32,
    capacity: 50,
    status: "published",
    description:
      "A day of team-building activities, strategic planning, and relaxation in the beautiful mountains of Rwanda. This retreat is designed to strengthen team bonds, improve communication, and align on company goals for the upcoming year.",
    organizer: "Corporate Events Rwanda",
    category: "Corporate",
    ticketPrice: "$75",
    featuredImage: "/techconference.png?height=300&width=400",
    createdAt: "January 25, 2025",
  },
  {
    id: "event-4",
    name: "Client Appreciation Day",
    date: "May 5, 2025",
    time: "6:00 PM - 9:00 PM",
    venue: "Company Headquarters",
    address: "101 Business Park, Kigali, Rwanda",
    registrations: 0,
    capacity: 100,
    status: "pending",
    description:
      "An evening dedicated to thanking our valued clients for their continued support. Join us for cocktails, hors d'oeuvres, entertainment, and networking. Special recognition will be given to our long-term partners.",
    organizer: "Business Solutions Ltd",
    category: "Networking",
    ticketPrice: "By Invitation",
    featuredImage: "/techconference.png?height=300&width=400",
    createdAt: "February 5, 2025",
  },
]

export default function ViewEventPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
        setEvent(foundEvent || null)
        setLoading(false)
      }, 500)
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  const handleDelete = () => {
    // In a real app, this would be an API call to delete the event
    // For now, just simulate success and redirect
    setTimeout(() => {
      router.push("/manage/events")
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

  if (!event) {
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
              <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
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
          <Link href="/manage/events" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>

          {/* Event Header */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="h-64 bg-gray-200 relative">
              <img
                src={event.featuredImage || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {event.status === "published" ? "Published" : "Pending"}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h1 className="text-3xl font-bold mb-2 md:mb-0">{event.name}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/manage/events/${id}/edit`)}
                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{event.date}</p>
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-sm">{event.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Registrations</p>
                    <p className="font-medium">
                      {event.registrations} / {event.capacity}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Event Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{event.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organizer</p>
                    <p className="font-medium">{event.organizer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ticket Price</p>
                    <p className="font-medium">{event.ticketPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">{event.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Delete Event</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{event.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
