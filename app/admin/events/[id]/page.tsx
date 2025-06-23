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

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "users", label: "Users", icon: UsersIcon, href: "/admin/users" },
  ]

  useEffect(() => {
    const found = events.find(e => e.eventId === params.id)
    setEvent(found)
  }, [params.id])

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="admin" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <Calendar className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.id === "events"
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
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