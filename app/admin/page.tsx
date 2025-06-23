"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserX,
  Home,
} from "lucide-react"
import { events } from "@/data/events"
import { venues } from "@/data/venues"
import { users } from "@/data/users"
import AdminOverview from "./overview/page"
import AdminEvents from "./events/page"
import AdminVenues from "./venues/page"
import AdminUsers from "./users/page"

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

  // Mock data for pending approvals
  const pendingEvents = events.filter((event) => event.status === "Draft").slice(0, 3)
  const pendingVenues = venues.filter((venue) => !venue.isAvailable).slice(0, 3)

  // Statistics
  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    totalVenues: venues.length,
    pendingApprovals: pendingEvents.length + pendingVenues.length,
    activeEvents: events.filter((event) => event.status === "Active").length,
    completedEvents: events.filter((event) => event.status === "Completed").length,
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "venues", label: "Venues", icon: MapPin },
    { id: "users", label: "Users", icon: Users },
  ]

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
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="admin" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center mb-8">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
         

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
        </div>
      </div>

      <Footer />
    </div>
  )
}
