import React, { useState } from 'react'
import {
  Calendar,
  Users,
  Ticket,
  Star,
  Eye,
  CheckCircle,
  Building2,
  Home,
  ChevronLeft,
  ChevronRight,

} from "lucide-react"


const UserSideBar = () => {

     const [activeTab, setActiveTab] = useState("overview")
    
      // Pagination states
      const [overviewPage, setOverviewPage] = useState(1)
      const [ticketsPage, setTicketsPage] = useState(1)
      const [attendedPage, setAttendedPage] = useState(1)
      const [organizationsPage, setOrganizationsPage] = useState(1)
  return (
    <div>

        <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex-shrink-0 z-20">
            <div className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "tickets"
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Ticket className="h-4 w-4 mr-3" />
                  My Tickets
                </button>
                <button
                  onClick={() => setActiveTab("attended")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "attended"
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-3" />
                  Attended Events
                </button>
                  <button
                  onClick={() => setActiveTab("events")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "tickets"
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  My Events
                </button>
                <button
                  onClick={() => setActiveTab("organizations")}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === "organizations"
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Building2 className="h-4 w-4 mr-3" />
                  My Organizations
                </button>
              </nav>
            </div>
          </div>
    </div>
  )
}

export default  UserSideBar 