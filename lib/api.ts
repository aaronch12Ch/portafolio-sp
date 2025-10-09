import { getToken } from "./auth"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export interface Proyecto {
  idProyecto?: number
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
  s3VideoKey?:string
}

export interface CreateProyectoDto {
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  s3VideoKey?:string
}

// Proyectos públicos


// En tu función de API (getProyectosPublicos)

export async function getProyectosPublicos(): Promise<Proyecto[]> {
  try {
    const response = await  fetch(`${API_BASE_URL}/proyectos/todos`);
    if (!response.ok) {
      // Si la respuesta no es 200, devuelve un array vacío en lugar de lanzar un error que podría
      // ser mal manejado por el Server Component en el build.
      console.error("Error al cargar proyectos:", response.status);
      return []; // ✅ Asegúrate de devolver un array vacío
    }
    return response.json();
  } catch (error) {
    console.error("Error de red o JSON:", error);
    return []; // ✅ Asegúrate de devolver un array vacío en caso de error de red
  }
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

export async function createProyecto(proyecto: CreateProyectoDto): Promise<Proyecto> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/proyectos/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(proyecto),
  })

  if (!response.ok) {
    throw new Error("Error al crear proyecto")
  }

  return response.json()
}

export async function updateProyecto(idProyecto: number, proyecto: CreateProyectoDto): Promise<Proyecto> {
  const token = getToken()
  const response = await fetch(`${API_BASE_URL}/proyectos/admin/${idProyecto}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(proyecto),
  })

  if (!response.ok) {
    throw new Error("Error al actualizar proyecto")
  }

  return response.json()
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
