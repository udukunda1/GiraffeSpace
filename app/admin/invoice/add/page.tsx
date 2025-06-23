"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function AddInvoicePage() {
  const router = useRouter()
  const [customer, setCustomer] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("Paid")
  const [date, setDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to save the new invoice
    router.push("/admin/invoice")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Add New Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Customer" value={customer} onChange={e => setCustomer(e.target.value)} required />
                <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required min={1} />
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <Button type="submit" className="w-full">Add Invoice</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 