"use client"

import Link from "next/link"
import { Mail, CheckCircle, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"

export default function EmailConfirmationPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div
            className={`flex justify-center mb-6 transform transition-all duration-1000 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div
            className={`text-center mb-8 transform transition-all duration-1000 ease-out delay-200 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="text-3xl font-bold mb-4 text-green-800">Check Your Email</h1>
            <p className="text-gray-600 text-lg">
              We've sent a password reset link to your email address
            </p>
          </div>

          <div
            className={`bg-white rounded-lg border shadow-sm p-8 transform transition-all duration-1000 ease-out delay-400 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Password Reset Link Sent</h2>
              <p className="text-gray-600 text-sm">
                Please check your email inbox and click on the password reset link to set a new password for your account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">What to do next:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click on the password reset link in the email</li>
                  <li>• Set a new secure password for your account</li>
                  <li>• Return here to log in with your new password</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Important:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• The reset link will expire in 24 hours</li>
                  <li>• If you don't receive the email, check your spam folder</li>
                  <li>• Make sure you entered the correct email address</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/login"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
              
              <Link
                href="/logindefaultpassword"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
              >
                Try Default Password Login Again
              </Link>
            </div>
          </div>

          <div
            className={`text-center mt-6 transform transition-all duration-1000 ease-out delay-600 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-gray-600 text-sm">
              Didn't receive the email?{" "}
              <Link href="/logindefaultpassword" className="text-blue-600 hover:text-blue-700 font-medium">
                Try again
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 