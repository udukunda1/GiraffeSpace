"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const events = [
  { id: "1", title: "Tech Conference 2024" },
  { id: "2", title: "Music Festival" },
  { id: "3", title: "Art Expo" },
]

export default function AddTicket() {
  const router = useRouter()
  const [form, setForm] = useState({
    code: "",
    eventId: events[0].id,
    holder: "",
    status: "Active",
    date: ""
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
      router.push("/admin/ticket")
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add Ticket</CardTitle>
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
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Saving..." : "Add Ticket"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 