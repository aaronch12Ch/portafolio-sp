// components/auto-logout.tsx
"use client"

import { useEffect } from "react"
import { logout, getToken } from "@/lib/auth"

export function AutoLogout() {
  useEffect(() => {
    // Solo hacer logout si hay un token activo
    const token = getToken()
    if (token) {
      console.log("Auto logout ejecutado")
      logout()
    }
  }, [])

  return null
}
