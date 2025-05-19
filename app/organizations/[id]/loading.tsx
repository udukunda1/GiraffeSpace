import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function OrganizerDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="organizations" />

      <main className="flex-1">
        {/* Back Button */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-16 max-w-7xl">
            <Link href="/organizations" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Back to Organizers</span>
            </Link>
          </div>
        </div>

        <Loading message="Loading organizer details..." size="large" />
      </main>

      <Footer />
    </div>
  )
}
