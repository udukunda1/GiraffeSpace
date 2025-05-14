import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Container } from "@/components/container"
import { Section } from "@/components/section"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/button"
import { Search, Filter } from "lucide-react"

export default function EventsPage() {
  // This would normally come from a database
  const events = [
    {
      id: "tech-conference",
      title: "Annual Tech Conference 2025",
      type: "Conference",
      typeColor: "blue",
      date: "April 15, 2025 • 9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      registeredCount: 145,
      gradient: true,
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-500",
      specialText: "TECHNOLOGY CONFERENCE",
    },
    {
      id: "cultural-festival",
      title: "Cultural Festival",
      type: "Festival",
      typeColor: "purple",
      date: "April 20, 2025 • 10:00 AM - 8:00 PM",
      location: "University Grounds",
      registeredCount: 320,
      imageSrc: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "research-symposium",
      title: "Research Symposium",
      type: "Academic",
      typeColor: "green",
      date: "April 25, 2025 • 1:00 PM - 6:00 PM",
      location: "Science Building",
      registeredCount: 78,
      imageSrc: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "career-fair",
      title: "Spring Career Fair",
      type: "Career",
      typeColor: "yellow",
      date: "May 5, 2025 • 10:00 AM - 4:00 PM",
      location: "Student Center",
      registeredCount: 210,
      imageSrc: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "alumni-reunion",
      title: "Alumni Reunion 2025",
      type: "Social",
      typeColor: "red",
      date: "May 15, 2025 • 6:00 PM - 10:00 PM",
      location: "Grand Ballroom",
      registeredCount: 185,
      imageSrc: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "workshop-ai",
      title: "AI Workshop Series",
      type: "Workshop",
      typeColor: "blue",
      date: "May 20-22, 2025 • 1:00 PM - 5:00 PM",
      location: "Computer Science Building",
      registeredCount: 65,
      imageSrc: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Section background="blue">
          <Container>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover and register for upcoming events at the University of Rwanda.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>

                <Button href="/events/create" variant="primary">
                  Create Event
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  All Events
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  Today
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  This Week
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  This Month
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  Conference
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  Workshop
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200">
                  Social
                </button>
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  type={event.type}
                  typeColor={event.typeColor}
                  date={event.date}
                  location={event.location}
                  registeredCount={event.registeredCount}
                  imageSrc={event.imageSrc}
                  gradient={event.gradient}
                  gradientFrom={event.gradientFrom}
                  gradientTo={event.gradientTo}
                  specialText={event.specialText}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex">
                <button className="px-4 py-2 border rounded-l-md bg-blue-600 text-white">1</button>
                <button className="px-4 py-2 border-t border-b border-r text-gray-600 hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border-t border-b border-r text-gray-600 hover:bg-gray-50">3</button>
                <button className="px-4 py-2 border-t border-b border-r rounded-r-md text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
