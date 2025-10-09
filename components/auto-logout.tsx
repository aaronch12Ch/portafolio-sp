"use client"

import { useEffect } from "react"
import { logout } from "@/lib/auth"

export function AutoLogout() {
  useEffect(() => {
    logout()
  }, [])

  return null
}
