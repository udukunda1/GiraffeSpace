"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddVenuePage() {
  const router = useRouter()
  const [venueName, setVenueName] = useState("")
  const [location, setLocation] = useState("")
  const [venueType, setVenueType] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to save the new venue
    router.push("/admin/venues")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Add New Venue</CardTitle>
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
                <Button type="submit" className="w-full">Add Venue</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 