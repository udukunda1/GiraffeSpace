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

export default function AddRegistration() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", status: "Pending", eventId: events[0].id })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      router.push("/admin/registration")
    }, 1000)
  }

  return (
    <div className="flex-1 p-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Add Registration</CardTitle>
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
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Saving..." : "Add Registration"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 