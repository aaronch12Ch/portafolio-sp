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
import { Pencil, Trash2 } from "lucide-react"
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
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">No hay proyectos creados. Crea tu primer proyecto.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {proyectos.map((proyecto) => (
          <Card key={proyecto.idProyecto}>
            <CardContent className="p-4">
              <div className="flex gap-4 items-start">
                <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
                  <Image
                    src={proyecto.urlImagen || "/placeholder.svg?height=80&width=128"}
                    alt={proyecto.nombreProyecto}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1 truncate">{proyecto.nombreProyecto}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{proyecto.descripcionProyecto}</p>
                  <a
                    href={proyecto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {proyecto.url}
                  </a>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => onEdit(proyecto)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(proyecto.idProyecto)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
