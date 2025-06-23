"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { venues } from "@/data/venues"

export default function VenueDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  // Find the venue by id (mock data)
  const venue = venues.find(v => v.venueId === id) || venues[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Venue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">Name:</span> {venue.venueName}
                </div>
                <div>
                  <span className="font-semibold">Location:</span> {venue.location}
                </div>
                <div>
                  <span className="font-semibold">Type:</span> {venue.venueType}
                </div>
                <div>
                  <span className="font-semibold">Capacity:</span> {venue.capacity}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {" "}
                  <Badge variant={venue.isAvailable ? "default" : "secondary"}>
                    {venue.isAvailable ? "Available" : "Pending Approval"}
                  </Badge>
                </div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/venues/${venue.venueId}/edit`)}>
                    Edit
                  </Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/venues")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 