import { CalendarDays, Users, MapPin, BarChart3, CheckCircle, Lock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { StatCard } from "@/components/stat-card"
import { FeatureCard } from "@/components/feature-card"
import { Button } from "@/components/button"
import { Container } from "@/components/container"
import { Section } from "@/components/section"
import { HeroSlideshow } from "@/components/hero-slideshow"

export default function Home() {
  const heroImages = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/College%20Events%20%282%29-JPLWugAqmW1tfuxPOCyjRsA8svsqEi.png",
      alt: "Speaker at a conference podium addressing an audience at a formal event",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/College%20Events%20%283%29-eGHN8itDszs54mjzAZht9i9JV2vxvR.png",
      alt: "Conference presentation with large screens and audience in theater seating",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="home" />

      <main className="flex-1">
        {/* Hero Section */}
        <Section background="blue">
          <Container>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                  Events Management System
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  A centralized platform for planning, organizing, and managing all types of events for your
                  organization.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button href="/events" variant="primary">
                    Browse Events
                  </Button>
                  <Button href="/events/create" variant="outline">
                    Create Event
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <HeroSlideshow images={heroImages} interval={5000} />
              </div>
            </div>
          </Container>
        </Section>

        {/* Features Section */}
        <Section>
          <Container>
            <div className="text-center mb-12">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Features
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to manage events</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Our platform provides a comprehensive solution for event management, from proposal to execution.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={CalendarDays}
                title="Event Planning"
                description="Create and manage events with detailed scheduling, budgeting, and resource allocation."
              />

              <FeatureCard
                icon={Users}
                title="Registration"
                description="Handle attendee registrations, QR code check-ins, and attendance tracking."
              />

              <FeatureCard
                icon={MapPin}
                title="Venue Management"
                description="Book and manage venues, reserve facilities, and allocate resources."
              />

              <FeatureCard
                icon={BarChart3}
                title="Reporting"
                description="Generate detailed reports on attendance, finances, and resource usage."
              />

              <FeatureCard
                icon={CheckCircle}
                title="Approval Workflow"
                description="Streamlined approval process for event proposals with multi-level authorization."
              />

              <FeatureCard
                icon={Lock}
                title="Role-Based Access"
                description="Different access levels for administrators, organizers, faculty, and students."
              />
            </div>
          </Container>
        </Section>

        {/* Upcoming Events Section */}
        <Section background="gray">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-center text-gray-600 mb-12">
              Discover and register for upcoming events at the University of Rwanda.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <EventCard
                id="tech-conference"
                title="Annual Tech Conference 2025"
                type="Conference"
                typeColor="blue"
                date="April 15, 2025 • 9:00 AM - 5:00 PM"
                location="Main Auditorium"
                registeredCount={145}
                imageSrc="/techconference.png"
              />

              <EventCard
                id="cultural-festival"
                title="Cultural Festival"
                type="Festival"
                typeColor="purple"
                date="April 20, 2025 • 10:00 AM - 8:00 PM"
                location="University Grounds"
                registeredCount={320}
                imageSrc="/cultural.png"
              />

              <EventCard
                id="research-symposium"
                title="Research Symposium"
                type="Academic"
                typeColor="green"
                date="April 25, 2025 • 1:00 PM - 6:00 PM"
                location="Science Building"
                registeredCount={78}
                imageSrc="/research.png"
              />
            </div>

            <div className="text-center mt-12">
              <Button href="/events" variant="outline">
                View All Events
              </Button>
            </div>
          </Container>
        </Section>

        {/* System Overview Section */}
        <Section>
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">System Overview</h2>
            <p className="text-center text-gray-600 mb-12">
              Key statistics and metrics from our events management platform.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value={245} label="Total Events" />
              <StatCard value="1,892" label="Active Users" />
              <StatCard value={28} label="Venues" />
              <StatCard value={42} label="Upcoming Events" />
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
