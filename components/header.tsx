"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  activePage?: string
}

export function Header({ activePage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="container mx-auto px-16 py-4 max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <Link href="/" className="font-bold text-xl">
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

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              activePage === "home" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`text-sm font-medium ${
              activePage === "events" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Events
          </Link>
          <Link
            href="/venues"
            className={`text-sm font-medium ${
              activePage === "venues" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Venues
          </Link>
          <Link
            href="/organizations"
            className={`text-sm font-medium ${
              activePage === "organizations" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Organizations
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${
              activePage === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/login"
            className={`text-sm font-medium ${
              activePage === "login" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Log In
          </Link>
          <Link
            href="/register"
            className={`text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 ${
              activePage === "register" ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
          >
            Register
          </Link>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50 md:hidden">
            <div className="container mx-auto px-16 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`text-sm font-medium ${
                    activePage === "home" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/events"
                  className={`text-sm font-medium ${
                    activePage === "events" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  href="/venues"
                  className={`text-sm font-medium ${
                    activePage === "venues" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Venues
                </Link>
                <Link
                  href="/organizations"
                  className={`text-sm font-medium ${
                    activePage === "organizations" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Organizations
                </Link>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${
                    activePage === "dashboard" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="pt-4 border-t flex flex-col space-y-4">
                  <Link
                    href="/login"
                    className={`text-sm font-medium ${
                      activePage === "login" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className={`text-sm font-medium text-white bg-gray-900 px-4 py-2 rounded-md hover:bg-gray-800 text-center ${
                      activePage === "register" ? "bg-blue-600 hover:bg-blue-700" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
