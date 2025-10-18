"use server"

import { revalidatePath } from "next/cache"
import type { CreateProyectoDto, Proyecto} from "./api"
import { createProyecto, updateProyecto } from "./api"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export async function getProyectosAdminAction(token: string): Promise<Proyecto[]> {
  try {
    console.log("[v0] getProyectosAdminAction - Token length:", token?.length)
    console.log("[v0] getProyectosAdminAction - Token preview:", token?.substring(0, 20) + "...")

    const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    console.log("[v0] getProyectosAdminAction - Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] getProyectosAdminAction - Error response:", errorText)
      throw new Error("Error al cargar proyectos")
    }

    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching admin proyectos:", error)
    throw error
  }
}

export async function createProyectoAction(token: string, proyecto: CreateProyectoDto) {
  try {
    console.log("[v0] createProyectoAction - Proyecto data:", proyecto)
    
    // **🚨 CÓDIGO CRÍTICO: LLAMAR A LA FUNCIÓN CON LOGICA DE FORM DATA**
    // La función 'createProyecto' ya obtiene el token, por lo que solo le pasamos el proyecto.
    const data = await createProyecto(proyecto); 
    
    console.log("[v0] createProyectoAction - Proyecto creado con éxito")

    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("[v0] Error creating proyecto:", error)
    // Lanza el error capturado por Axios para que se propague al cliente
    throw error 
  }
}

export async function updateProyectoAction(id: number, proyecto: CreateProyectoDto) {
  try {
    // 🚨 LLAMADA CRÍTICA: Llama a la función que usa FormData y Axios.
    // La función 'updateProyecto' en api.ts ya obtiene el token internamente.
    const data = await updateProyecto(id, proyecto); 

    console.log("[v0] updateProyectoAction - Proyecto actualizado con éxito")
    
    // Si la llamada fue exitosa, revalida la ruta
    revalidatePath("/admin")
    return data
  } catch (error) {
    console.error("Error updating proyecto:", error)
    // Lanza el error para que el cliente lo maneje
    throw error 
  }
}

export async function deleteProyectoAction(token: string, id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Error al eliminar proyecto")
    }

    revalidatePath("/admin")
  } catch (error) {
    console.error("Error deleting proyecto:", error)
    throw error
  }
}

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
    console.error("Error logging in:", error)
    throw error
  }
}
