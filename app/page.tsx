export const dynamic = 'force-dynamic' 

import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { AutoLogout } from "@/components/auto-logout"
import { ProjectCarousel } from "@/components/project-carousel"
import { WelcomeScreen } from "@/components/welcome-screen"
import type { Proyecto } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import Link from "next/link"



async function getProyectos(): Promise<Proyecto[]> {
  try {
    const response = await fetch("https://portafolio-1-q45o.onrender.com/api/proyectos/todos", {
      cache: "no-store",

    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron obtener los proyectos.`);
    }

    return response.json() as Promise<Proyecto[]>
  } catch (error) {
    console.error("[v0] Error fetching proyectos:", error)
    return []
  }
}

export default async function HomePage() {
  const proyectos = await getProyectos()
  
  

  return (
    <div className="min-h-screen bg-background">
      <WelcomeScreen />
      <AutoLogout />
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[100vh]">
          {/* Lado izquierdo - Morado */}
          <div className="bg-primary text-primary-foreground px-6 sm:px-12 lg:px-20 py-20 lg:py-32 flex flex-col justify-center relative overflow-hidden">
            {/* Cuadrado flotante */}
            <div className="absolute top-20 right-10 w-20 h-20 border-2 border-primary-foreground/20 rounded-lg rotate-12 animate-float" />
            
            {/* Grid de puntos con rebote */}
            <div className="absolute bottom-[100px] left-10 w-16 h-16 animate-bounce-slow">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-primary-foreground/30 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10 max-w-xl">
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Backen y
                <br />
                DBA.
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                Ingeniero en Sistemas Computacionales.
                <br />
                Construyo productos digitales escalables con experiencias de usuario excepcionales.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div>
                  <p className="font-semibold mb-1">Altamente capacitado en</p>
                  <p className="text-primary-foreground/80">.Net Framework, SQL server y Spring Boot.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Desarrollo base de datos y backend</p>
                  <p className="text-primary-foreground/80">Con arquitecturas modernas y escalables</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Verde lima con foto */}
          <div className="bg-accent text-accent-foreground px-6 sm:px-12 lg:px-20 py-20 lg:py-32 flex items-center justify-center relative overflow-hidden">
            {/* Blob líquido con morphing extremo */}
            <div className="absolute top-16 right-16 w-32 h-32 bg-gradient-to-br from-accent-foreground/20 to-accent-foreground/5 animate-liquid-morph blur-2xl" />
            
           {/* Línea con efecto shimmer neón - MÁS ARRIBA en móvil */}
            <div className="absolute top-10 sm:top-20 right-4 sm:right-16 w-16 sm:w-24 h-0.5 bg-accent-foreground/30 animate-shimmer" />

            {/* Puntos con efecto glitch - MÁS ARRIBA en móvil */}
            <div className="absolute top-14 sm:top-24 right-4 sm:right-16 animate-glitch">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1.5 h-1.5 bg-accent-foreground/40 rounded-full mb-2 animate-neon-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            {/* Cuadrado con efecto magnético 3D - MÁS ABAJO en móvil */}
            <div className="absolute bottom-16 sm:bottom-32 right-4 sm:right-20 w-8 h-8 sm:w-14 sm:h-14 border-2 border-accent-foreground/30 animate-magnetic-pull backdrop-blur-sm bg-accent-foreground/5" 
                style={{ 
                  boxShadow: '0 0 20px rgba(var(--accent-foreground), 0.3)',
                  transformStyle: 'preserve-3d'
                }} 
            />
            
            {/* Elemento flotante en 3D con parallax */}
            <div className="absolute top-1/3 left-16 w-16 h-16 bg-gradient-to-br from-accent-foreground/10 to-transparent rounded-full animate-parallax-float blur-md" />

            <div className="relative">
              {/* Múltiples capas de glow con colores */}
              <div className="absolute -inset-4 bg-gradient-to-r from-accent-foreground/30 via-accent-foreground/10 to-accent-foreground/30 rounded-2xl blur-3xl animate-pulse" />
              <div className="absolute -inset-2 bg-accent-foreground/20 rounded-2xl blur-2xl animate-neon-pulse" />
              
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 relative group animate-float-3d">
                <img
                  src="https://portafoliovideo.s3.us-east-1.amazonaws.com/videos/perfil.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10 transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                  style={{
                    boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(var(--accent-foreground), 0.2)'
                  }}
                />
                
                {/* Overlay con efecto holográfico al hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent-foreground/0 via-accent-foreground/10 to-accent-foreground/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-32">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute -top-8 -left-4">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-primary/30 rounded-full" />
                  ))}
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Design</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Me apasiona crear interfaces intuitivas y atractivas. Diseño experiencias que no solo se ven bien, sino
                que resuelven problemas reales y mejoran la vida de los usuarios.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -top-8 -right-4">
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-accent/40 rounded-full" />
                  ))}
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Engineering</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                En la construcción de aplicaciones, estoy equipado con las herramientas adecuadas y resuelvo problemas
                técnicamente de manera eficiente, escalable y mantenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-20 lg:py-32 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute  left-10 w-32 h-32 border border-primary-foreground/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-40 h-40 border border-primary-foreground/10 rounded-full" />

        <div className="container mx-h-[100vh] px-6 sm:px-12 lg:px-20 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Mis Proyectos</h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              He trabajado en diversos proyectos que demuestran mi capacidad para crear soluciones digitales completas,
              desde el diseño hasta la implementación.
            </p>
          </div>

          {proyectos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-primary-foreground/70 text-lg">No hay proyectos disponibles</p>
            </div>
          )}

          {proyectos.length > 0 && <ProjectCarousel proyectos={proyectos} />}
        </div>
      </section>

      <section className="bg-background py-20 lg:py-32">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Construyo & diseño </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Proyectos open source, aplicaciones web, herramientas útiles y aplicaciones híbridas.
                </p>
                <Link
                  href="/"
                  >
                  <span className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all">
                  Ver mi trabajo <ArrowRight className="w-5 h-5" />
                </span>
                </Link>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Me gusta aprender</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Con ganas de aprender y enseñar. Un gran líder que apoya a su equipo y da solución a problemas.
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Portfolio. Todos los derechos reservados Aarón Córdova Hernández.
          </p>
        </div>
      </footer>
    </div>
  )
}