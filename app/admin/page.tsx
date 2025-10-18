"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AdminProjectForm } from "@/components/admin-project-form"
import { AdminProjectList } from "@/components/admin-project-list"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { isAdmin, getUser, getToken } from "@/lib/auth"
import {
  getProyectosAdminAction,
  createProyectoServer,
  updateProyectoServer,
  deleteProyectoAction,
} from "@/lib/server-actions"
import type { Proyecto, CreateProyectoDto } from "@/lib/api"
import { Loader2, Plus } from "lucide-react"

export default function AdminPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const user = getUser()
    if (!user || !isAdmin()) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    loadProyectos()
  }, [router, toast])

  const loadProyectos = async () => {
    try {
      const token = getToken()
      console.log("[v0] loadProyectos - Token from localStorage:", token?.substring(0, 20) + "...")

      if (!token) {
        throw new Error("No hay token de autenticación")
      }
      const data = await getProyectosAdminAction(token)
      setProyectos(data)
    } catch (error) {
      console.error("[v0] loadProyectos error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateProyectoDto) => {
    try {
        const token = getToken()
        if (!token) {
            throw new Error("No hay token de autenticación")
        }

        // Obtener los datos (proyectoData es JSON, videoFile es File)
        const { videoFile, s3VideoKey, ...proyectoData } = data; 

        // 🚨 PASO 2: LLAMAR A LA NUEVA SERVER ACTION (solo con datos puros)
        // Ya no construimos FormData en el cliente.
        // Ojo: Next.js tiene problemas para pasar 'File' en Server Actions. 
        // Si falla, iremos a la Opción B.
        await createProyectoServer(token, proyectoData, videoFile);
    } catch (error) {
      console.error("[v0] handleCreate error:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el proyecto",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: CreateProyectoDto) => {
    if (!editingProyecto?.idProyecto) return

    try {
        const token = getToken()
        if (!token) {
            throw new Error("No hay token de autenticación")
        }

        // 🚨 CAMBIO CLAVE: Extraer las partes JSON y el archivo
        // videoFile es el File, proyectoData es el JSON (sin videoFile ni s3VideoKey)
        const { videoFile, s3VideoKey, ...proyectoData } = data; 
        
        // -----------------------------------------------------
        // 🚨 PASO 2: LLAMAR A LA NUEVA SERVER ACTION, pasando las partes separadas
        // Ya no se crea FormData aquí en el cliente.
        await updateProyectoServer(
            token, 
            editingProyecto.idProyecto, 
            proyectoData, // Pasa el objeto JSON simple
            videoFile      // Pasa el objeto File o null
        )

        toast({
            title: "Éxito",
            description: "Proyecto actualizado correctamente",
        })
        setEditingProyecto(null)
        loadProyectos()
    } catch (error) {
        console.error("[v0] handleUpdate error:", error) // 👈 Asegúrate de ver este log si falla
        toast({
            title: "Error",
            description: "No se pudo actualizar el proyecto",
            variant: "destructive",
        })
    }
}

  const handleDelete = async (id: number) => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No hay token de autenticación")
      }
      await deleteProyectoAction(token, id)
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente",
      })
      loadProyectos()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona tus proyectos</p>
            </div>
            {!showForm && !editingProyecto && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            )}
          </div>

          <div className="space-y-8">
            {(showForm || editingProyecto) && (
              <AdminProjectForm
                proyecto={editingProyecto || undefined}
                onSubmit={editingProyecto ? handleUpdate : handleCreate}
                onCancel={() => {
                  setShowForm(false)
                  setEditingProyecto(null)
                }}
              />
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>
              <AdminProjectList proyectos={proyectos} onEdit={setEditingProyecto} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
