"use server"

import { revalidatePath } from "next/cache"
import type { Proyecto } from "./api"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export async function getProyectosAdminAction(token: string): Promise<Proyecto[]> {
  try {
    console.log("[Server] getProyectosAdminAction - Token length:", token?.length)
    console.log("[Server] getProyectosAdminAction - Token preview:", token?.substring(0, 20) + "...")

    const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    console.log("[Server] getProyectosAdminAction - Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[Server] getProyectosAdminAction - Error response:", errorText)
      throw new Error("Error al cargar proyectos")
    }

    return response.json()
  } catch (error) {
    console.error("[Server] Error fetching admin proyectos:", error)
    throw error
  }
}

interface ProyectoData {
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
}

// Crear proyecto (sin video)
export async function createProyectoAction(token: string, proyectoData: ProyectoData): Promise<Proyecto> {
  try {
    console.log("[Server] 🛠️ Creando Proyecto (sin video)")
    console.log("[Server] 🕵️ Datos del proyecto:", proyectoData)

    const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proyectoData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Server] ❌ Error al crear proyecto: ${response.status} - ${errorText}`)
      throw new Error(`Error al crear proyecto: ${response.status}`)
    }

    const data = await response.json()
    console.log("[Server] ✅ Proyecto creado con ID:", data.idProyecto)
    
    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("[Server] Error creating proyecto:", error)
    throw error
  }
}

// Actualizar proyecto (sin video)
export async function updateProyectoAction(
  token: string,
  id: number,
  proyectoData: ProyectoData
): Promise<Proyecto> {
  try {
    console.log(`[Server] 🛠️ Actualizando Proyecto ID: ${id}`)
    console.log(`[Server] 🕵️ Datos del proyecto:`, proyectoData)

    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proyectoData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Server] ❌ Error al actualizar: ${response.status} - ${errorText}`)
      throw new Error(`Error al actualizar proyecto: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Server] ✅ Proyecto ID: ${id} actualizado`)
    
    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("[Server] Error updating proyecto:", error)
    throw error
  }
}

// Subir video a un proyecto existente
export async function uploadVideoAction(
  token: string,
  id: number,
  videoFile: File
): Promise<Proyecto> {
  try {
    console.log(`[Server] 🎬 Subiendo video para Proyecto ID: ${id}`)
    console.log(`[Server] 🕵️ Archivo: ${videoFile.name}, Tamaño: ${videoFile.size} bytes`)

    const formData = new FormData()
    formData.append("video", videoFile, videoFile.name)

    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Server] ❌ Error al subir video: ${response.status} - ${errorText}`)
      throw new Error(`Error al subir video: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Server] ✅ Video subido exitosamente para proyecto ID: ${id}`)
    
    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("[Server] Error uploading video:", error)
    throw error
  }
}

// Eliminar video de un proyecto
export async function deleteVideoAction(token: string, id: number): Promise<Proyecto> {
  try {
    console.log(`[Server] 🗑️ Eliminando video del Proyecto ID: ${id}`)

    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}/video`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Server] ❌ Error al eliminar video: ${response.status} - ${errorText}`)
      throw new Error(`Error al eliminar video: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Server] ✅ Video eliminado del proyecto ID: ${id}`)
    
    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("[Server] Error deleting video:", error)
    throw error
  }
}

// Eliminar proyecto completo
export async function deleteProyectoAction(token: string, id: number): Promise<void> {
  try {
    console.log(`[Server] 🗑️ Eliminando Proyecto ID: ${id}`)

    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Server] ❌ Error al eliminar proyecto: ${response.status} - ${errorText}`)
      throw new Error(`Error al eliminar proyecto: ${response.status}`)
    }

    console.log(`[Server] ✅ Proyecto ID: ${id} eliminado`)
    revalidatePath("/admin")
  } catch (error) {
    console.error("[Server] Error deleting proyecto:", error)
    throw error
  }
}

// Login
export async function loginAction(correoUsuario: string, contrasena: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correoUsuario, contrasena }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || "Credenciales inválidas")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[Server] Error logging in:", error)
    throw error
  }
}