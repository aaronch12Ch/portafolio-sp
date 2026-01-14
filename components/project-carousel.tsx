'use client'
import { ProjectCard } from "@/components/project-card"
import type { Proyecto } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface ProjectCarouselProps {
  proyectos: Proyecto[]
}

export function ProjectCarousel({ proyectos }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setDirection('next')
        
        setCurrentIndex((prev) => {
          const itemsPerPage = window.innerWidth < 1024 ? 1 : 3
          const maxIndex = proyectos.length - itemsPerPage
          if (prev >= maxIndex) return 0
          return prev + itemsPerPage
        })

        setTimeout(() => setIsAnimating(false), 600)
      }
    }, 5000) // Cambia cada 2 segundos

    return () => clearInterval(interval)
  }, [isAnimating, proyectos.length])

  // Si hay 3 o menos proyectos, mostramos el grid normal
  if (proyectos.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto, i) => (
          <ProjectCard key={proyecto.idProyecto || i} proyecto={proyecto} />
        ))}
      </div>
    )
  }

  const itemsPerPage = isMobile ? 1 : 3
  const maxIndex = proyectos.length - itemsPerPage

  // Funciones de navegación
  const nextSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection('next')
    
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0
      return prev + itemsPerPage
    })

    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating, maxIndex, itemsPerPage])

  const prevSlide = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection('prev')
    
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex
      return Math.max(0, prev - itemsPerPage)
    })

    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating, maxIndex, itemsPerPage])

  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(index > currentIndex ? 'next' : 'prev')
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const totalDots = isMobile ? proyectos.length : Math.ceil(proyectos.length / 3)

  return (
    <div className="relative group">
      {/* Botones de navegación - aparecen al hacer hover */}
      <div className="absolute -top-16 right-0 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          onClick={prevSlide}
          disabled={isAnimating}
          variant="outline"
          size="icon"
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={nextSlide}
          disabled={isAnimating}
          variant="outline"
          size="icon"
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 backdrop-blur-sm hover:scale-110 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden rounded-lg">
        <div
          className={`flex transition-all duration-700 ease-in-out ${
            isAnimating ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            transform: isMobile 
              ? `translateX(-${currentIndex * 100}%)`
              : `translateX(-${currentIndex * (100 / 3)}%)`,
          }}
        >
          {proyectos.map((proyecto, i) => {
            const isVisible = isMobile 
              ? i === currentIndex
              : i >= currentIndex && i < currentIndex + 3

            return (
              <div
                key={proyecto.idProyecto || i}
                className={`flex-none w-full lg:w-1/3 px-3 transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-50 scale-95'
                }`}
                style={{
                  transitionDelay: isVisible ? `${(i % 3) * 100}ms` : '0ms'
                }}
              >
                <ProjectCard proyecto={proyecto} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Indicadores de puntos con animación */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalDots }).map((_, i) => {
          const dotIndex = isMobile ? i : i * 3
          const isActive = isMobile
            ? currentIndex === i
            : Math.floor(currentIndex / 3) === i

          return (
            <button
              key={i}
              onClick={() => goToSlide(dotIndex)}
              disabled={isAnimating}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                isActive
                  ? "w-8 bg-primary-foreground shadow-lg shadow-primary-foreground/50"
                  : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/60 hover:scale-125"
              } disabled:opacity-50`}
              aria-label={`Ir al proyecto ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Indicador de progreso */}
      <div className="mt-4 h-1 bg-primary-foreground/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-foreground rounded-full transition-all duration-5000 ease-linear"
          style={{
            width: `${((currentIndex / maxIndex) * 100) || 0}%`
          }}
        />
      </div>
    </div>
  )
}