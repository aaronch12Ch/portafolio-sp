"use client"

import type React from "react" // 'type' es correcto, pero se elimina el segundo import de useState

import { useState } from "react" // Único import de useState
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { loginAction } from "@/lib/server-actions"
import { saveAuth } from "@/lib/auth"
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react" // Íconos de ojo
import Link from "next/link"

export default function LoginPage() {
  const [correoUsuario, setCorreoUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [loading, setLoading] = useState(false)
  // Nuevo estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false) 
  
  const router = useRouter()
  const { toast } = useToast()

  // Función para cambiar el estado (moverla dentro de LoginPage)
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev) // Uso de función para actualizar estado
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!correoUsuario.trim() || !contrasena.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await loginAction(correoUsuario, contrasena)

      if (!response || !response.token) {
        throw new Error("No se recibió token de autenticación")
      }

      saveAuth(response.token)

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      })

      // Usar window.location.href para asegurar la redirección
      window.location.href = "/admin"
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"

      toast({
        title: "Error de autenticación",
        description:
          errorMessage.includes("Credenciales") || errorMessage.includes("inválidas")
            ? "Usuario o contraseña incorrectos. Por favor verifica que estés usando el correo y contraseña correctos (respetando mayúsculas y minúsculas)."
            : "No se pudo conectar con el servidor. Intenta más tarde.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al panel de administración</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="correoUsuario">Correo Electrónico</Label>
                <Input
                  id="correoUsuario"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={correoUsuario}
                  onChange={(e) => setCorreoUsuario(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Contraseña con el Toggle de Visibilidad */}
              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                
                <div className="relative"> 
                  <Input
                    id="contrasena"
                    // **CLAVE:** Cambia el tipo basado en el estado
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Ingresa tu contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                    disabled={loading}
                    // **CLAVE:** Añade padding a la derecha para el icono
                    className="pr-10" 
                  />
                  
                  {/* Botón/Icono para alternar la visibilidad */}
                  <button
                    type="button" 
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {/* Muestra el icono de ojo abierto o cerrado */}
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}