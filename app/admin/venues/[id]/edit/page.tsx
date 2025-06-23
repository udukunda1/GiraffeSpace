"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { venues } from "@/data/venues"

export default function EditVenuePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  // Find the venue by id (mock data)
  const venue = venues.find(v => v.venueId === id) || venues[0]

  const [venueName, setVenueName] = useState(venue.venueName)
  const [location, setLocation] = useState(venue.location)
  const [venueType, setVenueType] = useState(venue.venueType)
  const [capacity, setCapacity] = useState(String(venue.capacity))
  const [isAvailable, setIsAvailable] = useState(venue.isAvailable)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the venue
    router.push(`/admin/venues/${venue.venueId}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  placeholder="Venue Name"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                />
                <Select value={venueType} onValueChange={setVenueType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Venue Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auditorium">Auditorium</SelectItem>
                    <SelectItem value="Hall">Hall</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                    <SelectItem value="Conference Room">Conference Room</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Capacity"
                  value={capacity}
                  onChange={e => setCapacity(e.target.value)}
                  required
                  min={1}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={e => setIsAvailable(e.target.checked)}
                    id="isAvailable"
                  />
                  <label htmlFor="isAvailable">Available</label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/venues/${venue.venueId}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 