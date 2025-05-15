import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`container mx-auto px-16 max-w-7xl ${className}`}>{children}</div>
}
