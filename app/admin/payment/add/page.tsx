"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddPaymentPage() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [type, setType] = useState("")
  const [ref, setRef] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("Completed")
  const [date, setDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to save the new payment
    router.push("/admin/payment")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Add New Payment</CardTitle>
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
                <Button type="submit" className="w-full">Add Payment</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 