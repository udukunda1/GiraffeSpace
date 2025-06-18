"use client"

import { type ReactNode, createContext, useContext, useState, useEffect } from "react"
import { getUserByEmail, getUserByUsername, type User, users, UserApiResponse } from "@/data/users"
import ApiService from "@/api/apiConfig"

type AuthContextType = {
  isLoggedIn: boolean
  user: User | null
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (updatedData: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

// Create the context with undefined initially
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn")
    const storedUser = localStorage.getItem("currentUser")

    if (storedLoginState === "true" && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setIsLoggedIn(true)
        setUser(parsedUser)
      } catch (error) {
        // If parsing fails, clear the stored data
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("currentUser")
      }
    }
    setMounted(true)
  }, [])

const login = async (
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  const formData = { identifier, password };

  try {
    const response: UserApiResponse = await ApiService.loginUser(formData);
    if (response.success && response.user && response.token) {
      setIsLoggedIn(true);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      return { success: true };
    } else {
      return { success: false, error: response?.message || "Login failed." };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Login failed. Try again.",
    };
  }
};

const updateUser = async (
  updatedData: Partial<User>
): Promise<{ success: boolean; error?: string }> => {
  if (!user) {
    return { success: false, error: "No user logged in." };
  }
  try {
    const response: UserApiResponse = await ApiService.updateUserById(user.userId, updatedData);
    const updatedUser = response.success && response.user;
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return { success: true };
    } else {
      return { success: false, error: response?.message || "Update failed." };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message || "Update failed. Try again.",
    };
  }
};

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("currentUser")
  }

  // Provide the context value
  const contextValue: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    updateUser,
  }

  // Only render children after mounting on the client
  if (!mounted) {
    return <div>Loading...</div>
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}