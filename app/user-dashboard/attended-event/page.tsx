"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Star } from "lucide-react"

interface UserEvent {
  eventId: string;
  attendanceStatus: string;
  eventTitle: string;
  description: string;
  eventDate: string;
  venue: string;
  eventType: string;
}

interface AttendedEventsSectionProps {
  userEvents: UserEvent[];
  itemsPerPage?: number;
}

export default function AttendedEventsSection({ userEvents, itemsPerPage = 5 }: AttendedEventsSectionProps) {
  const [attendedPage, setAttendedPage] = useState(1)

  const attendedEvents = userEvents.filter((event: { attendanceStatus: string }) => event.attendanceStatus === "attended")
  const getPaginatedData = (data: any[], page: number) => data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const getTotalPages = (dataLength: number) => Math.ceil(dataLength / itemsPerPage)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attended Events</h2>
        <div className="text-sm text-gray-600">
          Total: {attendedEvents.length} events
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Event</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Venue</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData(attendedEvents, attendedPage).map((event: { eventId: Key | null | undefined; eventTitle: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; eventDate: string; venue: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; eventType: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                  <tr key={event.eventId} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <h4 className="font-medium">{event.eventTitle}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{formatDate(event.eventDate)}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{event.venue}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{event.eventType}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" disabled={attendedPage === 1} onClick={() => setAttendedPage(attendedPage - 1)}>Previous</Button>
            <span className="px-2 py-1 text-sm">Page {attendedPage} of {getTotalPages(attendedEvents.length)}</span>
            <Button size="sm" variant="outline" disabled={attendedPage === getTotalPages(attendedEvents.length)} onClick={() => setAttendedPage(attendedPage + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
