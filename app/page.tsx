import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project-card"
import { AutoLogout } from "@/components/auto-logout"
import type { Proyecto } from "@/lib/api"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

async function getProyectos(): Promise<Proyecto[]> {
  try {
    const response = await fetch("https://portafolio-1-q45o.onrender.com/api/proyectos/todos", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("[v0] Error fetching proyectos:", response.status)
      return []
    }

    return response.json()
  } catch (error) {
    console.error("[v0] Error fetching proyectos:", error)
    return []
  }
}

export default async function HomePage() {
  const proyectos = await getProyectos()

  return (
    <div className="min-h-screen bg-background">
      <AutoLogout />
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[100vh]">
          {/* Lado izquierdo - Morado */}
          <div className="bg-primary text-primary-foreground px-6 sm:px-12 lg:px-20 py-20 lg:py-32 flex flex-col justify-center relative">
            {/* Elementos decorativos */}
            <div className="absolute top-20 right-10 w-20 h-20 border-2 border-primary-foreground/20 rounded-lg rotate-12" />
            <div className="absolute bottom-32 left-10 w-16 h-16">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-primary-foreground/30 rounded-full" />
                ))}
              </div>
            </div>

            <div className="relative z-10 max-w-xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Backen y
                <br />
                DBA.
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                Construyo productos digitales escalables con experiencias de usuario excepcionales
              </p>

              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div>
                  <p className="font-semibold mb-1">Altamente capacitado en</p>
                  <p className="text-primary-foreground/80">.Net Framework, SQL server y Spring Boot</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Desarrollo base de datos y backend</p>
                  <p className="text-primary-foreground/80">con arquitecturas modernas y escalables</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado derecho - Verde lima con foto */}
          <div className="bg-accent text-accent-foreground px-6 sm:px-12 lg:px-20 py-20 lg:py-32 flex items-center justify-center relative">
            {/* Elementos decorativos */}
            <div className="absolute top-16 right-16 w-24 h-1 bg-accent-foreground/20" />
            <div className="absolute top-20 right-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-accent-foreground/30 rounded-full mb-2" />
              ))}
            </div>
            <div className="absolute bottom-32 right-20 w-12 h-12 border-2 border-accent-foreground/20" />

            <div className="relative">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 relative">
                <img
                  src="https://scontent.fmex3-1.fna.fbcdn.net/v/t39.30808-1/421685041_6760146827445156_3504323613646736695_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFu8itor4hYwMnYohMdshLnAcwcHXLyyWMBzBwdcvLJY7R_QW-WmkzlEySg3YEI3GqG6kmQUvUQJZBYuvFp-ZzE&_nc_ohc=2naIa6FGN5oQ7kNvwGcMpkl&_nc_oc=AdkR_-Ds74aI1cI1CyA256YbxlMjqKK3G2476pbGEXRPMTPHW3eA-XMvmm73PIbU5rzrXnHqFLm0htYdUNujENYX&_nc_zt=24&_nc_ht=scontent.fmex3-1.fna&_nc_gid=FN_wgpiVU0g2318G885pPw&oh=00_AfcqCh0RJoIdl9BcSIOnhNK9UiG910kDOq9QlfoCjnm1TQ&oe=68E69307"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
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

          {proyectos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proyectos.map((proyecto) => (
                <ProjectCard key={proyecto.idProyecto} proyecto={proyecto} />
              ))}
            </div>
          )}
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
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all"
                >
                  Ver mi trabajo <ArrowRight className="w-5 h-5" />
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
