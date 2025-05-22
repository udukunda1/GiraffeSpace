"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"

export default function ManageVenuesLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-green-50 py-16">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl">
            <div className="h-10 w-64 bg-green-200 animate-pulse rounded mb-4"></div>
            <div className="h-6 w-96 bg-green-200 animate-pulse rounded mb-8"></div>
            <div className="h-10 w-40 bg-green-300 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <Loading message="Loading venues..." size="large" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
