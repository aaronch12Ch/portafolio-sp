"use server"

import { revalidatePath } from "next/cache"
import type { CreateProyectoDto, Proyecto } from "./api"

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
        const formData = new FormData();
        // Separamos el archivo y los datos JSON
        const { videoFile, s3VideoKey, ...proyectoData } = proyecto;

        // 1. Crear el Blob para la parte 'proyecto' (JSON)
        const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
            type: 'application/json' 
        });
        
        // El backend espera una parte llamada 'proyecto'
        formData.append("proyecto", jsonBlob, "proyecto.json"); 
        
        // 2. Adjuntar la parte 'video' si existe
        if (videoFile) {
            // El backend espera una parte llamada 'video'
            formData.append("video", videoFile, videoFile.name); 
        } 

        const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
            method: "POST",
            headers: {
                // NO incluir Content-Type: multipart/form-data. 
                // fetch lo añade automáticamente con el boundary si el body es FormData.
                Authorization: `Bearer ${token}`, 
            },
            body: formData, // ⬅️ Enviamos el objeto FormData directamente
        });

        console.log("[v0] createProyectoAction - Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log("[v0] createProyectoAction - Error response:", errorText);
            throw new Error(`Error al crear proyecto: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        revalidatePath("/admin");
        return data;
    } catch (error) {
        console.error("[v0] Error creating proyecto:", error);
        throw error;
    }
}

export async function updateProyectoAction(token: string, id: number, proyecto: CreateProyectoDto) {
    try {
        const formData = new FormData();
        // Separamos el archivo y los datos JSON
        const { videoFile, s3VideoKey, ...proyectoData } = proyecto;

        // 1. Crear el Blob para la parte 'proyecto' (JSON)
        const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
            type: 'application/json' 
        });

        formData.append("proyecto", jsonBlob, "proyecto.json"); 
        
        // 2. Adjuntar la parte 'video' si existe
        if (videoFile) {
            formData.append("video", videoFile, videoFile.name); 
        } 

        const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}`, {
            method: "PUT", // ⬅️ PUT method
            headers: {
                // NO incluir Content-Type: multipart/form-data.
                Authorization: `Bearer ${token}`, 
            },
            body: formData, // ⬅️ Enviamos el objeto FormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al actualizar proyecto: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        revalidatePath("/admin");
        return data;
    } catch (error) {
        console.error("Error updating proyecto:", error);
        throw error;
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
