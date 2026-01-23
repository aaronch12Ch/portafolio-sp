"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, User, Code, FolderRoot } from "lucide-react"
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

  // Variantes para el panel del menú móvil
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    opened: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  }

  // Variantes para los links individuales (aparición escalonada)
  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    opened: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.2 + i * 0.1 }
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/70 backdrop-blur-md z-[100]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="z-[110]">
            <span className="text-xl font-black tracking-tighter">Aarón.dev</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium hover:text-primary transition-colors">Inicio</button>
            <button onClick={() => scrollToSection('habilidades')} className="text-sm font-medium hover:text-primary transition-colors">Habilidades</button>
            <button onClick={() => scrollToSection('proyectos')} className="text-sm font-medium hover:text-primary transition-colors">Proyectos</button>
            {user ? (
              <div className="flex items-center gap-3 ml-4">
                {isAdmin() && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin"><LayoutDashboard className="h-4 w-4 mr-2" />Admin</Link>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">Salir</Button>
              </div>
            ) : (
              <Button asChild size="sm" className="ml-4 rounded-full">
                <Link href="/login">Ingresar</Link>
              </Button>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA ANIMADO */}
          <button 
            className="md:hidden z-[110] relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <motion.span 
              animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-8 h-0.5 bg-foreground block rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-8 h-0.5 bg-foreground block rounded-full"
            />
            <motion.span 
              animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-8 h-0.5 bg-foreground block rounded-full"
            />
          </button>
        </div>
      </div>

      {/* PANEL DE MENÚ MÓVIL ANIMADO */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed inset-0 bg-background flex flex-col justify-center items-center gap-8 z-[105] md:hidden"
          >
            {[
              { id: 'inicio', label: 'Inicio', icon: <User /> },
              { id: 'habilidades', label: 'Habilidades', icon: <Code /> },
              { id: 'proyectos', label: 'Proyectos', icon: <FolderRoot /> }
            ].map((link, i) => (
              <motion.button
                key={link.id}
                custom={i}
                variants={linkVariants}
                onClick={() => scrollToSection(link.id)}
                className="text-4xl font-black flex items-center gap-4 hover:text-primary transition-colors"
              >
                <span className="text-primary text-2xl">{link.icon}</span>
                {link.label}
              </motion.button>
            ))}

            <motion.div 
              variants={linkVariants} 
              custom={4} 
              className="mt-8 flex flex-col items-center gap-4 w-full px-10"
            >
              {user ? (
                <>
                  <p className="text-muted-foreground">Hola, {user.username}</p>
                  <Button onClick={handleLogout} variant="outline" className="w-full py-6 text-xl">Cerrar Sesión</Button>
                </>
              ) : (
                <Button asChild className="w-full py-6 text-xl rounded-2xl">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}