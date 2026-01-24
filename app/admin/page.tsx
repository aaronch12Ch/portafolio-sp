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
  deleteProyectoAction,
} from "@/lib/server-actions"
import type { Proyecto, CreateProyectoDto } from "@/lib/api"
import { Loader2, Plus, ArrowLeft } from "lucide-react"

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
      if (!token) throw new Error("No hay token de autenticación")
      const data = await getProyectosAdminAction(token)
      setProyectos(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ... (Tus funciones handleCreate, handleUpdate, handleDeleteVideo, handleDelete se mantienen igual)
  // Las mantuve igual ya que la lógica de backend funciona, solo cambiaremos la UI.

  const handleCreate = async (data: CreateProyectoDto & { videoFile?: File | null }) => {
    try {
      const token = getToken()
      if (!token) throw new Error("No hay token de autenticación")
      const { videoFile, ...proyectoData } = data
      const createResponse = await fetch("https://portafolio-1-q45o.onrender.com/api/proyectos/admin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proyectoData),
      })
      if (!createResponse.ok) throw new Error("Error al crear proyecto")
      const nuevoProyecto = await createResponse.json()
      if (videoFile && nuevoProyecto.idProyecto) {
        const formData = new FormData()
        formData.append("video", videoFile)
        await fetch(`https://portafolio-1-q45o.onrender.com/api/proyectos/admin/${nuevoProyecto.idProyecto}/video`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        })
      }
      toast({ title: "Éxito", description: "Proyecto creado correctamente" })
      setShowForm(false)
      loadProyectos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleUpdate = async (data: CreateProyectoDto & { videoFile?: File | null }) => {
    if (!editingProyecto?.idProyecto) return
    try {
      const token = getToken()
      if (!token) throw new Error("No hay token de autenticación")
      const { videoFile, ...proyectoData } = data
      const updateResponse = await fetch(`https://portafolio-1-q45o.onrender.com/api/proyectos/admin/${editingProyecto.idProyecto}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proyectoData),
        }
      )
      if (!updateResponse.ok) throw new Error("Error al actualizar")
      if (videoFile) {
        const formData = new FormData()
        formData.append("video", videoFile)
        await fetch(`https://portafolio-1-q45o.onrender.com/api/proyectos/admin/${editingProyecto.idProyecto}/video`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        })
      }
      toast({ title: "Éxito", description: "Proyecto actualizado correctamente" })
      setEditingProyecto(null)
      loadProyectos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const token = getToken()
      if (!token) throw new Error("No hay token de autenticación")
      await deleteProyectoAction(token, id)
      toast({ title: "Éxito", description: "Proyecto eliminado" })
      loadProyectos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteVideo = async (id: number) => {
    try {
      const token = getToken()
      if (!token) throw new Error("No hay token de autenticación")
      await fetch(`https://portafolio-1-q45o.onrender.com/api/proyectos/admin/${id}/video`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
      })
      toast({ title: "Éxito", description: "Video eliminado" })
      loadProyectos()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Cargando panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* HEADER RESPONSIVO */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                Panel Admin
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Gestiona y actualiza tu portafolio personal.
              </p>
            </div>

            {!showForm && !editingProyecto ? (
              <Button 
                onClick={() => setShowForm(true)} 
                className="w-full md:w-auto rounded-xl h-12 md:h-10 shadow-lg transition-all active:scale-95"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Proyecto
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => { setShowForm(false); setEditingProyecto(null); }}
                className="w-fit"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la lista
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-10">
            {/* FORMULARIO (Se muestra arriba si está activo) */}
            {(showForm || editingProyecto) && (
              <div className="bg-card border rounded-3xl p-4 md:p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6">
                  {editingProyecto ? "Editar Proyecto" : "Datos del Nuevo Proyecto"}
                </h2>
                <AdminProjectForm
                  proyecto={editingProyecto || undefined}
                  onSubmit={editingProyecto ? handleUpdate : handleCreate}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingProyecto(null)
                  }}
                />
              </div>
            )}

            {/* LISTA DE PROYECTOS */}
            {!showForm && !editingProyecto && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-bold">Tus Proyectos ({proyectos.length})</h2>
                </div>
                
                {/* Asegúrate de que AdminProjectList use un grid interno */}
                <AdminProjectList
                  proyectos={proyectos}
                  onEdit={setEditingProyecto}
                  onDelete={handleDelete}
                  onDeleteVideo={handleDeleteVideo}
                />
                
                {proyectos.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed rounded-3xl text-muted-foreground">
                    No hay proyectos aún. ¡Crea el primero!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}