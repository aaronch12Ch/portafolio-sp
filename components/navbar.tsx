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
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-[100] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        {/* LOGO - Se mantiene visible siempre */}
        <Link href="/" className="relative z-[120]" onClick={() => setIsMenuOpen(false)}>
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

        {/* BOTÓN HAMBURGUESA / X - Con Z-index máximo */}
        <button 
          className="md:hidden relative z-[130] p-2 bg-background rounded-full" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-8 w-8 text-black" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

      {/* PANEL MÓVIL - CUBRE TODO CON BLANCO SÓLIDO */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[110] md:hidden flex flex-col justify-center items-center overflow-hidden"
          >
            {/* Lista de enlaces centrados y limpios */}
            <div className="flex flex-col gap-10 items-center w-full px-10">
              <button
                onClick={() => scrollToSection('inicio')}
                className="flex items-center gap-4 text-4xl font-black text-black"
              >
                <User className="h-8 w-8 text-primary" /> Inicio
              </button>
              
              <button
                onClick={() => scrollToSection('habilidades')}
                className="flex items-center gap-4 text-4xl font-black text-black"
              >
                <Code className="h-8 w-8 text-primary" /> Habilidades
              </button>

              <button
                onClick={() => scrollToSection('proyectos')}
                className="flex items-center gap-4 text-4xl font-black text-black"
              >
                <FolderRoot className="h-8 w-8 text-primary" /> Proyectos
              </button>

              <div className="w-full h-px bg-gray-200 my-4" />

              {user ? (
                <div className="flex flex-col items-center gap-4 w-full">
                   <p className="text-gray-500 font-medium">Hola, {user.username}</p>
                   <Button onClick={handleLogout} variant="outline" className="w-full h-16 text-xl border-2 border-black text-black">
                     Cerrar Sesión
                   </Button>
                </div>
              ) : (
                <Button asChild className="w-full h-16 text-xl bg-black text-white rounded-2xl shadow-xl">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}