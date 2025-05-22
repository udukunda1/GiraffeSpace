"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"

export default function CreateEventPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
            <p className="text-gray-600 mb-8">This is a placeholder for the event creation form.</p>

            <div className="flex justify-end">
              <button
                onClick={() => router.back()}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mr-2"
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Create Event</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
