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

const tickets = [
  {
    id: "1",
    code: "TCKT-001",
    eventId: "1",
    holder: "John Doe",
    status: "Active",
    date: "2024-06-01",
  },
  {
    id: "2",
    code: "TCKT-002",
    eventId: "2",
    holder: "Jane Smith",
    status: "Used",
    date: "2024-06-02",
  },
  {
    id: "3",
    code: "TCKT-003",
    eventId: "1",
    holder: "Alice Johnson",
    status: "Cancelled",
    date: "2024-06-03",
  },
]

export default function TicketDetail() {
  const router = useRouter()
  const params = useParams()
  const ticket = tickets.find(t => t.id === params.id) || tickets[0]
  const event = events.find(ev => ev.id === ticket.eventId)

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
          <CardDescription>View ticket information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Code:</span> {ticket.code}
            </div>
            <div>
              <span className="font-semibold">Event:</span> {event?.title || "-"}
            </div>
            <div>
              <span className="font-semibold">Holder:</span> {ticket.holder}
            </div>
            <div>
              <span className="font-semibold">Status:</span> <Badge variant={ticket.status === "Active" ? "default" : ticket.status === "Used" ? "secondary" : "destructive"}>{ticket.status}</Badge>
            </div>
            <div>
              <span className="font-semibold">Date:</span> {ticket.date}
            </div>
            <div className="flex space-x-2 mt-6">
              <Button variant="outline" onClick={() => router.push("/admin/ticket")}> <ArrowLeft className="h-4 w-4 mr-2" /> Back </Button>
              <Button variant="outline" onClick={() => router.push(`/admin/ticket/${ticket.id}/edit`)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 