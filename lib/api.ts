import { getToken } from "./auth"
import { File } from 'buffer';
import axios from 'axios';
const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export interface Proyecto {
  idProyecto?: number
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
  videoFile?: File | null;
  s3VideoKey?: string | null 

}

export interface CreateProyectoDto {
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
  videoFile?: File | null; 
  
  // Opcional: Puedes mantener s3VideoKey solo para la ruta de retorno, 
  // pero NO la envías como dato de entrada del formulario.
  s3VideoKey?: string | null; 

}

// Proyectos públicos
export async function getProyectosPublicos(): Promise<Proyecto[]> {
  const response = await fetch(`${API_BASE_URL}/proyectos/todos`)
  if (!response.ok) {
    throw new Error("Error al cargar proyectos")
  }
  return response.json()
}

// Login
export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error("Credenciales inválidas")
  }

  return response.json()
}

// Proyectos admin (requiere autenticación)
export async function getProyectosAdmin(): Promise<Proyecto[]> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al cargar proyectos")
  }

  return response.json()
}

// export async function createProyecto(proyecto: CreateProyectoDto): Promise<Proyecto> {
//   const token = getToken()
//   const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(proyecto),
//   })

//   if (!response.ok) {
//     throw new Error("Error al crear proyecto")
//   }

//   return response.json()
// }
// Importa el DTO modificado

// export async function createProyecto(proyecto: CreateProyectoDto): Promise<Proyecto> {
//     const token = getToken();

//     const formData = new FormData();
//     const { videoFile, s3VideoKey, ...proyectoData } = proyecto;

//     // Crear el Blob para la parte 'proyecto' (crucial para Spring Boot)
//     const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
//         type: 'application/json' 
//     });
    
//     formData.append("proyecto", jsonBlob); 
    
//     // Adjuntar la parte 'video'
//     if (videoFile) {
//         formData.append("video", videoFile, videoFile.name);
//     } 

//     try {
//         // 🚨 CAMBIO CLAVE: Usar axios.post
//         const response = await axios.post<Proyecto>(
//             `${API_BASE_URL}/proyectos/admin`, 
//             formData, // Axios pasa el FormData como cuerpo
//             {
//                 headers: {
//                     // Solo incluimos el header de autorización.
//                     // Axios se encarga de Content-Type: multipart/form-data
//                     Authorization: `Bearer ${token}`,
//                 },
//                 // La configuración de timeout puede ayudar si es un problema de red
//                 // timeout: 30000, 
//             }
//         );
//         // Axios devuelve los datos en la propiedad 'data'
//         return response.data;
//     } catch (error: any) {
//         // Manejo de errores de Axios
//         const status = error.response?.status || 'N/A';
//         const message = error.response?.data?.message || error.message;
//         throw new Error(`Error ${status} al crear proyecto: ${message}`);
//     }
// }

// export async function updateProyecto(idProyecto: number, proyecto: CreateProyectoDto): Promise<Proyecto> {
//     const token = getToken();

//     const formData = new FormData();
//     const { videoFile, s3VideoKey, ...proyectoData } = proyecto; 

//     // Crear el Blob para la parte 'proyecto'
//     const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
//         type: 'application/json' 
//     });

//     formData.append("proyecto", jsonBlob); 
    
//     // Adjuntar la parte 'video'
//     if (videoFile) {
//         formData.append("video", videoFile, videoFile.name);
//     }
    
//     try {
//         // 🚨 CAMBIO CLAVE: Usar axios.put
//         const response = await axios.put<Proyecto>(
//             `${API_BASE_URL}/proyectos/admin/${idProyecto}`, 
//             formData, 
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 // timeout: 30000, 
//             }
//         );
//         return response.data;
//     } catch (error: any) {
//         const status = error.response?.status || 'N/A';
//         const message = error.response?.data?.message || error.message;
//         throw new Error(`Error ${status} al actualizar proyecto: ${message}`);
//     }
// }

export async function deleteProyecto(idProyecto: number): Promise<void> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/proyectos/admin/${idProyecto}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al eliminar proyecto")
  }
}