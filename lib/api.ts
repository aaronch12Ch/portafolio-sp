import { getToken } from "./auth"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export interface Proyecto {
  idProyecto?: number
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
  s3VideoKey?: File | null 
}

export interface CreateProyectoDto {
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
  s3VideoKey?: File | null 
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
export async function createProyecto(proyecto: CreateProyectoDto): Promise<Proyecto> {
  const token = getToken();

  // 1. Crear un objeto FormData
  const formData = new FormData();
  
  // 2. Separar los datos del proyecto del archivo
  const { s3VideoKey, ...proyectoData } = proyecto;

  // 3. Agregar la parte 'proyecto' (los datos del proyecto como JSON string)
  //    NOTA: El backend espera un 'String' de JSON para la parte 'proyecto'
  formData.append("proyecto", JSON.stringify(proyectoData));
  
  // 4. Agregar la parte 'video' (el archivo)
  //    IMPORTANTE: El nombre de la clave debe ser "video"
  if (s3VideoKey) {
    formData.append("video", s3VideoKey);
  } 
  
  const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
    method: "POST",
    headers: {
      // 5. ¡CLAVE! Solo incluimos el header de autorización.
      //    El navegador establecerá el 'Content-Type: multipart/form-data' 
      //    automáticamente al usar FormData.
      Authorization: `Bearer ${token}`,
    },
    // 6. Enviar el objeto FormData
    body: formData, 
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Manejo de errores mejorado
    throw new Error(`Error al crear proyecto: ${errorText || response.statusText}`);
  }

  return response.json();
}

export async function updateProyecto(idProyecto: number, proyecto: CreateProyectoDto): Promise<Proyecto> {
  const token = getToken();

  // 1. Crear un objeto FormData
  const formData = new FormData();
  
  // 2. Separar el archivo de video de los datos del proyecto
  const { s3VideoKey, ...proyectoData } = proyecto;

  // 3. Agregar la parte 'proyecto' (los datos del proyecto como JSON string)
  //    NOTA: El backend espera un 'String' de JSON para la parte 'proyecto'.
  formData.append("proyecto", JSON.stringify(proyectoData));
  
  // 4. Agregar la parte 'video' (el archivo), solo si existe.
  //    Si el usuario no sube un archivo, el backend asume que no hay cambio de video.
  if (s3VideoKey) {
    // Si tienes que manejar la eliminación de un video existente, 
    // podrías necesitar otro campo para indicarlo.
    formData.append("video", s3VideoKey);
  }
  
  const response = await fetch(`${API_BASE_URL}/proyectos/admin/${idProyecto}`, {
    // CLAVE: El método es PUT
    method: "PUT",
    headers: {
      // 5. ¡CLAVE! Solo incluimos el header de autorización.
      //    El navegador establecerá el 'Content-Type: multipart/form-data' automáticamente.
      Authorization: `Bearer ${token}`,
    },
    // 6. Enviar el objeto FormData
    body: formData, 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar proyecto: ${errorText || response.statusText}`);
  }

  return response.json();
}

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