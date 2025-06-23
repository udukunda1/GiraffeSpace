"use client"

import { useState } from "react"
import { Calendar, MapPin, Users as UsersIcon, Home, Building2, Briefcase, Ticket, CreditCard, FileText, UserCog, ClipboardList, Layers, DollarSign, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home, href: "/admin/overview" },
  // Event Management Dropdown
  { id: "eventManagement", label: "Event Management", icon: Calendar, children: [
    { id: "events", label: "Events", icon: Calendar, href: "/admin/events" },
    { id: "registration", label: "Registration", icon: ClipboardList, href: "/admin/registration" },
    { id: "ticket", label: "Ticket", icon: Ticket, href: "/admin/ticket" },
  ]},
  // Venue Management Dropdown
  { id: "venueManagement", label: "Venue Management", icon: MapPin, children: [
    { id: "venues", label: "Venues", icon: MapPin, href: "/admin/venues" },
    { id: "venueBooking", label: "Venue Booking", icon: Building2, href: "/admin/venuebooking" },
    { id: "resource", label: "Resource", icon: Layers, href: "/admin/resource" },
  ]},
  // Finance Dropdown
  { id: "finance", label: "Finance", icon: DollarSign, children: [
    { id: "payment", label: "Payment", icon: DollarSign, href: "/admin/payment" },
    { id: "invoice", label: "Invoice", icon: FileText, href: "/admin/invoice" },
  ]},
  { id: "organization", label: "Organization", icon: Briefcase, href: "/admin/organization" },
  // { id: "role", label: "Role", icon: UserCog, href: "/admin/role" },
  { id: "users", label: "Users", icon: UsersIcon, href: "/admin/users" },
]

export default function SideBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Find active tab or subtab
  let activeTab = "overview"
  sidebarItems.forEach(item => {
    if (item.children) {
      item.children.forEach(sub => {
        if (pathname?.startsWith(sub.href)) activeTab = sub.id
      })
    } else {
      if (pathname?.startsWith(item.href)) activeTab = item.id
    }
  })

  return (
    <div className="w-64 h-screen fixed top-0 left-0 z-40 bg-white border-r border-gray-200 flex-shrink-0 pt-[64px]">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <Home className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            if (item.children) {
              // Dropdown
              const isOpen = openDropdown === item.id
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.children.some(sub => activeTab === sub.id)
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {isOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon
                        return (
                          <button
                            key={sub.id}
                            onClick={() => router.push(sub.href)}
                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              activeTab === sub.id
                                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            <SubIcon className="h-4 w-4 mr-3" />
                            {sub.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            // Normal item
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
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
  )
} 