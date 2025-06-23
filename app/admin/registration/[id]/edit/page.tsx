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

export default function EditRegistration() {
  const router = useRouter()
  const params = useParams()
  const reg = registrations.find(r => r.id === params.id) || registrations[0]
  const [form, setForm] = useState({ name: reg.name, email: reg.email, status: reg.status, eventId: reg.eventId })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      router.push(`/admin/registration/${reg.id}`)
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
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
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
              <Button type="button" variant="outline" onClick={() => router.push(`/admin/registration/${reg.id}`)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 