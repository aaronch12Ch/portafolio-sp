// components/auto-logout.tsx
"use client"

import { useEffect, useState } from "react"
import { logout, getToken } from "@/lib/auth"

export function AutoLogout() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Solo ejecutar logout si hay un token y después de montar
    const token = getToken()
    if (token) {
      console.log("Ejecutando auto logout...")
      logout()
      // Opcional: redirigir después de logout
      window.location.href = "/"
    }
  }, [])

  // No renderizar nada hasta que esté montado en el cliente
  if (!mounted) {
    return null
  }

  return null
}