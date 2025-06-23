"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock resource data
const resources = [
  { id: "1", name: "Projector", venue: "Venue X", status: "Available" },
  { id: "2", name: "Sound System", venue: "Venue Y", status: "In Use" },
  { id: "3", name: "Microphone", venue: "Venue Z", status: "Available" },
  { id: "4", name: "Stage Lights", venue: "Venue X", status: "Maintenance" },
]

export default function ResourceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const resource = resources.find(r => r.id === id) || resources[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><span className="font-semibold">Name:</span> {resource.name}</div>
                <div><span className="font-semibold">Venue:</span> {resource.venue}</div>
                <div><span className="font-semibold">Status:</span> {resource.status}</div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/resource/${resource.id}/edit`)}>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/resource")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 