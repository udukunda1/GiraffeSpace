"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

export default function EditTicket() {
  const router = useRouter()
  const params = useParams()
  const ticket = tickets.find(t => t.id === params.id) || tickets[0]
  const [form, setForm] = useState({
    code: ticket.code,
    eventId: ticket.eventId,
    holder: ticket.holder,
    status: ticket.status,
    date: ticket.date
  })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      router.push(`/admin/ticket/${ticket.id}`)
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ticket Code</label>
              <input name="code" value={form.code} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event</label>
              <select name="eventId" value={form.eventId} onChange={handleChange} className="w-full border rounded px-3 py-2">
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Holder</label>
              <input name="holder" value={form.holder} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="Active">Active</option>
                <option value="Used">Used</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/ticket/${ticket.id}`)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 