"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { events } from "@/data/events"
import { venues } from "@/data/venues"
import { users } from "@/data/users"
import AdminOverview from "./overview/page"
import AdminEvents from "./events/page"
import AdminVenues from "./venues/page"
import AdminUsers from "./users/page"
import AdminRegistration from "./registration/page"
import AdminTicket from "./ticket/page"
import AdminLayout from "./layout/Layout"
import { Footer } from "@/components/footer"

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!isLoggedIn || user?.role.roleName !== "ADMIN") {
      router.push("/")
      return
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, user, router])

  // Don't render if not admin
  if (!isLoggedIn || user?.role.roleName !== "ADMIN") {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />
      case "events":
        return <AdminEvents />
      case "venues":
        return <AdminVenues />
      case "users":
        return <AdminUsers />
      case "registration":
        return <AdminRegistration />
      case "ticket":
        return <AdminTicket />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminLayout>
          {/* Dashboard Content */}
          <div className="flex-1 p-8">
            <div
              className={`transform transition-all duration-1000 ease-out delay-400 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
            {renderContent()}
          </div>
        </div>
      </AdminLayout>

    </div>
  )
}