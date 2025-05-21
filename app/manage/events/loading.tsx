"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"
import { Calendar, Users, MapPin, Clock } from "lucide-react"

export default function ManageEventsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="manage" />

      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <Calendar className="h-5 w-5 text-gray-300" />
              </div>
            </div>

            <div className="border rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <Users className="h-5 w-5 text-gray-300" />
              </div>
            </div>

            <div className="border rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <MapPin className="h-5 w-5 text-gray-300" />
              </div>
            </div>

            <div className="border rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                <Clock className="h-5 w-5 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="border-b mb-6">
            <div className="flex -mb-px">
              <div className="h-8 w-24 bg-gray-200 rounded mr-4"></div>
              <div className="h-8 w-24 bg-gray-200 rounded mr-4"></div>
            </div>
          </div>

          <Loading message="Loading events dashboard..." size="large" />
        </div>
      </main>

      <Footer />
    </div>
  )
}
