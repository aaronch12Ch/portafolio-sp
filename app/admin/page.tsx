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
  createProyectoAction,
  updateProyectoAction,
  uploadVideoAction,
  deleteVideoAction,
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
      console.log("[Admin] loadProyectos - Token:", token?.substring(0, 20) + "...")

      if (!token) {
        throw new Error("No hay token de autenticación")
      }
      const data = await getProyectosAdminAction(token)
      setProyectos(data)
    } catch (error) {
      console.error("[Admin] loadProyectos error:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateProyectoDto & { videoFile?: File | null }) => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      // Extraer el video del objeto
      const { videoFile, ...proyectoData } = data

      console.log("[Admin] 🚀 Iniciando creación de proyecto...")
      console.log("[Admin] 📦 Datos completos recibidos del form:", data)
      console.log("[Admin] 📦 Video file:", videoFile?.name || "ninguno")
      console.log("[Admin] 📦 Datos del proyecto (JSON):", proyectoData)

      // 1. Crear el proyecto primero (sin video)
      const nuevoProyecto = await createProyectoAction(token, proyectoData)
      console.log("[Admin] ✅ Proyecto creado con ID:", nuevoProyecto.idProyecto)

      // 2. Si hay video, subirlo después
      if (videoFile && nuevoProyecto.idProyecto) {
        console.log("[Admin] 📹 Subiendo video...")
        await uploadVideoAction(token, nuevoProyecto.idProyecto, videoFile)
        console.log("[Admin] ✅ Video subido exitosamente")
      }

      toast({
        title: "Éxito",
        description: "Proyecto creado correctamente",
      })

      setShowForm(false)
      loadProyectos()
    } catch (error) {
      console.error("[Admin] ❌❌❌ handleCreate error:", error)
      console.error("[Admin] ❌ Stack trace:", error instanceof Error ? error.stack : "No stack")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el proyecto",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: CreateProyectoDto & { videoFile?: File | null }) => {
    if (!editingProyecto?.idProyecto) return

    try {
      const token = getToken()
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      // Extraer el video del objeto
      const { videoFile, ...proyectoData } = data

      console.log("[Admin] 🚀 Iniciando actualización del proyecto ID:", editingProyecto.idProyecto)
      console.log("[Admin] 📦 Datos completos recibidos del form:", data)
      console.log("[Admin] 📦 Video file:", videoFile?.name || "ninguno")
      console.log("[Admin] 📦 Datos del proyecto (JSON):", proyectoData)

      // 1. Actualizar el proyecto primero (sin video)
      await updateProyectoAction(token, editingProyecto.idProyecto, proyectoData)
      console.log("[Admin] ✅ Datos del proyecto actualizados")

      // 2. Si hay un nuevo video, subirlo (esto reemplaza el anterior automáticamente)
      if (videoFile) {
        console.log("[Admin] 📹 Subiendo nuevo video...")
        await uploadVideoAction(token, editingProyecto.idProyecto, videoFile)
        console.log("[Admin] ✅ Video actualizado exitosamente")
      }

      toast({
        title: "Éxito",
        description: "Proyecto actualizado correctamente",
      })

      setEditingProyecto(null)
      loadProyectos()
    } catch (error) {
      console.error("[Admin] ❌❌❌ handleUpdate error:", error)
      console.error("[Admin] ❌ Stack trace:", error instanceof Error ? error.stack : "No stack")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el proyecto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVideo = async (id: number) => {
    try {
      const token = getToken()
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      console.log("[Admin] 🗑️ Eliminando video del proyecto ID:", id)
      await deleteVideoAction(token, id)
      console.log("[Admin] ✅ Video eliminado")

      toast({
        title: "Éxito",
        description: "Video eliminado correctamente",
      })

      loadProyectos()
    } catch (error) {
      console.error("[Admin] handleDeleteVideo error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el video",
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

      console.log("[Admin] 🗑️ Eliminando proyecto ID:", id)
      await deleteProyectoAction(token, id)
      console.log("[Admin] ✅ Proyecto eliminado")

      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente",
      })

      loadProyectos()
    } catch (error) {
      console.error("[Admin] handleDelete error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el proyecto",
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
              <AdminProjectList
                proyectos={proyectos}
                onEdit={setEditingProyecto}
                onDelete={handleDelete}
                onDeleteVideo={handleDeleteVideo}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}