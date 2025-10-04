// Función para decodificar JWT sin librerías externas
function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("[v0] Error decoding JWT:", error)
    return null
  }
}

// Guardar autenticación en localStorage
export function saveAuth(token: string) {
  if (typeof window === "undefined") return

  const decoded = decodeJWT(token)

  if (decoded) {
    localStorage.setItem("token", token)
    localStorage.setItem("userEmail", decoded.sub || "")
    localStorage.setItem("userRole", decoded.roles || "")
  }
}

// Obtener token
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

// Obtener rol del usuario
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userRole")
}

// Obtener email del usuario
export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("userEmail")
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  return !!getToken()
}

// Verificar si el usuario es admin o jefe
export function isAdmin(): boolean {
  const role = getUserRole()
  return role === "ADMIN" || role === "JEFE"
}

// Cerrar sesión
export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userRole")
}

export function getUser() {
  if (typeof window === "undefined") return null

  const token = getToken()
  const email = getUserEmail()
  const role = getUserRole()

  if (!token) return null

  return {
    username: email,
    email: email,
    role: role,
  }
}

export function clearAuth() {
  logout()
}
