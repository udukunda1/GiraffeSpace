"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell, Moon, Globe, Lock, CreditCard, UserX } from "lucide-react"

export default function SettingsPage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    darkMode: false,
    language: "English",
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  const handleToggle = (setting: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="settings" />

      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-16 max-w-7xl">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences.</p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="container mx-auto px-4 md:px-16 max-w-7xl py-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="w-full md:w-64 border-b md:border-b-0 md:border-r">
                <nav className="p-4">
                  <ul className="space-y-1">
                    <li>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeTab === "account"
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("account")}
                      >
                        <Lock className="h-4 w-4 mr-3" />
                        Account
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeTab === "notifications"
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("notifications")}
                      >
                        <Bell className="h-4 w-4 mr-3" />
                        Notifications
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeTab === "appearance"
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("appearance")}
                      >
                        <Moon className="h-4 w-4 mr-3" />
                        Appearance
                      </button>
                    </li>
                    <li>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                          activeTab === "billing"
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab("billing")}
                      >
                        <CreditCard className="h-4 w-4 mr-3" />
                        Billing
                      </button>
                    </li>
                  </ul>
                  <div className="mt-8 pt-4 border-t">
                    <button className="w-full text-left px-4 py-2 rounded-md flex items-center text-red-600 hover:bg-red-50">
                      <UserX className="h-4 w-4 mr-3" />
                      Delete Account
                    </button>
                  </div>
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {activeTab === "account" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Change Password</h3>
                        <form className="space-y-4">
                          <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="current-password"
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="new-password"
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>

                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Language</h3>
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-3 text-gray-400" />
                          <select
                            value={settings.language}
                            onChange={handleLanguageChange}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Kinyarwanda">Kinyarwanda</option>
                            <option value="Swahili">Swahili</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email notifications about your events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.emailNotifications}
                            onChange={() => handleToggle("emailNotifications")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.pushNotifications}
                            onChange={() => handleToggle("pushNotifications")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <h3 className="font-medium">Marketing Emails</h3>
                          <p className="text-sm text-gray-500">Receive emails about new features and events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.marketingEmails}
                            onChange={() => handleToggle("marketingEmails")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Dark Mode</h3>
                          <p className="text-sm text-gray-500">Switch between light and dark mode</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.darkMode}
                            onChange={() => handleToggle("darkMode")}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "billing" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Billing Information</h2>
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                      <p className="text-gray-600 mb-4">You haven't added any payment methods yet.</p>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
