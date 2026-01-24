"use client"

import { Navbar } from "@/components/navbar"
import TechSphere from "@/components/tech-sphere"
import { AutoLogout } from "@/components/auto-logout"
import { ProjectCarousel } from "@/components/project-carousel"
import { WelcomeScreen } from "@/components/welcome-screen"
import type { Proyecto } from "@/lib/api"
import { Phone,Mails,Linkedin} from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  useEffect(() => {
    async function fetchProyectos() {
      try {
        const response = await fetch("https://portafolio-1-q45o.onrender.com/api/proyectos/todos")
        if (response.ok) setProyectos(await response.json())
      } catch (e) { console.error(e) }
    }
    fetchProyectos()
  }, [])

  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-background">
      <WelcomeScreen />
      <AutoLogout />
      <Navbar />

      {/* SECCIÓN 1: INICIO */}
      <section id="inicio" className="min-h-screen lg:h-screen w-full snap-start snap-always shrink-0 pt-16 lg:pt-0">
        <div className="grid lg:grid-cols-2 h-full">
          <div className="bg-primary text-primary-foreground px-6 sm:px-12 lg:px-20 py-12 flex flex-col justify-center relative overflow-hidden">
            {/* Decorativos Originales */}
            <div className="absolute top-20 right-10 w-16 h-16 border-2 border-primary-foreground/20 rounded-lg rotate-12 animate-float" />
            <div className="absolute bottom-10 left-10 opacity-30 lg:opacity-100">
               <div className="grid grid-cols-3 gap-1">
                 {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-primary-foreground/40 rounded-full" />)}
               </div>
            </div>

            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} className="relative z-10">
              <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-none">Backend y <br /> DBA.</h1>
              <p className="text-lg opacity-90 mb-8 max-w-md">Ingeniero en Sistemas Computacionales.
                <br/>
                Apasionado en Backend.
                </p>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-full sm:w-1/2 space-y-2 text-center sm:text-left">
                  <h3 className="font-bold text-accent">Sistemas Escalables</h3>
                  <p className="text-sm opacity-80">Tecnologías utilizadas:</p>
                </div>
                <div className="w-70 h-70 lg:w-90 lg:h-90">
                  <TechSphere />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="bg-accent flex items-center justify-center p-10 relative overflow-hidden">
            {/* Decoraciones del lado derecho */}
            <div className="absolute top-10 right-10 flex flex-col gap-2 animate-pulse">
               {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-accent-foreground/30 rounded-full" />)}
            </div>
            <motion.div 
              initial={{scale:0.8, opacity:0}} whileInView={{scale:1, opacity:1}}
              className="w-56 h-56 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] relative z-10"
            >
              <img src="https://portafoliovideo.s3.us-east-1.amazonaws.com/videos/perfil.jpg" alt="Perfil" className="w-full h-full object-cover rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: DESIGN & ENGINEERING */}
      <section id="habilidades" className="min-h-screen lg:h-screen w-full snap-start snap-always bg-background flex items-center py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div initial={{opacity:0, x:-30}} whileInView={{opacity:1, x:0}} className="space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-primary italic">DESIGN</h2>
            <p className="text-muted-foreground text-lg">Diseño interfaces que no solo se ven bien, sino que resuelven problemas reales de usuarios.</p>
          </motion.div>
          <motion.div initial={{opacity:0, x:30}} whileInView={{opacity:1, x:0}} className="space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black text-primary italic">ENGINEERING</h2>
            <p className="text-muted-foreground text-lg">Código eficiente, escalable y mantenible usando el stack más moderno del mercado.</p>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN 3: PROYECTOS */}
      <section id="proyectos" className="min-h-screen lg:h-screen w-full snap-start snap-always bg-primary text-primary-foreground flex items-center py-20 overflow-hidden">
        <div className="container px-6 mx-auto">
          <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} className="text-4xl sm:text-7xl font-bold mb-12 tracking-tighter">MIS PROYECTOS</motion.h2>
          <div className="w-full">{proyectos.length > 0 && <ProjectCarousel proyectos={proyectos} />}</div>
        </div>
      </section>

      {/* SECCIÓN 4: CIERRE */}
      <section id="contacto" className="min-h-screen lg:h-screen w-full snap-start snap-always bg-background flex flex-col justify-between">
        <div className="flex-grow flex items-center">
          <div className="container px-6 mx-auto grid md:grid-cols-2 gap-16">
            <motion.div initial={{y:30, opacity:0}} whileInView={{y:0, opacity:1}}>
              <h2 className="text-3xl font-bold text-primary mb-4">Construyo & Diseño</h2>
              <p className="text-muted-foreground mb-6">Disponible para proyectos freelance y colaboraciones open source.</p>
              <ol className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                <li><Phone /> 5570739258</li>
                <li><Mails />aron2014123456@gmail.com</li>
                <li><Linkedin />www.linkedin.com/in/aarón-córdova-hernández-a317661ba</li>
              </ol>
              
            </motion.div>
            <motion.div initial={{y:30, opacity:0}} whileInView={{y:0, opacity:1}} transition={{delay:0.2}}>
              <h2 className="text-3xl font-bold text-primary mb-4">Liderazgo Técnico</h2>
              <p className="text-muted-foreground">Enfocado en apoyar equipos y dar soluciones eficientes a problemas complejos.</p>
            </motion.div>
          </div>
        </div>
        <footer className="py-10 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Aarón Córdova Hernández.
        </footer>
      </section>
    </main>
  )
}