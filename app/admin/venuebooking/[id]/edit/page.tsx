"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock booking data
const bookings = [
  { id: "1", venue: "Venue X", user: "Alice", date: "2024-06-10", status: "Confirmed" },
  { id: "2", venue: "Venue Y", user: "Bob", date: "2024-06-12", status: "Pending" },
  { id: "3", venue: "Venue Z", user: "Charlie", date: "2024-06-15", status: "Cancelled" },
  { id: "4", venue: "Venue X", user: "Diana", date: "2024-06-18", status: "Confirmed" },
]

export default function EditVenueBookingPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const booking = bookings.find(b => b.id === id) || bookings[0]

  const [venue, setVenue] = useState(booking.venue)
  const [user, setUser] = useState(booking.user)
  const [date, setDate] = useState(booking.date)
  const [status, setStatus] = useState(booking.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the booking
    router.push(`/admin/venuebooking/${booking.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Venue Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} required />
                <Input placeholder="User" value={user} onChange={e => setUser(e.target.value)} required />
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/venuebooking/${booking.id}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 