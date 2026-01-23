"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, LayoutDashboard, Code, FolderRoot, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getUser, clearAuth, isAdmin } from "@/lib/auth"

export function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    window.location.href = "/login"
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button onClick={() => scrollToSection('inicio')} className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">Aarón.dev</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium hover:text-primary transition-all hover:scale-105">Inicio</button>
            <button onClick={() => scrollToSection('habilidades')} className="text-sm font-medium hover:text-primary transition-all hover:scale-105">Habilidades</button>
            <button onClick={() => scrollToSection('proyectos')} className="text-sm font-medium hover:text-primary transition-all hover:scale-105">Proyectos</button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">{user.username}</span>
                {isAdmin() && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin"><LayoutDashboard className="h-4 w-4 mr-2" />Admin</Link>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" /> Salir
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="rounded-full">
                <Link href="/login"><LogIn className="h-4 w-4 mr-2" />Ingresar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}