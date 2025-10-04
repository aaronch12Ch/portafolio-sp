"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, LayoutDashboard } from "lucide-react"
import { useEffect, useState } from "react"
import { getUser, clearAuth, isAdmin } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{user.username}</span>
                {isAdmin() && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
