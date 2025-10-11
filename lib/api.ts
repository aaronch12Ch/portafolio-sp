import { getToken } from "./auth"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export interface Proyecto {
  idProyecto?: number
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
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

export async function createProyecto(proyecto: CreateProyectoDto): Promise<Proyecto> {
    const token = getToken();

    // 1. Crear un objeto FormData
    const formData = new FormData();
    
    // 2. Separar el archivo de los datos JSON.
    // Usamos 'videoFile' para el archivo, y el resto en 'proyectoData'.
    const { videoFile, s3VideoKey, ...proyectoData } = proyecto; 

    // 3. Crear el Blob para la parte JSON (evita el error 400/500)
    const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
        type: 'application/json' 
    });
    
    // 4. Adjuntar la parte 'proyecto'
    formData.append("proyecto", jsonBlob); 
    
    // 5. Adjuntar la parte 'video' (el archivo) solo si existe
    // CLAVE: Usamos la clave "video" que el backend espera (@RequestParam("video"))
    if (videoFile) {
        // El tercer argumento es opcional, pero ayuda a Spring Boot
        formData.append("video", videoFile, videoFile.name);
    } 
    
    const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
        method: "POST",
        headers: {
            // El navegador se encarga del Content-Type: multipart/form-data
            Authorization: `Bearer ${token}`,
        },
        body: formData, 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear proyecto: ${errorText || response.statusText}`);
    }

    return response.json();
}


export async function updateProyecto(idProyecto: number, proyecto: CreateProyectoDto): Promise<Proyecto> {
    const token = getToken();

    // 1. Crear un objeto FormData
    const formData = new FormData();
    
    // 2. Separar el archivo de los datos JSON.
    const { videoFile, s3VideoKey, ...proyectoData } = proyecto; 

    // 3. Crear el Blob para la parte JSON
    const jsonBlob = new Blob([JSON.stringify(proyectoData)], { 
        type: 'application/json' 
    });

    // 4. Adjuntar la parte 'proyecto'
    formData.append("proyecto", jsonBlob); 
    
    // 5. Adjuntar la parte 'video' (el archivo) solo si existe
    if (videoFile) {
        // CLAVE: Usamos la clave "video"
        formData.append("video", videoFile, videoFile.name);
    }
    // Nota: Si 'videoFile' es null, no se adjunta nada, y el backend conserva la s3VideoKey existente.
    
    const response = await fetch(`${API_BASE_URL}/proyectos/admin/${idProyecto}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
        },
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