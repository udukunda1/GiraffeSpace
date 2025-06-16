"use client"
import { useAuth } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Building, Calendar, Clock, DollarSign } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"

export default function DashboardPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  return (
    <>
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 bg-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Link
              href="/manage/venues/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <span className="text-lg">+</span>
              Add New Venue
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-600 text-sm">Total Venues</h2>
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold mb-1">5</p>
              <Link href="/manage/venues" className="text-xs text-gray-500 hover:underline">
                View all venues
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-600 text-sm">Total Bookings</h2>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold mb-1">12</p>
              <Link href="/manage/bookings" className="text-xs text-gray-500 hover:underline">
                View all bookings
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-600 text-sm">Pending Approvals</h2>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold mb-1">3</p>
              <Link href="/manage/bookings?status=pending" className="text-xs text-gray-500 hover:underline">
                View pending
              </Link>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-gray-600 text-sm">Total Revenue</h2>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold mb-1">$4500</p>
              <p className="text-xs text-gray-500">+12% from last month</p>
            </div>
          </div>

          {/* Recent Booking Requests */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">Recent Approval Requests</h2>
            <p className="text-gray-600 mb-6">You have 3 pending Approval requests that need admin approval.</p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Event</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Venue</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 text-sm">Corporate Meeting</td>
                    <td className="px-4 py-4 text-sm">Grand Conference Hall</td>
                    <td className="px-4 py-4 text-sm">5/15/2025 • 09:00-11:00</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm">Birthday Party</td>
                    <td className="px-4 py-4 text-sm">Riverside Meeting Room</td>
                    <td className="px-4 py-4 text-sm">5/16/2025 • 14:00-18:00</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 text-sm">Product Launch</td>
                    <td className="px-4 py-4 text-sm">Downtown Studio</td>
                    <td className="px-4 py-4 text-sm">5/20/2025 • 10:00-13:00</td>
                    <td className="px-4 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
              <Link
                href="/manage/bookings"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md px-4 py-2"
              >
                View All Bookings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}
