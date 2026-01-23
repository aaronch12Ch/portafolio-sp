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

  const menuVariants = {
    closed: { opacity: 0, x: "100%", transition: { duration: 0.3 } },
    opened: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  }

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    opened: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i + 0.2 }
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/95 backdrop-blur-md z-[100] h-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="z-[110]" onClick={() => setIsMenuOpen(false)}>
            <span className="text-xl font-black tracking-tighter text-primary">Aarón Córdova</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium hover:text-primary transition-colors">Inicio</button>
            <button onClick={() => scrollToSection('habilidades')} className="text-sm font-medium hover:text-primary transition-colors">Habilidades</button>
            <button onClick={() => scrollToSection('proyectos')} className="text-sm font-medium hover:text-primary transition-colors">Proyectos</button>
            {user ? (
              <>
                {isAdmin() && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin"><LayoutDashboard className="h-4 w-4 mr-1" /> Admin</Link>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">Salir</Button>
              </>
            ) : (
              <Button asChild size="sm" className="rounded-full px-6">
                <Link href="/login">Ingresar</Link>
              </Button>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA (Visibilidad mejorada) */}
          <button 
            className="md:hidden z-[110] relative w-12 h-12 flex flex-col justify-center items-center focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5 w-7">
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-full h-1 bg-primary block rounded-full"
              />
              <motion.span 
                animate={isMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="w-full h-1 bg-primary block rounded-full"
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-full h-1 bg-primary block rounded-full"
              />
            </div>
          </button>
        </div>
      </div>

      {/* PANEL DE MENÚ MÓVIL */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed inset-0 bg-background z-[105] md:hidden flex flex-col pt-24 px-8 shadow-2xl"
          >
            <div className="flex flex-col gap-8">
              {[
                { id: 'inicio', label: 'Inicio', icon: <User className="w-6 h-6" /> },
                { id: 'habilidades', label: 'Habilidades', icon: <Code className="w-6 h-6" /> },
                { id: 'proyectos', label: 'Proyectos', icon: <FolderRoot className="w-6 h-6" /> }
              ].map((link, i) => (
                <motion.button
                  key={link.id}
                  custom={i}
                  variants={linkVariants}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center gap-4 text-3xl font-bold text-foreground border-b border-border pb-4 active:text-primary"
                >
                  <span className="p-2 bg-primary/10 rounded-xl text-primary">{link.icon}</span>
                  {link.label}
                </motion.button>
              ))}

              <motion.div variants={linkVariants} custom={3} className="pt-4 flex flex-col gap-4">
                {user ? (
                  <>
                    <p className="text-muted-foreground italic text-center">Usuario: {user.username}</p>
                    <Button onClick={handleLogout} variant="outline" className="w-full h-14 text-lg">Cerrar Sesión</Button>
                  </>
                ) : (
                  <Button asChild className="w-full h-14 text-lg rounded-xl">
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}