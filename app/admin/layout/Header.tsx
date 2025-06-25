"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"

export function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const showLoggedIn = mounted && isLoggedIn
  const userDisplayName = user ? `${user.username}` : "User"
  const userInitials = user ? `${user.username[0]}` : "U"

  return (
    <header className="border-b  sticky top-0 z-50">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8">
            <img src="/logo.png" alt="GiraffeSpace" className="w-full h-full object-cover" />
          </div>
          <Link href="/admin/overview" className="font-bold text-xl">
            GiraffeSpace
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop auth buttons or user menu */}
        {!mounted ? (
          <div className="hidden md:block w-[150px]"></div>
        ) : showLoggedIn ? (
          <div className="hidden md:flex items-center">
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
          <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50 md:hidden">
            <div className="w-full px-4 py-3">
              {mounted && showLoggedIn ? (
                <div className="pt-2">
                  <div className="flex items-center space-x-2 mb-4">
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
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{userDisplayName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center text-sm text-red-600 mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : mounted ? (
                <div className="pt-2 flex flex-col space-y-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}