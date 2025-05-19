import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Loading } from "@/components/loading"

export default function OrganizersLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="organizations" />
      <main className="flex-1">
        <Loading message="Loading organizers..." size="large" />
      </main>
      <Footer />
    </div>
  )
}
