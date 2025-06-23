"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock invoice data
const invoices = [
  { id: "1", customer: "Alice", amount: 500, status: "Paid", date: "2024-06-01" },
  { id: "2", customer: "Bob", amount: 300, status: "Unpaid", date: "2024-06-02" },
  { id: "3", customer: "Charlie", amount: 700, status: "Paid", date: "2024-06-03" },
  { id: "4", customer: "Diana", amount: 200, status: "Overdue", date: "2024-06-04" },
]

export default function EditInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const invoice = invoices.find(i => i.id === id) || invoices[0]

  const [customer, setCustomer] = useState(invoice.customer)
  const [amount, setAmount] = useState(String(invoice.amount))
  const [status, setStatus] = useState(invoice.status)
  const [date, setDate] = useState(invoice.date)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add logic to update the invoice
    router.push(`/admin/invoice/${invoice.id}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Edit Invoice</CardTitle>
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
                <div className="flex space-x-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => router.push(`/admin/invoice/${invoice.id}`)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 