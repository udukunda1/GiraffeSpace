"use client"

import { type ReactNode, createContext, useContext, useState } from "react"
import ApiService from "@/api/apiConfig"

// Type for the context
export type DefaultPasswordAuthContextType = {
  token: string | null
  loginWithDefaultPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const DefaultPasswordAuthContext = createContext<DefaultPasswordAuthContextType | undefined>(undefined)

export function DefaultPasswordAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  // Login with default password (calls a different API endpoint)
  const loginWithDefaultPassword = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await ApiService.loginUserDefaultPassword({ identifier, password })
      if (response.success) {
        // Don't store token or set it in state - just return success
        return { success: true }
      } else {
        return { success: false, error: "Login failed." }
      }
    } catch (error: any) {
      return { success: false, error: error?.message || "Login failed. Try again." }
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem("defaultPasswordToken")
  }

  return (
    <DefaultPasswordAuthContext.Provider value={{ token, loginWithDefaultPassword, logout }}>
      {children}
    </DefaultPasswordAuthContext.Provider>
  )
}

export function useDefaultPasswordAuth() {
  const context = useContext(DefaultPasswordAuthContext)
  if (context === undefined) {
    throw new Error("useDefaultPasswordAuth must be used within a DefaultPasswordAuthProvider")
  }
  return context
}
