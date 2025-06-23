"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "./button"

export function UserHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isLoggedIn, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isUserMenuOpen && !target.closest("[data-user-menu]")) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : "User"
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}` : "U"

  return (
    <header className="border-b bg-white">
      <div className="w-full">
        <div className="px-6 py-3 max-w-[1440px] w-full mx-auto flex items-center justify-between">
          {/* Left: Logo and App Name */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <img src="/logo.png" alt="GiraffeSpace" className="w-full h-full object-cover" />
            </div>
            <Link href="/" className="font-bold text-xl">
              GiraffeSpace
            </Link>
          </div>

          {/* Right: User or Auth */}
          {mounted && isLoggedIn ? (
            <div className="flex items-center">
              <div className="relative" data-user-menu>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-medium">
                    {user?.profilePictureURL ? (
                      <img
                        src={user.profilePictureURL || "/placeholder.svg"}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Log In
              </Link>
              <Button href="/register">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
