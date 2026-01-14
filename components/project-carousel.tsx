'use client'
import { ProjectCard } from "@/components/project-card"
import type { Proyecto } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ProjectCarouselProps {
  proyectos: Proyecto[]
}

export function ProjectCarousel({ proyectos }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0
      return prev + itemsPerPage
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex
      return Math.max(0, prev - itemsPerPage)
    })
  }

  const totalDots = isMobile ? proyectos.length : Math.ceil(proyectos.length / 3)

  return (
    <div className="relative">
      {/* Botones de navegación */}
      <div className="flex justify-end gap-2 mb-6">
        <Button
          onClick={prevSlide}
          variant="outline"
          size="icon"
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={nextSlide}
          variant="outline"
          size="icon"
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{
            transform: `translateX(-${(currentIndex / proyectos.length) * 100}%)`,
          }}
        >
          {proyectos.map((proyecto, i) => (
            <div
              key={proyecto.idProyecto || i}
              className="flex-none w-full lg:w-[calc(33.333%-16px)]"
            >
              <ProjectCard proyecto={proyecto} />
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de puntos */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalDots }).map((_, i) => {
          const dotIndex = isMobile ? i : i * 3
          const isActive = isMobile
            ? currentIndex === i
            : Math.floor(currentIndex / 3) === i

          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(dotIndex)}
              className={`h-2 rounded-full transition-all ${
                isActive
                  ? "w-8 bg-primary-foreground"
                  : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Ir al proyecto ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}