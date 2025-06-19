"use client"

import type React from "react"
import ImageUpload from './uploadImage';

import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import ApiService from "@/api/apiConfig";

export default function CreateVenuePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    latitude:"",
    longitude: "",
    venueType: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    capacity: "",
    pricePerHour: "",
    image: "",
    amenities: [] as string[],
  })
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [amenitiesError, setAmenitiesError] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [addingAmenity, setAddingAmenity] = useState(false);
  const [addAmenityError, setAddAmenityError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Fetch amenities from backend
  useEffect(() => {
    const fetchAmenities = async () => {
      setAmenitiesLoading(true);
      setAmenitiesError("");
      try {
        const response = await ApiService.getAllAmenities();
        // Assume response is an array of amenities, each with a name property
        setAmenities(response.amenities ? response.amenities.map((a: any) => a.name) : []);
      } catch (err) {
        setAmenitiesError("Failed to load amenities.");
      } finally {
        setAmenitiesLoading(false);
      }
    };
    fetchAmenities();
  }, []);

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
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <div className="flex items-center mb-6">
            <Link href="/manage/venues/myvenues" className="flex items-center text-gray-600 hover:text-gray-900">
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
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter venue location"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                  <div className="mb-4">
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    placeholder="Enter venue latitude"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    placeholder="Enter venue longitude"
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
                  <div className="mb-4">
                  <label htmlFor="venueType" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Type
                  </label>
                  <input
                    type="text"
                    id="venueType"
                    name="venueType"
                    value={formData.venueType}
                    onChange={handleInputChange}
                    placeholder="Enter venue venue Type"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                  <div className="mb-4">
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Enter venue Owner Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter venue Owner Email"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Enter venue Owner Phone Number"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Website Url
                  </label>
                  <input
                    type="text"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="Enter venue website Url"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>


                
                </div>
              </div>

              {/* Right Column - Image Upload and Amenities */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Image</label>
                  <ImageUpload />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a high-quality image of your venue. Recommended size: 1200x600px.
                  </p>
                </div>
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
                  {amenitiesLoading ? (
                    <div className="text-gray-500 text-sm mb-2">Loading amenities...</div>
                  ) : amenitiesError ? (
                    <div className="text-red-500 text-sm mb-2">{amenitiesError}</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {amenities.map((amenity) => (
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
                  )}
                  {/* Add new amenity UI */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Add another amenity (resource):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAmenity}
                        onChange={e => setNewAmenity(e.target.value)}
                        placeholder="Add new amenity"
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        disabled={addingAmenity}
                      />
                      <button
                        type="button"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        disabled={addingAmenity || !newAmenity.trim()}
                        onClick={async () => {
                          setAddAmenityError("");
                          setAddingAmenity(true);
                          try {
                            await ApiService.addAmenity({ name: newAmenity.trim() });
                            setNewAmenity("");
                            // Re-fetch amenities
                            setAmenitiesLoading(true);
                            const response = await ApiService.getAllAmenities();
                            setAmenities(response.amenities ? response.amenities.map((a: any) => a.name) : []);
                          } catch (err) {
                            setAddAmenityError("Failed to add amenity.");
                          } finally {
                            setAddingAmenity(false);
                            setAmenitiesLoading(false);
                          }
                        }}
                      >
                        {addingAmenity ? "Adding..." : "Add"}
                      </button>
                    </div>
                    {addAmenityError && <div className="text-red-500 text-xs mt-1">{addAmenityError}</div>}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent "></div>
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
