"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock payment data
const payments = [
  { id: "1", user: "Alice", type: "Event", ref: "Event A", amount: 100, status: "Completed", date: "2024-06-01" },
  { id: "2", user: "Bob", type: "Venue", ref: "Venue X", amount: 250, status: "Pending", date: "2024-06-02" },
  { id: "3", user: "Charlie", type: "Event", ref: "Event B", amount: 150, status: "Completed", date: "2024-06-03" },
  { id: "4", user: "Diana", type: "Venue", ref: "Venue Y", amount: 300, status: "Failed", date: "2024-06-04" },
]

export default function EditPaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const payment = payments.find(p => p.id === id) || payments[0]

  const [user, setUser] = useState(payment.user)
  const [type, setType] = useState(payment.type)
  const [ref, setRef] = useState(payment.ref)
  const [amount, setAmount] = useState(String(payment.amount))
  const [status, setStatus] = useState(payment.status)
  const [date, setDate] = useState(payment.date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the payment
    router.push(`/admin/payment/${payment.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="User" value={user} onChange={e => setUser(e.target.value)} required />
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Reference (Event or Venue)" value={ref} onChange={e => setRef(e.target.value)} required />
                <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required min={1} />
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/payment/${payment.id}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 