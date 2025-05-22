"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Building, Calendar } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <div className="w-56 border-r bg-white h-screen">
      <div className="p-4 border-b">
        <h1 className="text-lg font-medium">Dashboard</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/manage/venues/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/manage/venues/dashboard")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link
              href="/manage/venues/myvenues"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/manage/venues/myvenues")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Building className="h-5 w-5" />
              <span>My Venues</span>
            </Link>
          </li>
          <li>
            <Link
              href="/manage/venues/bookings"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/manage/venues/bookings")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Booking Requests</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
