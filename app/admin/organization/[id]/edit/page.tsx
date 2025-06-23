"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock organization data
const organizations = [
  { id: "1", name: "Org Alpha", type: "Event", assigned: "Event A", contact: "alpha@email.com", status: "Active" },
  { id: "2", name: "Org Beta", type: "Venue", assigned: "Venue X", contact: "beta@email.com", status: "Inactive" },
  { id: "3", name: "Org Gamma", type: "Event", assigned: "Event B", contact: "gamma@email.com", status: "Active" },
  { id: "4", name: "Org Delta", type: "Venue", assigned: "Venue Y", contact: "delta@email.com", status: "Active" },
]

export default function EditOrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const org = organizations.find(o => o.id === id) || organizations[0]

  const [name, setName] = useState(org.name)
  const [type, setType] = useState(org.type)
  const [assigned, setAssigned] = useState(org.assigned)
  const [contact, setContact] = useState(org.contact)
  const [status, setStatus] = useState(org.status)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the organization
    router.push(`/admin/organization/${org.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Organization Name" value={name} onChange={e => setName(e.target.value)} required />
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Assigned to (Event or Venue)" value={assigned} onChange={e => setAssigned(e.target.value)} required />
                <Input placeholder="Contact Email" value={contact} onChange={e => setContact(e.target.value)} required />
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/organization/${org.id}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 