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
    <div className="w-44 border-r bg-white h-screen left-0 fixed">
    
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/manage/venues/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/manage/venues/dashboard")
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                                       ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
