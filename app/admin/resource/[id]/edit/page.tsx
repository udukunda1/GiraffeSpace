"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock resource data
const resources = [
  { id: "1", name: "Projector", venue: "Venue X", status: "Available" },
  { id: "2", name: "Sound System", venue: "Venue Y", status: "In Use" },
  { id: "3", name: "Microphone", venue: "Venue Z", status: "Available" },
  { id: "4", name: "Stage Lights", venue: "Venue X", status: "Maintenance" },
]

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const resource = resources.find(r => r.id === id) || resources[0]

  const [name, setName] = useState(resource.name)
  const [venue, setVenue] = useState(resource.venue)
  const [status, setStatus] = useState(resource.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the resource
    router.push(`/admin/resource/${resource.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Resource Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} required />
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/resource/${resource.id}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 