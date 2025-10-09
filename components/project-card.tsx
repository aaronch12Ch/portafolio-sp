import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Proyecto } from "@/lib/api"

interface ProjectCardProps {
  proyecto: Proyecto
}

export function ProjectCard({ proyecto }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={proyecto.urlImagen || "/placeholder.svg?height=400&width=600"}
          alt={proyecto.nombreProyecto}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-balance">{proyecto.nombreProyecto}</CardTitle>
        <CardDescription className="text-pretty line-clamp-2">{proyecto.descripcionProyecto}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" className="w-full bg-transparent">
          <a href={proyecto.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Proyecto
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}