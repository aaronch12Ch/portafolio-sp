"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, User, Code, FolderRoot, X, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { getUser, clearAuth, isAdmin } from "@/lib/auth"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/80 backdrop-blur-md z-[100] h-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="z-[110]">
            <span className="text-xl font-black tracking-tighter">Aarón Córdova</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium hover:text-primary transition-colors">Inicio</button>
            <button onClick={() => scrollToSection('habilidades')} className="text-sm font-medium hover:text-primary transition-colors">Habilidades</button>
            <button onClick={() => scrollToSection('proyectos')} className="text-sm font-medium hover:text-primary transition-colors">Proyectos</button>
            {user ? (
              <Button onClick={handleLogout} variant="outline" size="sm">Salir</Button>
            ) : (
              <Button asChild size="sm" className="rounded-full"><Link href="/login">Ingresar</Link></Button>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA / X (Solo cambia el icono) */}
          <button 
            className="md:hidden z-[120] p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-8 w-8 text-black" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
      </div>

      {/* PANEL MÓVIL FULL WHITE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[115] md:hidden flex flex-col pt-24 px-8"
          >
            <div className="flex flex-col gap-8">
              <button
                onClick={() => scrollToSection('inicio')}
                className="flex items-center gap-4 text-3xl font-bold text-black border-b border-gray-100 pb-4"
              >
                <User className="text-primary" /> Inicio
              </button>
              <button
                onClick={() => scrollToSection('habilidades')}
                className="flex items-center gap-4 text-3xl font-bold text-black border-b border-gray-100 pb-4"
              >
                <Code className="text-primary" /> Habilidades
              </button>
              <button
                onClick={() => scrollToSection('proyectos')}
                className="flex items-center gap-4 text-3xl font-bold text-black border-b border-gray-100 pb-4"
              >
                <FolderRoot className="text-primary" /> Proyectos
              </button>

              <div className="mt-4 flex flex-col gap-4">
                {user ? (
                  <Button onClick={handleLogout} variant="outline" className="w-full h-14 text-lg border-black text-black">Cerrar Sesión</Button>
                ) : (
                  <Button asChild className="w-full h-14 text-lg bg-black text-white rounded-xl">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}