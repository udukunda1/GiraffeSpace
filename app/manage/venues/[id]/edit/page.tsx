"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/providers"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"

// Sample venue data
const venuesData = [
  {
    id: "grand-conference-hall",
    name: "Grand Conference Hall",
    address: "123 Main Street, City Center",
    capacity: 500,
    pricePerHour: 1000,
    bookings: 8,
    image: "/placeholder.svg?height=300&width=500&text=GRAND+CONFERENCE+HALL",
    description: "A spacious venue perfect for large conferences and events.",
    amenities: ["Wi-Fi", "Projector", "Sound System", "Catering"],
  },
  {
    id: "riverside-meeting-room",
    name: "Riverside Meeting Room",
    address: "45 River Road, Waterfront",
    capacity: 50,
    pricePerHour: 200,
    bookings: 3,
    image: "/placeholder.svg?height=300&width=500&text=RIVERSIDE+MEETING+ROOM",
    description: "A comfortable meeting room with a beautiful view of the river.",
    amenities: ["Wi-Fi", "Whiteboard", "Coffee Machine"],
  },
  {
    id: "downtown-studio",
    name: "Downtown Studio",
    address: "78 Urban Avenue, Downtown",
    capacity: 100,
    pricePerHour: 350,
    bookings: 1,
    image: "/placeholder.svg?height=300&width=500&text=DOWNTOWN+STUDIO",
    description: "A modern studio space perfect for workshops and creative events.",
    amenities: ["Wi-Fi", "Sound System", "Projector", "Accessibility"],
  },
]

// All possible amenities
const allAmenities = [
  "Wi-Fi",
  "Sound System",
  "Whiteboard",
  "Parking",
  "Projector",
  "Catering",
  "Coffee Machine",
  "Accessibility",
]

export default function EditVenuePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    capacity: "",
    pricePerHour: "",
    image: "",
    amenities: [] as string[],
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Fetch venue data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVenue = () => {
      setLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const foundVenue = venuesData.find((v) => v.id === id)
        if (foundVenue) {
          setFormData({
            name: foundVenue.name,
            description: foundVenue.description,
            address: foundVenue.address,
            capacity: String(foundVenue.capacity),
            pricePerHour: String(foundVenue.pricePerHour),
            image: foundVenue.image,
            amenities: foundVenue.amenities,
          })
        }
        setLoading(false)
      }, 500)
    }

    if (id) {
      fetchVenue()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAmenityChange = (amenity: string) => {
    setFormData((prev) => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        }
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // In a real app, this would be an API call to update the venue
    // For now, just simulate success and redirect
    setTimeout(() => {
      router.push(`/manage/venues/${id}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header activePage="manage" />
        <main className="flex-1 bg-white">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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
            <Link href="/manage/venues/myvenues" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venues
            </Link>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Venue Not Found</h1>
              <p className="text-gray-600 mb-6">The venue you're trying to edit doesn't exist or has been removed.</p>
              <Link href="/manage/venues/myvenues" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Return to Venues
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
      <Header activePage="manage" />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <div className="flex items-center mb-6">
            <Link href={`/manage/venues/${id}`} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">Edit Venue</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Venue Details */}
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                      Price per Hour ($)
                    </label>
                    <input
                      type="number"
                      id="pricePerHour"
                      name="pricePerHour"
                      value={formData.pricePerHour}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload and Amenities */}
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Image</label>
                  <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center h-64">
                    {formData.image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Venue"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-1">No image uploaded</p>
                        <button
                          type="button"
                          className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a high-quality image of your venue. Recommended size: 1200x600px.
                  </p>
                </div>

                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {allAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Link
                href={`/manage/venues/${id}`}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
