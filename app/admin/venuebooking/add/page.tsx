"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddVenueBookingPage() {
  const router = useRouter()
  const [venue, setVenue] = useState("")
  const [user, setUser] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("Confirmed")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to save the new booking
    router.push("/admin/venuebooking")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Add Venue Booking</CardTitle>
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
                <Button type="submit" className="w-full">Add Booking</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 