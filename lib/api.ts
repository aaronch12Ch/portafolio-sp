import { getToken } from "./auth"

const API_BASE_URL = "https://portafolio-1-q45o.onrender.com/api"

export interface Proyecto {
  idProyecto?: number
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
  disponibleProyecto?: boolean
}

export interface CreateProyectoDto {
  nombreProyecto: string
  descripcionProyecto: string
  urlImagen: string
  url: string
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
