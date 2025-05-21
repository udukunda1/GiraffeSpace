"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

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

export default function CreateVenuePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
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

    // In a real app, this would be an API call to create the venue
    // For now, just simulate success and redirect
    setTimeout(() => {
      router.push("/manage/venues")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="manage" />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <div className="flex items-center mb-6">
            <Link href="/manage/venues" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">Add New Venue</h1>

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
                    placeholder="Enter venue name"
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
                    placeholder="Describe your venue"
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
                    placeholder="Enter venue address"
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
                      placeholder="Max number of people"
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
                      placeholder="Price per hour"
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
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">No image uploaded</p>
                    <button
                      type="button"
                      className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Choose File
                    </button>
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
                href="/manage/venues"
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
                {saving ? "Creating..." : "Create Venue"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
