"use client"

import { ReactNode } from "react"
import { AdminHeader } from "./Header"
import SideBar from "./sideBar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <AdminHeader />
      </div>
      <div className="flex flex-1">
        {/* Fixed Sidebar */}
        <SideBar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 