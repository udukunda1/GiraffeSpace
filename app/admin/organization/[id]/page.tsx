"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock organization data
const organizations = [
  { id: "1", name: "Org Alpha", type: "Event", assigned: "Event A", contact: "alpha@email.com", status: "Active" },
  { id: "2", name: "Org Beta", type: "Venue", assigned: "Venue X", contact: "beta@email.com", status: "Inactive" },
  { id: "3", name: "Org Gamma", type: "Event", assigned: "Event B", contact: "gamma@email.com", status: "Active" },
  { id: "4", name: "Org Delta", type: "Venue", assigned: "Venue Y", contact: "delta@email.com", status: "Active" },
]

export default function OrganizationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const org = organizations.find(o => o.id === id) || organizations[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><span className="font-semibold">Name:</span> {org.name}</div>
                <div><span className="font-semibold">Type:</span> {org.type}</div>
                <div><span className="font-semibold">Assigned:</span> {org.assigned}</div>
                <div><span className="font-semibold">Contact:</span> {org.contact}</div>
                <div><span className="font-semibold">Status:</span> {org.status}</div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/organization/${org.id}/edit`)}>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/organization")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 