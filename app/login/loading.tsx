"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="login" />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Loading message="Loading login page..." size="large" />
      </main>
      <Footer />
    </div>
  )
}
