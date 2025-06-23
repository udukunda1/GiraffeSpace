"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users as UsersIcon, Home, Edit, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { events } from "@/data/events"

interface EventDetailsProps {
  params: { id: string }
}

export default function EventDetails({ params }: EventDetailsProps) {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)


  useEffect(() => {
    const found = events.find(e => e.eventId === params.id)
    setEvent(found)
  }, [params.id])

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex flex-1">
       
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/events")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events </Button>
                <Button variant="outline" onClick={() => router.push(`/admin/events/${params.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Event
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>{event.eventTitle}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Venue</p>
                      <p className="font-medium">{event.venue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{event.eventDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{event.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Organizer</p>
                      <p className="font-medium">{event.organizer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium">{event.eventCategory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 