"use client"

import { type ReactNode, createContext, useContext, useState, useEffect } from "react"

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

// Create a default context value to avoid the "must be used within a Provider" error
const defaultContextValue: AuthContextType = {
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn")
    if (storedLoginState === "true") {
      setIsLoggedIn(true)
    }
    setMounted(true)
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem("isLoggedIn", "true")
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.setItem("isLoggedIn", "false")
  }

  // Provide the context value
  const contextValue: AuthContextType = {
    isLoggedIn,
    login,
    logout,
  }

  // Only render children after mounting on the client
  if (!mounted) {
    return null
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
