"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users as UsersIcon, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { events } from "@/data/events"

interface EditEventProps {
  params: { id: string }
}

export default function EditEvent({ params }: EditEventProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement event update logic
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/events")
    }, 1000)
  }

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
                <h2 className="text-2xl font-bold">Edit Event</h2>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Edit Event Information</CardTitle>
                  <CardDescription>Update the event details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="eventTitle">Event Title</Label>
                          <Input id="eventTitle" defaultValue={event.eventTitle} required />
                        </div>
                        <div>
                          <Label htmlFor="venue">Venue</Label>
                          <Input id="venue" defaultValue={event.venue} required />
                        </div>
                        <div>
                          <Label htmlFor="eventDate">Event Date</Label>
                          <Input id="eventDate" type="date" defaultValue={event.eventDate} required />
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Input id="status" defaultValue={event.status} required />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input id="description" defaultValue={event.description} />
                        </div>
                        <div>
                          <Label htmlFor="organizer">Organizer</Label>
                          <Input id="organizer" defaultValue={event.organizer} />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" defaultValue={event.eventCategory} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>Cancel</Button>
                      <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                    </div>
                  </form>
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