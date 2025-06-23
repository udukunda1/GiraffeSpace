"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddOrganizationPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [assigned, setAssigned] = useState("")
  const [contact, setContact] = useState("")
  const [status, setStatus] = useState("Active")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to save the new organization
    router.push("/admin/organization")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Add New Organization</CardTitle>
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
                <Button type="submit" className="w-full">Add Organization</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 