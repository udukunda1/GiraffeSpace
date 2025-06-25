"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users as UsersIcon, Home, Edit, ArrowLeft, Star, QrCode } from "lucide-react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import ApiService from "@/api/apiConfig"

interface EventDetailsProps {
  params: { id: string }
}

export default function EventDetails({ params }: EventDetailsProps) {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      try {
        const data = await ApiService.getEventById(params.id)
        setEvent(data)
      } catch (e) {
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  if (!event) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Event not found.</div>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/events")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events </Button>
                <Button variant="outline" onClick={() => router.push(`/admin/events/${params.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Event
                </Button>
              </div>
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {event.eventTitle}
                      {event.isFeatured && <Star className="h-5 w-5 text-yellow-400" title="Featured Event" />}
                    </CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  {event.imageURL && (
                    <img src={event.imageURL} alt="Event" className="h-32 w-32 object-cover rounded-md border" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="h-4 w-4" /> Dates</p>
                      <p className="font-medium">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : "-"} to {event.endDate ? new Date(event.endDate).toLocaleDateString() : "-"}
                      </p>
                      <p className="text-sm text-gray-600">Time: {event.startTime} - {event.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{event.status}</p>
                      <p className="text-sm text-gray-600 mt-2">Type</p>
                      <p className="font-medium">{event.eventType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max Attendees</p>
                      <p className="font-medium">{event.maxAttendees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{event.eventCategory || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">QR Code</p>
                      {event.qrCode ? (
                        <a href={event.qrCode} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 underline"><QrCode className="h-4 w-4" /> View QR</a>
                      ) : (
                        <span className="text-gray-400">No QR code</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Organizer Info */}
              {event.organizer && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {event.organizer.profilePictureURL && (
                        <img src={event.organizer.profilePictureURL} alt="Organizer" className="h-20 w-20 rounded-full object-cover border" />
                      )}
                      <div>
                        <p className="font-semibold">{event.organizer.firstName} {event.organizer.lastName}</p>
                        <p className="text-sm text-gray-600">{event.organizer.email}</p>
                        <p className="text-sm text-gray-600">{event.organizer.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mt-2">{event.organizer.bio}</p>
                        <p className="text-xs text-gray-400 mt-1">Role: {event.organizer.role?.roleName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Organization Info */}
              {event.organization && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-semibold">{event.organization.organizationName}</p>
                      <p className="text-sm text-gray-600">{event.organization.description}</p>
                      <p className="text-sm text-gray-600 mt-2">Type: {event.organization.organizationType}</p>
                      <p className="text-sm text-gray-600">Contact: {event.organization.contactEmail} | {event.organization.contactPhone}</p>
                      <p className="text-sm text-gray-600">Address: {event.organization.address}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 