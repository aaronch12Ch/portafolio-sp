"use server"

import { File, Blob} from 'node:buffer';
import { revalidatePath } from "next/cache"
import type {  Proyecto } from "./api"

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


export async function createProyectoServer(token: string, proyectoData: any, videoFile: File | null) {
    try {
        const formData = new FormData();

        console.log(`[v0] 🛠️ Intentando crear Proyecto`);
        console.log(`[v0] 🕵️ Recibido proyectoData (JSON):`, proyectoData); // <-- Ahora puedes ver el JSON simple
        
        // 1. Crear el Blob JSON y adjuntarlo
        const jsonString = JSON.stringify(proyectoData);
        
        // Envía el string. Algunos backends (como Spring Boot) pueden intentar 
        // inferir el tipo o usar el nombre de archivo para identificar esta parte como JSON.
        formData.append("proyecto", jsonString, "proyecto.json");
        
        // 2. Adjuntar el archivo de video
        if (videoFile) {
            // Asegúrate de que el archivo que viene del cliente es un tipo que FormData pueda usar en Node.js
            // Si esto falla, intentaremos una estrategia diferente (Server Action sin argumentos)
            formData.append("video", videoFile, videoFile.name); 
            console.log(`[v0] 🕵️ Adjuntado Video: ${videoFile.name}`);
        }

        // ... El resto del fetch sigue igual...
        const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
            method: "POST", 
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            body: formData, // Enviar el FormData construido en el servidor
        });

        // ... Lógica de respuesta ...
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[v0] ❌ Fallo en la creación: ${response.status} - Respuesta: ${errorText}`);
            throw new Error(`Error al crear proyecto: ${response.status} ${errorText}`);
        }
        // ...
        
    } catch (error) {
        console.error("[v0] Error creating proyecto:", error);
        throw error;
    }
}
interface ProyectoUpdateData {
    nombreProyecto: string;
    descripcionProyecto: string;
    urlImagen: string;
    url: string;
    disponibleProyecto?: boolean;
    s3VideoKey?: string | null;
}
export async function updateProyectoServer(
    token: string, 
    id: number, 
    proyectoData: ProyectoUpdateData, 
    videoFile: File | null
) {
    try {
        const formData = new FormData(); // ⬅️ FormData se crea AHORA en el Servidor
        
        console.log(`[v0] 🛠️ Intentando actualizar Proyecto ID: ${id}`);
        console.log(`[v0] 🕵️ Recibido proyectoData (JSON):`, proyectoData); // ✅ Esto te dará visibilidad
        
        // 1. Crear el Blob JSON y adjuntarlo
        const jsonString = JSON.stringify(proyectoData);
        
        // Envía el string.
        formData.append("proyecto", jsonString, "proyecto.json");// 👈 Quita el nombre de archivo ("proyecto.json") como prueba
        
        // 2. Adjuntar el archivo de video (si existe)
        if (videoFile) {
            // Nota: El objeto File que viene del cliente es serializado por Next.js
            // Usamos 'videoFile.name' para el nombre del archivo en el FormData
            formData.append("video", videoFile, videoFile.name); 
            console.log(`[v0] 🕵️ Adjuntado Video: ${videoFile.name}`);
        }
        
        // -----------------------------------------------------------------

        const response = await fetch(`${API_BASE_URL}/proyectos/admin/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            body: formData, // Enviar el FormData construido en el servidor
        });

        // ... Lógica de respuesta y manejo de errores ...
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[v0] ❌ Fallo en la actualización: ${response.status} - Respuesta: ${errorText}`);
            throw new Error(`Error al actualizar proyecto: ${response.status} ${errorText}`);
        }

        console.log(`[v0] ✅ Proyecto ID: ${id} actualizado con éxito.`);
        const data = await response.json();
        revalidatePath("/admin");
        return data;

    } catch (error) {
        console.error("[v0] Error updating proyecto:", error);
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
