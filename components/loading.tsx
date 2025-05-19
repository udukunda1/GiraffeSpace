import { Loader2 } from "lucide-react"

interface LoadingProps {
  message?: string
  size?: "small" | "medium" | "large"
  fullPage?: boolean
}

export function Loading({ message = "Loading...", size = "medium", fullPage = false }: LoadingProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  const containerClasses = fullPage
    ? "min-h-screen flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-12"

  return (
    <div className={containerClasses}>
      <Loader2 className={`${sizeClasses[size]} text-gray-600 animate-spin mb-4`} />
      {message && <p className="text-gray-600 text-center">{message}</p>}
    </div>
  )
}
