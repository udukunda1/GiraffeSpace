import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Facebook, Twitter, Copy, User } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// This would normally come from a database
const getEventData = (id: string) => {
  const events = {
    "tech-conference": {
      title: "Annual Tech Conference",
      type: "Conference",
      date: "April 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      address: "College of Science and Technology, Kigali Campus",
      registeredCount: 145,
      maxCapacity: 300,
      availableSeats: 155,
      ticketPrice: "Free",
      description:
        "Join us for the annual technology conference featuring keynote speakers, workshops, and networking opportunities. This event brings together industry leaders, researchers, and students to discuss the latest trends and innovations in technology.",
      organizer: "Computer Science Department",
      resources: ["Projector", "Sound System", "Chairs", "Tables", "Wi-Fi"],
      imageSrc: "/placeholder.svg?height=500&width=1000",
      tags: ["Conference", "Upcoming"],
    },
    "cultural-festival": {
      title: "Cultural Festival",
      type: "Festival",
      date: "April 20, 2025",
      time: "10:00 AM - 8:00 PM",
      location: "University Grounds",
      address: "Central Campus, University of Rwanda, Kigali",
      registeredCount: 320,
      maxCapacity: 500,
      availableSeats: 180,
      ticketPrice: "Free",
      description:
        "Experience the rich cultural diversity of Rwanda and beyond at our annual cultural festival. Enjoy traditional performances, art exhibitions, culinary delights, and interactive cultural workshops.",
      organizer: "Cultural Affairs Office",
      resources: ["Stage", "Sound System", "Tents", "Food Stalls", "Restrooms"],
      imageSrc: "/placeholder.svg?height=500&width=1000",
      tags: ["Festival", "Upcoming"],
    },
    "research-symposium": {
      title: "Research Symposium",
      type: "Academic",
      date: "April 25, 2025",
      time: "1:00 PM - 6:00 PM",
      location: "Science Building",
      address: "Science Campus, University of Rwanda, Kigali",
      registeredCount: 78,
      maxCapacity: 150,
      availableSeats: 72,
      ticketPrice: "Free",
      description:
        "A platform for graduate students to present their research findings and receive feedback from faculty and peers. The symposium covers various disciplines and encourages interdisciplinary collaboration.",
      organizer: "Graduate Studies Office",
      resources: ["Projector", "Microphones", "Poster Boards", "Chairs", "Wi-Fi"],
      imageSrc: "/placeholder.svg?height=500&width=1000",
      tags: ["Academic", "Upcoming"],
    },
  }

  return events[id as keyof typeof events]
}

export default function EventPage({ params }: { params: { id: string } }) {
  const event = getEventData(params.id)

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link href="/events" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Events
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/events" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Event Banner */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-teal-400 text-white py-2 px-4 rounded-br-lg font-medium z-10">
                PREMIUM EVENT
              </div>
              <Image
                src={event.imageSrc || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Event Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    tag === "Conference" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Event Title */}
            <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-lg mr-4">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organizer</p>
                  <p className="font-medium">{event.organizer}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex">
                <button className="px-4 py-2 border-b-2 border-blue-600 font-medium text-blue-600">Details</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Schedule</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Speakers</button>
              </div>
            </div>

            {/* About This Event */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>

            {/* Resources */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Resources</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {event.resources.map((resource) => (
                  <li key={resource}>{resource}</li>
                ))}
              </ul>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold mb-4">Location</h2>
              <p className="text-gray-600 mb-4">{event.address}</p>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-400">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                  </div>
                  <p>Map loading...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Registration Card */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">Registration</h2>
              <p className="text-gray-600 mb-4">{event.registeredCount} people have registered for this event</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Available Seats</span>
                  <span>
                    {event.availableSeats} / {event.maxCapacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.availableSeats / event.maxCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <span className="font-medium">Ticket Price</span>
                <span>{event.ticketPrice}</span>
              </div>

              <button className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 mb-2">
                Register Now
              </button>
            </div>

            {/* Organizer Card */}
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium">{event.organizer}</p>
                  <p className="text-sm text-gray-500">Event Organizer</p>
                </div>
              </div>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50">
                View Organizer Profile
              </button>
            </div>

            {/* Share Event Card */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Share Event</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value="https://events.ur.ac.rw/events/1"
                  readOnly
                  className="flex-grow border border-r-0 rounded-l-md px-3 py-2 bg-gray-50 text-sm"
                />
                <button className="bg-gray-900 text-white px-3 py-2 rounded-r-md hover:bg-gray-800">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
