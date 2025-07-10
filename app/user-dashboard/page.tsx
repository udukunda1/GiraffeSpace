"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { UserHeader } from "@/components/UserHeader"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Ticket,
  CheckCircle,
  Building2,
  Home,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import ApiService from "@/api/apiConfig"
import type { User } from "@/data/users"
import OverviewSection from "./overview/page"
import TicketsSection from "./tickets/page"
import AttendedEventsSection from "./attended-event/page"
import OrganizationsSection from "./organization/page"
import EventSection from "./events/page"

export default function UserDashboard() {
  const { user: authUser, isLoggedIn } = useAuth()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [overviewPage, setOverviewPage] = useState(1)
  const itemsPerPage = 5
  const [user, setUser] = useState<User | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [orgsLoading, setOrgsLoading] = useState(true)
  const [orgsError, setOrgsError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    if (authUser?.userId) {
      setUserLoading(true)
      setOrgsLoading(true)
      ApiService.getUserById(authUser.userId)
        .then((res: { success: boolean; user?: User; message?: string }) => {
          if (res.success && res.user) {
            setUser(res.user)
            setOrganizations(res.user.organizations || [])
          } else {
            setUserError(res.message || "Failed to fetch user.")
            setOrgsError(res.message || "Failed to fetch organizations.")
          }
        })
        .catch((err: any) => {
          setUserError(err?.message || "Failed to fetch user.")
          setOrgsError(err?.message || "Failed to fetch organizations.")
        })
        .finally(() => {
          setUserLoading(false)
          setOrgsLoading(false)
        })
    }
  }, [isLoggedIn, authUser, router])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [isLoggedIn, router])

  if (!isLoggedIn || !authUser) {
    return <div>Loading...</div>
  }

  // Helper functions for pagination and formatting
  const getUserEvents = (userId: string) => [] // Replace with real logic or import
  const getUserStats = () => ({}) // Replace with real logic or import
  const getPaginatedData = (data: any[], page: number) => data // Replace with real logic or import
  const getTotalPages = (dataLength: number) => 1 // Replace with real logic or import
  const formatDate = (dateString: string) => dateString // Replace with real logic or import

  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader user={user} />
      <main className="flex-1 pt-16 bg-gray-50">
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex-shrink-0 z-20">
            <div className="p-6">
              <nav className="space-y-2">
                <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "overview" ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}><Home className="h-4 w-4 mr-3" />Overview</button>
                <button onClick={() => setActiveTab("tickets")} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "tickets" ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}><Ticket className="h-4 w-4 mr-3" />My Tickets</button>
                <button onClick={() => setActiveTab("attended")} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "attended" ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}><CheckCircle className="h-4 w-4 mr-3" />Attended Events</button>
                <button onClick={() => setActiveTab("organizations")} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "organizations" ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}><Building2 className="h-4 w-4 mr-3" />My Organizations</button>
                <button onClick={() => setActiveTab("events")} className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "events" ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}><Calendar className="h-4 w-4 mr-3" />My Events</button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 p-8 ml-64">
            {userLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-blue-600 font-semibold text-lg">Loading user data...</div>
              </div>
            ) : userError ? (
              <div className="text-red-500">{userError}</div>
            ) : !user ? (
              <div>No user data found.</div>
            ) : (
              (() => {
                const userEvents = getUserEvents(user.userId)
                const userStats = getUserStats()
                return (
                  <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                    {activeTab === "overview" && (
                      <OverviewSection
                        user={user}
                        userStats={userStats}
                        organizations={organizations}
                        userEvents={userEvents}
                        overviewPage={overviewPage}
                        setOverviewPage={setOverviewPage}
                        getTotalPages={getTotalPages}
                        getPaginatedData={getPaginatedData}
                        formatDate={formatDate}
                      />
                    )}
                    {activeTab === "tickets" && (
                      <TicketsSection
                        userEvents={userEvents}
                        itemsPerPage={itemsPerPage}
                      />
                    )}
                    {activeTab === "attended" && (
                      <AttendedEventsSection
                        userEvents={userEvents}
                        itemsPerPage={itemsPerPage}
                      />
                    )}
                    {activeTab === "organizations" && (
                      <OrganizationsSection
                        organizations={organizations}
                        orgsLoading={orgsLoading}
                        orgsError={orgsError}
                        onAddOrganization={async (orgForm, setAddOrgOpen, setOrgForm, setAddOrgError) => {
                          try {
                            const response = await ApiService.addOrganization(orgForm)
                            if (response.success) {
                              setAddOrgOpen(false)
                              setOrganizations((prev) => [...prev, response.organizations?.[0] || orgForm])
                              setOrgForm({
                                organizationName: "",
                                description: "",
                                contactEmail: "",
                                contactPhone: "",
                                address: "",
                                organizationType: "",
                              })
                            } else {
                              setAddOrgError(response.message || "Failed to add organization.")
                            }
                          } catch (err) {
                            setAddOrgError("Failed to add organization. Please try again.")
                          }
                        }}
                      />
                    )}
                    {activeTab === "events" && (
                      <EventSection />
                    )}
                  </div>
                )
              })()
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
