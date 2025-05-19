import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar } from "lucide-react"

interface OrganizationCardProps {
  name: string
  description: string
  logo: string
  memberCount: number
  eventCount: number
  tags: Array<{
    label: string
    type: "corporate" | "non-profit" | "community" | "admin" | "member"
  }>
}

export function OrganizationCard({ name, description, logo, memberCount, eventCount, tags }: OrganizationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-white flex items-center justify-center p-4">
        <img src={logo || "/placeholder.svg"} alt={name} className="max-h-full max-w-full object-contain" />
      </div>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`
                ${tag.type === "corporate" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                ${tag.type === "non-profit" ? "bg-green-50 text-green-700 border-green-200" : ""}
                ${tag.type === "community" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                ${tag.type === "admin" ? "bg-gray-50 text-gray-700 border-gray-200" : ""}
                ${tag.type === "member" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
              `}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{eventCount} events</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
          Manage Organization
        </Button>
      </CardFooter>
    </Card>
  )
}
