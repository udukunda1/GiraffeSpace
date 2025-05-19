import { Loading } from "@/components/loading"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Loading message="Loading content..." size="large" />
      </main>
      <Footer />
    </div>
  )
}
