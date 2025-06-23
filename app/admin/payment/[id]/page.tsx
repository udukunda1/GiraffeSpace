"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock payment data
const payments = [
  { id: "1", user: "Alice", type: "Event", ref: "Event A", amount: 100, status: "Completed", date: "2024-06-01" },
  { id: "2", user: "Bob", type: "Venue", ref: "Venue X", amount: 250, status: "Pending", date: "2024-06-02" },
  { id: "3", user: "Charlie", type: "Event", ref: "Event B", amount: 150, status: "Completed", date: "2024-06-03" },
  { id: "4", user: "Diana", type: "Venue", ref: "Venue Y", amount: 300, status: "Failed", date: "2024-06-04" },
]

export default function PaymentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const payment = payments.find(p => p.id === id) || payments[0]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><span className="font-semibold">User:</span> {payment.user}</div>
                <div><span className="font-semibold">Type:</span> {payment.type}</div>
                <div><span className="font-semibold">Reference:</span> {payment.ref}</div>
                <div><span className="font-semibold">Amount:</span> ${payment.amount}</div>
                <div><span className="font-semibold">Status:</span> {payment.status}</div>
                <div><span className="font-semibold">Date:</span> {payment.date}</div>
                <div className="flex space-x-2 mt-6">
                  <Button onClick={() => router.push(`/admin/payment/${payment.id}/edit`)}>Edit</Button>
                  <Button variant="destructive">Delete</Button>
                  <Button variant="outline" onClick={() => router.push("/admin/payment")}>Back</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 