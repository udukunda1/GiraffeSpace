"use client"

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
import { events } from "@/data/events"
import { getAvailableVenues } from "@/data/venues"
import { useEffect, useState } from "react"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

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

  // Get first 3 events for upcoming events section
  const upcomingEvents = events.slice(0, 3)

  // Get first 3 available venues for sample section
  const availableVenues = getAvailableVenues().slice(0, 3)

  const formatEventDate = (eventDate: string, startTime: string, endTime: string) => {
    const date = new Date(eventDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    const start = new Date(`2000-01-01T${startTime}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    const end = new Date(`2000-01-01T${endTime}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return `${date} • ${start} - ${end}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activePage="home" />

      <main className="flex-1">
        {/* Hero Section */}
        <Section background="blue">
          <Container>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1
                  className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 transform transition-all duration-1000 ease-out ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                 Next-Gen Event And Venue Management System
                </h1>
                <p
                  className={`text-lg text-gray-600 transform transition-all duration-1000 ease-out delay-200 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
           Empowering your organization to create, manage, and elevate every event and venue experience.

                </p>
                <div
                  className={`flex flex-wrap gap-4 transform transition-all duration-1000 ease-out delay-400 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  <Button href="/venues" variant="primary">
                    Booking Venue
                  </Button>
                  <Button href="/events" variant="outline">
                    Get Event
                  </Button>
                </div>
              </div>
              <div
                className={`relative h-64 md:h-80 rounded-lg overflow-hidden transform transition-all duration-1000 ease-out delay-300 ${
                  isLoaded ? "translate-x-0 opacity-100 scale-100" : "translate-x-8 opacity-0 scale-95"
                }`}
              >
                <HeroSlideshow images={heroImages} interval={5000} />
              </div>
            </div>
          </Container>
        </Section>

        {/* Sample Available Venues Section */}
        <Section background="gray">
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Available Venues</h2>
            <p className="text-center text-gray-600 mb-12">
              Explore some of our top available venues for your next event.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableVenues.map((venue) => (
                <div key={venue.venueId} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                  {venue.imageSrc && (
                    <img src={venue.imageSrc} alt={venue.venueName} className="w-full h-40 object-cover rounded mb-2" />
                  )}
                  <h3 className="text-lg font-semibold">{venue.venueName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{venue.location}</p>
                  <p className="text-gray-500 text-xs mb-2">{venue.description?.slice(0, 80)}...</p>
                  <a
                    href={`/venues/${venue.venueId}`}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button href="/venues" variant="outline">
                View All Venue
              </Button>
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
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.eventId}
                  id={event.eventId}
                  title={event.eventTitle}
                  type={event.eventType}
                  typeColor={event.typeColor}
                  date={formatEventDate(event.eventDate, event.eventStartTime, event.eventEndTime)}
                  location={event.venue}
                  registeredCount={event.registeredCount}
                  imageSrc={event.imageURL}
                  imageAlt={event.eventTitle}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button href="/events" variant="outline">
                View All Events
              </Button>
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
                {/* System Overview Section */}
                <Section>
          <Container>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">System Overview</h2>
            <p className="text-center text-gray-600 mb-12">
              Key statistics and metrics from our events management platform.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value={events.length} label="Total Events" />
              <StatCard value="1,892" label="Active Users" />
              <StatCard value={28} label="Venues" />
              <StatCard value={events.filter((event) => event.status === "Active").length} label="Upcoming Events" />
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
