'use client'
import { ProjectCard } from "@/components/project-card"
import type { Proyecto } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ProjectCarouselProps {
  proyectos: Proyecto[]
}

export function ProjectCarousel({ proyectos }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Funciones de navegación
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      // En móvil avanza de 1 en 1
      if (window.innerWidth < 1024) {
        return prev >= proyectos.length - 1 ? 0 : prev + 1
      }
      // En desktop avanza de 3 en 3
      return prev >= proyectos.length - 3 ? 0 : prev + 3
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      // En móvil retrocede de 1 en 1
      if (window.innerWidth < 1024) {
        return prev <= 0 ? proyectos.length - 1 : prev - 1
      }
      // En desktop retrocede de 3 en 3
      return prev <= 0 ? Math.max(0, proyectos.length - 3) : prev - 3
    })
  }

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
            transform: `translateX(-${currentIndex * (100 / proyectos.length)}%)`,
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
        {proyectos.map((_, i) => {
          // En desktop, mostramos indicadores cada 3 proyectos
          const isDesktopIndicator = window.innerWidth >= 1024 && i % 3 === 0
          const isMobileIndicator = window.innerWidth < 1024

          if (!isDesktopIndicator && !isMobileIndicator) return null

          const isActive =
            window.innerWidth >= 1024
              ? Math.floor(currentIndex / 3) === Math.floor(i / 3)
              : currentIndex === i

          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
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