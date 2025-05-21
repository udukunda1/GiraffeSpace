"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"

export default function SettingsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="settings" />
      <main className="flex-1">
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="h-6 w-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <Loading message="Loading settings..." size="large" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
