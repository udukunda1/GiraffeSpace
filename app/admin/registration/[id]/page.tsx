"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft } from "lucide-react"

const events = [
  { id: "1", title: "Tech Conference 2024" },
  { id: "2", title: "Music Festival" },
  { id: "3", title: "Art Expo" },
]

const registrations = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "Approved",
    date: "2024-06-01",
    eventId: "1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "Pending",
    date: "2024-06-02",
    eventId: "2",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Rejected",
    date: "2024-06-03",
    eventId: "1",
  },
]

export default function RegistrationDetail() {
  const router = useRouter()
  const params = useParams()
  const reg = registrations.find(r => r.id === params.id) || registrations[0]
  const event = events.find(ev => ev.id === reg.eventId)

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Registration Details</CardTitle>
          <CardDescription>View registration information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Name:</span> {reg.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {reg.email}
            </div>
            <div>
              <span className="font-semibold">Event:</span> {event?.title || "-"}
            </div>
            <div>
              <span className="font-semibold">Status:</span> <Badge variant={reg.status === "Approved" ? "default" : reg.status === "Pending" ? "secondary" : "destructive"}>{reg.status}</Badge>
            </div>
            <div>
              <span className="font-semibold">Date:</span> {reg.date}
            </div>
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" onClick={() => router.push("/admin/registration")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back </Button>
              <Button variant="outline" onClick={() => router.push(`/admin/registration/${reg.id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 