"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"

export default function CreateEventLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
            <div className="h-4 w-96 bg-gray-200 animate-pulse rounded mb-8"></div>
            <Loading message="Loading form..." size="medium" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
