"use client"

import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Building, CheckCircle } from "lucide-react"
import ApiService from "@/api/apiConfig"
import { venues } from "@/data/venues"

interface Venue {
  venueId: string
  venueName: string
  capacity: number
  location: string
  latitude: number
  longitude: number
  googleMapsLink: string
  managerId: string
  isAvailable: boolean
  isBooked: boolean
  amenities: string
  venueType: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  websiteURL?: string
  description?: string
  availability?: Array<{
    date: string
    timeSlots: string[]
  }>
  imageSrc?: string
}

interface Organization {
  organizationId: string
  organizationName: string
  description: string
  contactEmail: string
  contactPhone: string
  isExternal: boolean
  address: string
  organizationType: string
}

export default function CreateEventPage() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Step 1: Event basics
  const [eventBasics, setEventBasics] = useState({
    eventTitle: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
  })

  // Step 2: Venue selection
  const [availableVenues, setAvailableVenues] = useState<Venue[]>([])
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [venueLoading, setVenueLoading] = useState(false)
  const [venueError, setVenueError] = useState("")
  const [showVenueDetails, setShowVenueDetails] = useState<Venue | null>(null)

  // Step 3: Event details
  const [eventDetails, setEventDetails] = useState({
    description: "",
    eventCategory: "",
    eventType: "Conference" as "Conference" | "Festival" | "Academic" | "Networking" | "Sports" | "Workshop",
    maxAttendees: "",
    imageURL: "",
    ticketingDetails: "",
    refundPolicy: "",
    dressCode: "",
    ageRestriction: "",
    tags: [] as string[],
    tagsInput: "",
    websiteURL: "",
    hashtag: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  // Step 4: Organization selection
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgError, setOrgError] = useState("")

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
          const response = {user: {organizations: [{organizationId: "1", organizationName: "Test Organization", description: "Test Description", contactEmail: "test@test.com", contactPhone: "1234567890", isExternal: false, address: "Test Address", organizationType: "Test Type"},{organizationId: "2", organizationName: "Test Organization 2", description: "Test Description 2", contactEmail: "test2@test.com", contactPhone: "1234567890", isExternal: false, address: "Test Address 2", organizationType: "Test Type 2"}]}}
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

  const handleEventBasicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEventBasics(prev => ({ ...prev, [name]: value }))
  }

  const handleEventDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEventDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEventDetails(prev => ({ ...prev, tagsInput: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        // Store the base64 data in imageURL
        setEventDetails(prev => ({ ...prev, imageURL: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    setEventDetails(prev => ({ ...prev, imageURL: "" }))
  }

  const fetchAvailableVenues = async () => {
    if (!eventBasics.eventDate || !eventBasics.eventStartTime || !eventBasics.eventEndTime) {
      setError("Please fill in all date and time fields")
      return
    }

    setVenueLoading(true)
    setVenueError("")
    try {
      // const response = await ApiService.getAvailableVenues(
      //   eventBasics.eventDate,
      //   eventBasics.eventStartTime,
      //   eventBasics.eventEndTime
      // )
      const response = {venues: venues}
      setAvailableVenues(response.venues || [])
      if (response.venues?.length === 0) {
        setVenueError("No venues available for the selected date and time")
      }
    } catch (err) {
      setVenueError("Failed to fetch available venues")
    } finally {
      setVenueLoading(false)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!eventBasics.eventTitle || !eventBasics.eventDate || !eventBasics.eventStartTime || !eventBasics.eventEndTime) {
        setError("Please fill in all required fields")
        return
      }
      fetchAvailableVenues()
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!selectedVenue) {
        setError("Please select a venue")
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      if (!eventDetails.description || !eventDetails.eventCategory || !eventDetails.maxAttendees) {
        setError("Please fill in all required fields")
        return
      }
      setCurrentStep(4)
    }
    setError("")
  }

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!selectedOrganization) {
      setError("Please select an organization")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Process tags from raw input
      const processedTags = eventDetails.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const eventPayload = {
        ...eventBasics,
        ...eventDetails,
        maxAttendees: parseInt(eventDetails.maxAttendees),
        venueId: selectedVenue!.venueId,
        organizationId: selectedOrganization.organizationId,
        tags: processedTags,
      }
      console.log(eventPayload);
      await ApiService.createEvent(eventPayload)
      router.push("/manage/events")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create event")
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="eventTitle"
          value={eventBasics.eventTitle}
          onChange={handleEventBasicsChange}
          placeholder="Enter event title"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Date *
        </label>
        <input
          type="date"
          name="eventDate"
          value={eventBasics.eventDate}
          onChange={handleEventBasicsChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            name="eventStartTime"
            value={eventBasics.eventStartTime}
            onChange={handleEventBasicsChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Time *
          </label>
          <input
            type="time"
            name="eventEndTime"
            value={eventBasics.eventEndTime}
            onChange={handleEventBasicsChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Event Details</h3>
        <p className="text-blue-700 text-sm">
          {eventBasics.eventTitle} on {eventBasics.eventDate} from {eventBasics.eventStartTime} to {eventBasics.eventEndTime}
        </p>
      </div>

      {venueLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for available venues...</p>
        </div>
      ) : venueError ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{venueError}</p>
          <button
            onClick={fetchAvailableVenues}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Available Venues</h3>
          {availableVenues.map((venue) => (
            <div
              key={venue.venueId}
              className={`border rounded-lg p-4 transition-colors ${
                selectedVenue?.venueId === venue.venueId
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{venue.venueName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{venue.location}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {venue.capacity} people
                    </span>
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {venue.venueType}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedVenue?.venueId === venue.venueId ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Selected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowVenueDetails(venue)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setSelectedVenue(venue)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Select Venue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Venue Details Modal */}
      {showVenueDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Venue Details</h3>
                <button
                  onClick={() => setShowVenueDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{showVenueDetails.venueName}</h4>
                  <p className="text-gray-600">{showVenueDetails.location}</p>
                </div>

                {showVenueDetails.imageSrc && (
                  <div>
                    <img
                      src={showVenueDetails.imageSrc}
                      alt={showVenueDetails.venueName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <p className="text-gray-900">{showVenueDetails.capacity} people</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue Type</label>
                    <p className="text-gray-900">{showVenueDetails.venueType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                    <p className="text-gray-900">{showVenueDetails.contactPerson}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="text-gray-900">{showVenueDetails.contactEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <p className="text-gray-900">{showVenueDetails.contactPhone}</p>
                  </div>
                  {showVenueDetails.websiteURL && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <a
                        href={showVenueDetails.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {showVenueDetails.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{showVenueDetails.description}</p>
                  </div>
                )}

                {showVenueDetails.amenities && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {showVenueDetails.amenities.split(',').map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                        >
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {showVenueDetails.googleMapsLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <a
                      href={showVenueDetails.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowVenueDetails(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedVenue(showVenueDetails)
                    setShowVenueDetails(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Select This Venue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-900 mb-2">Selected Venue</h3>
        <p className="text-green-700 text-sm">
          {selectedVenue?.venueName} - {selectedVenue?.location}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={eventDetails.description}
          onChange={handleEventDetailsChange}
          placeholder="Describe your event"
          rows={4}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Category *
          </label>
          <input
            type="text"
            name="eventCategory"
            value={eventDetails.eventCategory}
            onChange={handleEventDetailsChange}
            placeholder="e.g., Technology, Business"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type *
          </label>
          <select
            name="eventType"
            value={eventDetails.eventType}
            onChange={handleEventDetailsChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Conference">Conference</option>
            <option value="Festival">Festival</option>
            <option value="Academic">Academic</option>
            <option value="Networking">Networking</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Attendees *
        </label>
        <input
          type="number"
          name="maxAttendees"
          value={eventDetails.maxAttendees}
          onChange={handleEventDetailsChange}
          placeholder="Enter maximum number of attendees"
          min="1"
          max={selectedVenue?.capacity || 1000}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {selectedVenue && (
          <p className="text-sm text-gray-500 mt-1">
            Venue capacity: {selectedVenue.capacity} people
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Image
        </label>
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Event preview"
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500 font-medium">Upload an image</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={eventDetails.tagsInput}
          onChange={handleTagsChange}
          placeholder="e.g., technology, networking, innovation"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticketing Details
          </label>
          <input
            type="text"
            name="ticketingDetails"
            value={eventDetails.ticketingDetails}
            onChange={handleEventDetailsChange}
            placeholder="e.g., Free entry, $50 per ticket"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refund Policy
          </label>
          <input
            type="text"
            name="refundPolicy"
            value={eventDetails.refundPolicy}
            onChange={handleEventDetailsChange}
            placeholder="e.g., Full refund 48h before"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dress Code
          </label>
          <input
            type="text"
            name="dressCode"
            value={eventDetails.dressCode}
            onChange={handleEventDetailsChange}
            placeholder="e.g., Business casual"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Restriction
          </label>
          <input
            type="text"
            name="ageRestriction"
            value={eventDetails.ageRestriction}
            onChange={handleEventDetailsChange}
            placeholder="e.g., 18+, All ages"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            name="websiteURL"
            value={eventDetails.websiteURL}
            onChange={handleEventDetailsChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hashtag
          </label>
          <input
            type="text"
            name="hashtag"
            value={eventDetails.hashtag}
            onChange={handleEventDetailsChange}
            placeholder="#EventName2024"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-2">Event Summary</h3>
        <div className="text-sm text-purple-700 space-y-1">
          <p><strong>Title:</strong> {eventBasics.eventTitle}</p>
          <p><strong>Date:</strong> {eventBasics.eventDate} at {eventBasics.eventStartTime}-{eventBasics.eventEndTime}</p>
          <p><strong>Venue:</strong> {selectedVenue?.venueName}</p>
          <p><strong>Type:</strong> {eventDetails.eventType}</p>
          <p><strong>Max Attendees:</strong> {eventDetails.maxAttendees}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Organization *
        </label>
        {orgLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-sm mt-2">Loading organizations...</p>
          </div>
        ) : orgError ? (
          <div className="text-red-600 text-sm">{orgError}</div>
        ) : (
          <div className="space-y-2">
            {organizations.map((org) => (
              <div
                key={org.organizationId}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedOrganization?.organizationId === org.organizationId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedOrganization(org)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{org.organizationName}</h4>
                    <p className="text-sm text-gray-600">{org.description}</p>
                  </div>
                  {selectedOrganization?.organizationId === org.organizationId && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  const steps = [
    { number: 1, title: "Event Basics", icon: Calendar },
    { number: 2, title: "Select Venue", icon: MapPin },
    { number: 3, title: "Event Details", icon: Clock },
    { number: 4, title: "Organization", icon: Building },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 md:px-16 max-w-4xl py-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>

          <div className="bg-white rounded-lg shadow-sm border">
            {/* Step indicator */}
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.number
                  const isCompleted = currentStep > step.number
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        isActive 
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 bg-gray-50 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {renderStepContent()}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !selectedOrganization}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Creating...
                        </>
                      ) : (
                        'Create Event'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
