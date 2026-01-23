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

  // Animación del panel: Se desliza y cambia la opacidad
  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    opened: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  }

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    opened: (i: number) => ({
      opacity: 1, 
      x: 0, 
      transition: { delay: 0.1 * i + 0.2 }
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/80 backdrop-blur-md z-[100] h-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="z-[110]" onClick={() => setIsMenuOpen(false)}>
            <span className="text-xl font-black tracking-tighter">Aarón Córdova</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* BOTÓN HAMBURGUESA */}
          <button 
            className="md:hidden z-[110] relative w-10 h-10 flex flex-col justify-center items-center focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex flex-col gap-1.5 w-7">
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 7, backgroundColor: "#000" } : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
                className="w-full h-1 block rounded-full"
              />
              <motion.span 
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: "currentColor" }}
                className="w-full h-1 block rounded-full"
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -7, backgroundColor: "#000" } : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
                className="w-full h-1 block rounded-full"
              />
            </div>
          </button>
        </div>
      </div>

      {/* PANEL MÓVIL CON DESENFOQUE (BLUR) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Fondo de desenfoque oscuro sutil */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[104] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Panel Blanco */}
            <motion.div 
              variants={menuVariants}
              initial="closed"
              animate="opened"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[105] md:hidden flex flex-col pt-24 px-8 shadow-2xl"
            >
              <div className="flex flex-col gap-6">
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
                    className="flex items-center gap-4 text-3xl font-bold text-black border-b border-gray-100 pb-5 active:bg-gray-50 transition-all"
                  >
                    <span className="p-2 bg-gray-100 rounded-xl text-black">
                      {link.icon}
                    </span>
                    {link.label}
                  </motion.button>
                ))}

                <motion.div variants={linkVariants} custom={3} className="pt-6 flex flex-col gap-4">
                  {user ? (
                    <>
                      <p className="text-gray-500 text-center text-sm italic">Sesión activa: {user.username}</p>
                      <Button onClick={handleLogout} variant="outline" className="w-full h-14 text-lg border-black text-black">
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="w-full h-14 text-lg bg-black text-white rounded-xl shadow-lg">
                      <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}