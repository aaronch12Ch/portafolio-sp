"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import Image from "next/image"
import type { Proyecto } from "@/lib/api"

interface AdminProjectListProps {
  proyectos: Proyecto[]
  onEdit: (proyecto: Proyecto) => void
  onDelete: (id: number) => Promise<void>
}

export function AdminProjectList({ proyectos, onEdit, onDelete }: AdminProjectListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (deleteId === null) return
    setDeleting(true)
    try {
      await onDelete(deleteId)
      setDeleteId(null)
    } finally {
      setDeleting(false)
    }
  }

  if (proyectos.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">No hay proyectos creados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {proyectos.map((proyecto) => (
          <Card key={proyecto.idProyecto} className="overflow-hidden">
            <CardContent className="p-0 md:p-4">
              {/* Cambiamos flex-col para móvil y flex-row para desktop */}
              <div className="flex flex-col md:flex-row gap-4 items-start">
                
                {/* IMAGEN: Ancho completo en móvil, fijo en desktop */}
                <div className="relative w-full md:w-40 h-48 md:h-24 flex-shrink-0 bg-muted">
                  <Image
                    src={proyecto.urlImagen || "/placeholder.svg?height=100&width=160"}
                    alt={proyecto.nombreProyecto}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENIDO: Padding extra en móvil para que no toque los bordes */}
                <div className="flex-1 min-w-0 p-4 md:p-0 w-full">
                  <h3 className="font-bold text-xl md:text-lg mb-1 truncate uppercase">
                    {proyecto.nombreProyecto}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {proyecto.descripcionProyecto}
                  </p>
                  
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-primary" />
                    <a
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate"
                    >
                      {proyecto.url}
                    </a>
                  </div>
                </div>

                {/* BOTONES: Full width en móvil para mejor tacto */}
                <div className="flex md:flex-col gap-2 w-full md:w-auto p-4 md:p-0 pt-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 md:w-10 md:h-10" 
                    onClick={() => onEdit(proyecto)}
                  >
                    <Pencil className="h-4 w-4 md:mr-0 mr-2" />
                    <span className="md:hidden">Editar</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1 md:w-10 md:h-10" 
                    onClick={() => setDeleteId(proyecto.idProyecto)}
                  >
                    <Trash2 className="h-4 w-4 md:mr-0 mr-2" />
                    <span className="md:hidden">Borrar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="w-[95%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el proyecto de forma permanente de tu base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col md:flex-row gap-2">
            <AlertDialogCancel disabled={deleting} className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {deleting ? "Eliminando..." : "Eliminar Proyecto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}