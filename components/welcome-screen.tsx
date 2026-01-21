'use client'

import { useState, useEffect } from 'react'

export function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Ocultar después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-accent animate-gradient-shift overflow-hidden transition-all duration-1000 ${
      !isVisible ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'
    }`}>
      {/* Elementos decorativos de fondo */}
      <div className={`absolute top-20 left-20 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl animate-blob transition-all duration-700 ${
        !isVisible ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`} />
      <div className={`absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000 transition-all duration-700 delay-100 ${
        !isVisible ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-blob animation-delay-4000 transition-all duration-700 delay-200 ${
        !isVisible ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`} />

      {/* Partículas flotantes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 bg-primary-foreground/30 rounded-full animate-float-particle transition-all duration-500 ${
            !isVisible ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            transitionDelay: `${i * 20}ms`
          }}
        />
      ))}

      {/* Contenido principal */}
      <div className={`relative z-10 text-center px-6 transition-all duration-700 ${
        !isVisible ? 'opacity-0 -translate-y-20 scale-95' : 'opacity-100 translate-y-0 scale-100'
      }`}>
        {/* Texto con animación de aparición escalonada */}
        <div className="overflow-hidden">
          <h1 style={{ fontFamily: 'var(--font-poppins)' }} className="text-6xl sm:text-8xl lg:text-9xl font-bold text-primary-foreground mb-4 animate-slide-up">
            Bienvenido
          </h1>
        </div>
        
        <div className="overflow-hidden animation-delay-300">
          <p className="text-xl sm:text-2xl lg:text-3xl text-primary-foreground/80 animate-slide-up animation-delay-500">
            A mi portafolio Aarón Córdova
          </p>
        </div>

        {/* Línea decorativa animada */}
        <div className="mt-8 mx-auto w-64 h-1 bg-primary-foreground/20 rounded-full overflow-hidden animation-delay-1000 animate-fade-in">
          <div className="h-full bg-primary-foreground rounded-full animate-shimmer-line" />
        </div>

        {/* Puntos de carga */}
        <div className="flex justify-center gap-2 mt-8 animation-delay-1500 animate-fade-in">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-bounce-dots"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}