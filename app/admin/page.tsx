"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AdminProjectForm } from "@/components/admin-project-form"
import { AdminProjectList } from "@/components/admin-project-list"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { isAdmin, getUser } from "@/lib/auth"
import { 
  getProyectosAdmin, 
  createProyecto, 
  updateProyecto, 
  deleteProyecto 
} from "@/lib/api"  // ← Importar directamente de api.ts
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
      console.log("[v0] loadProyectos - Cargando proyectos...");

      // ✅ Llamar directamente a la función de api.ts
      const data = await getProyectosAdmin();
      setProyectos(data);
      console.log("[v0] Proyectos cargados:", data.length);
    } catch (error) {
      console.error("[v0] loadProyectos error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron cargar los proyectos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateProyectoDto) => {
    try {
      console.log("[v0] handleCreate - Creando proyecto...");
      console.log("[v0] Data:", data);

      // ✅ Llamar directamente a la función de api.ts
      await createProyecto(data);
      
      toast({
        title: "Éxito",
        description: "Proyecto creado correctamente",
      })
      setShowForm(false)
      await loadProyectos()
    } catch (error) {
      console.error("[v0] handleCreate error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el proyecto",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (data: CreateProyectoDto) => {
    if (!editingProyecto?.idProyecto) return

    try {
      console.log("[v0] handleUpdate - Actualizando proyecto ID:", editingProyecto.idProyecto);
      
      // ✅ Llamar directamente a la función de api.ts
      await updateProyecto(editingProyecto.idProyecto, data);
      
      toast({
        title: "Éxito",
        description: "Proyecto actualizado correctamente",
      })
      setEditingProyecto(null)
      await loadProyectos()
    } catch (error) {
      console.error("[v0] handleUpdate error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el proyecto",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;

    try {
      console.log("[v0] handleDelete - Eliminando proyecto ID:", id);
      
      // ✅ Llamar directamente a la función de api.ts
      await deleteProyecto(id);
      
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente",
      })
      await loadProyectos()
    } catch (error) {
      console.error("[v0] handleDelete error:", error);
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
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}