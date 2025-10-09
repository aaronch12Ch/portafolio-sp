import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink , Video } from "lucide-react"
import Image from "next/image"
import type { Proyecto } from "@/lib/api"

interface ProjectCardProps {
  proyecto: Proyecto
}

export function ProjectCard({ proyecto }: ProjectCardProps) {
  const s3Key = proyecto.s3VideoKey ? String(proyecto.s3VideoKey).trim() : null;

    // 2. CONDICIÓN ESTRICTA: la clave existe Y su longitud es mayor a cero
    const hasVideo = !!s3Key && s3Key.length > 0;
    
    // 3. Construir la URL solo si el video existe
    const videoUrl = hasVideo ? `https://portafoliovideo.s3.us-east-1.amazonaws.com/${s3Key}` : null;

    // 🔴 DEPURACIÓN CRÍTICA 
    console.log("--- DEBUG START ---");
    console.log(`Nombre: ${proyecto.nombreProyecto}`);
    console.log(`s3VideoKey recibido: |${proyecto.s3VideoKey}| (Tipo: ${typeof proyecto.s3VideoKey})`);
    console.log(`s3Key limpio: |${s3Key}|`);
    console.log(`videoUrl: ${videoUrl}`);
    console.log(`HAS VIDEO: ${hasVideo}`); // 👈 ESTO DEBE SER TRUE
    console.log("--- DEBUG END ---");
  //const videoUrl = proyecto.s3VideoKey ? `https://portafoliovideo.s3.us-east-1.amazonaws.com/${proyecto.s3VideoKey}` : null
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

        {hasVideo && ( // <-- Usamos la variable hasVideo que es un booleano seguro
          <Button asChild className="w-full">
            <a href={videoUrl!} target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4 mr-2" />
              Ver Video
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}