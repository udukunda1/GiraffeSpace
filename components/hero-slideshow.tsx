"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SlideshowProps {
  images: {
    src: string
    alt: string
  }[]
  interval?: number
}

export function HeroSlideshow({ images, interval = 3000 }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsTransitioning(false)
      }, 500) // Transition duration
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ease-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          } ${isTransitioning && index === currentIndex ? "opacity-70" : ""}`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/30 z-20"></div>
    </div>
  )
}
