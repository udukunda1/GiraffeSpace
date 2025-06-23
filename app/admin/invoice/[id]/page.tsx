"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock invoice data
const invoices = [
  { id: "1", customer: "Alice", amount: 500, status: "Paid", date: "2024-06-01" },
  { id: "2", customer: "Bob", amount: 300, status: "Unpaid", date: "2024-06-02" },
  { id: "3", customer: "Charlie", amount: 700, status: "Paid", date: "2024-06-03" },
  { id: "4", customer: "Diana", amount: 200, status: "Overdue", date: "2024-06-04" },
]

export default function InvoiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const invoice = invoices.find(i => i.id === id) || invoices[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><span className="font-semibold">Customer:</span> {invoice.customer}</div>
                <div><span className="font-semibold">Amount:</span> ${invoice.amount}</div>
                <div><span className="font-semibold">Status:</span> {invoice.status}</div>
                <div><span className="font-semibold">Date:</span> {invoice.date}</div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/invoice/${invoice.id}/edit`)}>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/invoice")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 