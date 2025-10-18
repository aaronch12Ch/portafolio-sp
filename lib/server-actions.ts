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


export async function createProyectoNativeAction(formData: FormData) {
    // 1. Obtener los datos del FormData
    const token = formData.get("token") as string; // Obtenido del input oculto
    const id = formData.get("idProyecto") as string | null; // Null para creación
    
    // Extraer las partes que construiste en el cliente (el JSON y el archivo)
    const proyectoDataJson = formData.get("proyecto") as string;
    const videoFile = formData.get("video") as File | null; 
    
    // Aquí puedes hacer la lógica de re-crear el FormData o enviarlo directamente
    // al API de Render.com.
    
    // NOTA: Si tu Backend de Render.com (Spring Boot) espera las partes "proyecto" y "video"
    // directamente del FormData, ¡puedes simplemente reenviarlo!

    if (!token) throw new Error("Token no encontrado en el formulario.");
    
    // 2. Crear un nuevo FormData con las partes esperadas por el backend (si es necesario)
    const apiFormData = new FormData();
    apiFormData.append("proyecto", new Blob([proyectoDataJson], { type: 'application/json' }));
    if (videoFile) {
         // Verificamos si la parte es un File antes de intentar usarlo
         apiFormData.append("video", videoFile, videoFile.name);
    }
    
    // 3. Hacer el fetch
    try {
        const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
            method: "POST", 
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            body: apiFormData, 
        });
        
        // ... (Manejo de respuesta y revalidatePath) ...
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} ${errorText}`);
        }
        revalidatePath("/admin");
        return { success: true, data: await response.json() };
        
    } catch (error) {
        // ...
        return { success: false, error: (error as Error).message };
    }
}
export async function updateProyectoNativeAction(formData: FormData) {
    // 1. Obtener los datos del FormData que viene del cliente
    const token = formData.get("token") as string; // Obtenido del input oculto (o del client handler)
    const idProyectoStr = formData.get("idProyecto") as string; // ID del proyecto a actualizar
    const proyectoDataJson = formData.get("proyecto") as string; // El JSON como string
    
    // El videoFile puede ser un string (si el campo estaba vacío) o un objeto File
    const videoFile = formData.get("video"); 
    
    // Validación básica y conversión
    if (!token) {
        return { success: false, error: "Token de autenticación no encontrado." };
    }
    if (!idProyectoStr) {
        return { success: false, error: "ID de proyecto no encontrado para actualizar." };
    }
    const idProyecto = parseInt(idProyectoStr);
    if (isNaN(idProyecto)) {
        return { success: false, error: "ID de proyecto inválido." };
    }

    // 2. Construir el FormData final para el API de Render.com
    const apiFormData = new FormData();

    try {
        // La parte JSON: Es crítica que se envíe como Blob con application/json
        const jsonBlob = new Blob([proyectoDataJson], { type: 'application/json' });
        apiFormData.append("proyecto", jsonBlob); 
        
        // La parte del archivo (solo si se envió uno)
        // Verificamos si es un objeto File que tiene un tamaño > 0, o si es un string vacío.
        if (videoFile && typeof videoFile !== 'string' && videoFile instanceof File && videoFile.size > 0) {
            apiFormData.append("video", videoFile, videoFile.name);
        }

        // 3. Hacer el fetch
        const response = await fetch(`${API_BASE_URL}/proyectos/admin/${idProyecto}`, {
            method: "PUT", // ⬅️ Método PUT
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            body: apiFormData, // Enviar el FormData construido en el servidor
        });

        // 4. Manejo de respuesta
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[v0] ❌ Fallo en la actualización: ${response.status} - Respuesta: ${errorText}`);
            return { success: false, error: `Error al actualizar: ${response.status} ${errorText}` };
        }

        const data = await response.json();
        revalidatePath("/admin");
        console.log(`[v0] ✅ Proyecto ID: ${idProyecto} actualizado con éxito.`);
        return { success: true, data };

    } catch (error) {
        console.error("[v0] Error updating proyecto (Native Action):", error);
        return { success: false, error: (error as Error).message };
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
