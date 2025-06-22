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
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    venueName: "",
    capacity: "",
    location: "",
    latitude: "",
    longitude: "",
    googleMapsLink: "",
    managerId: user?.userId || "",
    venueType: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    websiteURL: "",
    description: "",
    imageSrc: "",
    organizationId: "",
    resources: [] as any[],
  })
  const [organizations, setOrganizations] = useState<any[]>([])
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgError, setOrgError] = useState("")
  const [resourceForm, setResourceForm] = useState({
    resourceName: "",
    description: "",
    costPerUnit: "",
    quantity: "",
  })
  const [resources, setResources] = useState<any[]>([])

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  // Fetch organizations for user
  useEffect(() => {
    const fetchUserOrgs = async () => {
      setOrgLoading(true)
      setOrgError("")
      try {
        if (user && user.userId) {
          // const response = await ApiService.getUserById(user.userId)
          const response = {
            user: {
              organizations: [
                { organizationId: "1", organizationName: "Organization 1" },
                { organizationId: "2", organizationName: "Organization 2" },
              ],
            },
          }
          setOrganizations(response?.user?.organizations || [])
        }
      } catch (err) {
        setOrgError("Failed to load organizations.")
      } finally {
        setOrgLoading(false)
      }
    }
    fetchUserOrgs()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, organizationId: e.target.value }))
  }

  // Resource form handlers
  const handleResourceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResourceForm((prev) => ({ ...prev, [name]: value }))
  }
  const handleAddResource = () => {
    if (!resourceForm.resourceName || !resourceForm.quantity) return
    setResources((prev) => [
      ...prev,
      {
        resource: {
          resourceName: resourceForm.resourceName,
          description: resourceForm.description,
          costPerUnit: parseFloat(resourceForm.costPerUnit) || 0,
        },
        quantity: parseInt(resourceForm.quantity, 10) || 1,
      },
    ])
    setResourceForm({ resourceName: "", description: "", costPerUnit: "", quantity: "" })
  }
  const handleRemoveResource = (idx: number) => {
    setResources((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const venuePayload = {
        ...formData,
        capacity: parseInt(formData.capacity, 10) || 0,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        managerId: user?.userId,
        resources,
        imageSrc: formData.imageSrc, // TODO: handle image upload
      }
      await ApiService.createVenue(venuePayload)
      router.push("/manage/venues")
    } catch (err) {
      // handle error (show toast, etc)
    } finally {
      setSaving(false)
    }
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
                  <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
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

                <div className="mb-4">
                  <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  {orgLoading ? (
                    <div className="text-gray-500 text-sm">Loading organizations...</div>
                  ) : orgError ? (
                    <div className="text-red-500 text-sm">{orgError}</div>
                  ) : (
                    <select
                      id="organizationId"
                      name="organizationId"
                      value={formData.organizationId}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                      required
                    >
                      <option value="">Select organization</option>
                      {organizations.map((org) => (
                        <option key={org.organizationId} value={org.organizationId}>
                          {org.organizationName}
                        </option>
                      ))}
                    </select>
                  )}
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
                    <label htmlFor="websiteURL" className="block text-sm font-medium text-gray-700 mb-1">
                      Website Url
                    </label>
                    <input
                      type="text"
                      id="websiteURL"
                      name="websiteURL"
                      value={formData.websiteURL}
                      onChange={handleInputChange}
                      placeholder="Enter venue website Url"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload and Resources */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Image</label>
                  <ImageUpload />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a high-quality image of your venue. Recommended size: 1200x600px.
                  </p>
                </div>
                {/* Resources Form */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4 shadow-sm max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resources</label>
                  <div className="flex flex-col gap-2 mb-2">
                    <input
                      type="text"
                      name="resourceName"
                      value={resourceForm.resourceName}
                      onChange={handleResourceInputChange}
                      placeholder="Resource Name"
                      className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      name="description"
                      value={resourceForm.description}
                      onChange={handleResourceInputChange}
                      placeholder="Description"
                      className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      name="costPerUnit"
                      value={resourceForm.costPerUnit}
                      onChange={handleResourceInputChange}
                      placeholder="Cost Per Unit"
                      className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="number"
                      name="quantity"
                      value={resourceForm.quantity}
                      onChange={handleResourceInputChange}
                      placeholder="Quantity"
                      className="px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mt-2 transition-colors"
                      onClick={handleAddResource}
                    >
                      Add Resource
                    </button>
                  </div>
                  {/* List of added resources */}
                  {resources.length > 0 && (
                    <ul className="mb-2 mt-2 divide-y divide-gray-200">
                      {resources.map((res, idx) => (
                        <li key={idx} className="flex items-center justify-between py-2 text-sm">
                          <span className="font-medium text-gray-800">{res.resource.resourceName}</span>
                          <span className="text-gray-500">x{res.quantity}</span>
                          <button type="button" className="text-red-500 hover:underline ml-2" onClick={() => handleRemoveResource(idx)}>
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
