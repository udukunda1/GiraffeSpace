"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock booking data
const bookings = [
  { id: "1", venue: "Venue X", user: "Alice", date: "2024-06-10", status: "Confirmed" },
  { id: "2", venue: "Venue Y", user: "Bob", date: "2024-06-12", status: "Pending" },
  { id: "3", venue: "Venue Z", user: "Charlie", date: "2024-06-15", status: "Cancelled" },
  { id: "4", venue: "Venue X", user: "Diana", date: "2024-06-18", status: "Confirmed" },
]

export default function VenueBookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const booking = bookings.find(b => b.id === id) || bookings[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Venue Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><span className="font-semibold">Venue:</span> {booking.venue}</div>
                <div><span className="font-semibold">User:</span> {booking.user}</div>
                <div><span className="font-semibold">Date:</span> {booking.date}</div>
                <div><span className="font-semibold">Status:</span> {booking.status}</div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/venuebooking/${booking.id}/edit`)}>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/venuebooking")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 