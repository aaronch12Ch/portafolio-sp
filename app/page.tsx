"use client"

import { Navbar } from "@/components/navbar"
import TechSphere from "@/components/tech-sphere"
import { AutoLogout } from "@/components/auto-logout"
import { ProjectCarousel } from "@/components/project-carousel"
import { WelcomeScreen } from "@/components/welcome-screen"
import type { Proyecto } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Variantes personalizadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

export default function HomePage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  useEffect(() => {
    async function fetchProyectos() {
      try {
        const response = await fetch("https://portafolio-1-q45o.onrender.com/api/proyectos/todos")
        if (response.ok) {
          const data = await response.json()
          setProyectos(data)
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }
    fetchProyectos()
  }, [])

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-background selection:bg-primary/30">
      <WelcomeScreen />
      <AutoLogout />
      <Navbar />

      {/* SECCIÓN 1: INICIO */}
      <section id="inicio" className="h-screen w-full snap-start snap-always shrink-0 overflow-hidden pt-16">
        <div className="grid lg:grid-cols-2 h-full">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={containerVariants}
            className="bg-primary text-primary-foreground px-6 sm:px-12 lg:px-20 py-10 flex flex-col justify-center relative"
          >
            <motion.div variants={itemVariants}>
              <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-tighter italic">
                Backend <span className="text-accent">&</span> <br /> DBA.
              </h1>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-primary-foreground/80 mb-8 max-w-lg">
              Ingeniero en Sistemas Computacionales construyendo el futuro de las apps escalables.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div className="border-l-2 border-accent pl-4">
                <p className="text-sm uppercase tracking-widest text-accent font-bold">Expertise</p>
                <p className="text-sm opacity-80">Arquitecturas robustas y listas para producción.</p>
              </div>
              <div className="h-[250px] w-full">
                <TechSphere />
              </div>
            </motion.div>
          </motion.div>

          <div className="bg-accent flex items-center justify-center relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-72 h-72 sm:w-96 sm:h-96 relative"
            >
              <img
                src="https://portafoliovideo.s3.us-east-1.amazonaws.com/videos/perfil.jpg"
                alt="Profile"
                className="w-full h-full object-cover rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: HABILIDADES */}
      <section id="habilidades" className="h-screen w-full snap-start snap-always shrink-0 bg-background flex items-center">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-20 max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="group p-8 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-muted/50 transition-all">
              <span className="text-5xl mb-6 block">🎨</span>
              <h2 className="text-4xl font-bold text-primary mb-4">Design</h2>
              <p className="text-lg text-muted-foreground">Interfaces que cuentan historias. No solo diseño píxeles, diseño soluciones para personas reales.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="group p-8 rounded-3xl border border-transparent hover:border-primary/10 hover:bg-muted/50 transition-all">
              <span className="text-5xl mb-6 block">⚙️</span>
              <h2 className="text-4xl font-bold text-primary mb-4">Engineering</h2>
              <p className="text-lg text-muted-foreground">Código limpio, escalable y eficiente. Mi stack está diseñado para el alto rendimiento y la seguridad.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 3: PROYECTOS */}
      <section id="proyectos" className="h-screen w-full snap-start snap-always shrink-0 bg-primary text-primary-foreground flex items-center overflow-hidden">
        <div className="container px-6 relative z-10 w-full">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mb-12"
          >
            <h2 className="text-5xl lg:text-7xl font-black mb-4 uppercase tracking-tighter">Proyectos Seleccionados</h2>
            <div className="h-1 w-24 bg-accent" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            {proyectos.length > 0 && <ProjectCarousel proyectos={proyectos} />}
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 4: CONTACTO */}
      <section id="contacto" className="h-screen w-full snap-start snap-always shrink-0 bg-background flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            className="container px-6 text-center"
          >
            <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-12 tracking-tighter">¿TRABAJAMOS?</motion.h2>
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
              <Link href="/" className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2 group">
                Ver Trabajo <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <footer className="py-8 bg-muted/30">
          <p className="text-center text-sm text-muted-foreground font-medium">
            AARÓN CÓRDOVA HERNÁNDEZ — {new Date().getFullYear()} — HECHO CON NEXT.JS
          </p>
        </footer>
      </section>
    </main>
  )
}