import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink , Video } from "lucide-react"
import Image from "next/image"
import type { Proyecto } from "@/lib/api"

interface ProjectCardProps {
  proyecto: Proyecto
}

export function ProjectCard({ proyecto }: ProjectCardProps) {
  console.log(`Proyecto: ${proyecto.nombreProyecto}, s3VideoKey: ${proyecto.s3VideoKey}`) // <-- ¡Añade esto!
  
  const videoUrl = proyecto.s3VideoKey ? `https://portafoliovideo.s3.us-east-1.amazonaws.com/${proyecto.s3VideoKey}` : null
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
      <CardFooter  className="flex flex-col sm:flex-row gap-2">
        <Button asChild variant="outline" className="w-full bg-transparent">
          <a href={proyecto.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Proyecto
          </a>
        </Button>
        {videoUrl && (
          <Button asChild className="w-full">
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4 mr-2" />
              Ver Video
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}