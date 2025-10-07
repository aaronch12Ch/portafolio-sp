"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { loginAction } from "@/lib/server-actions"
import { saveAuth } from "@/lib/auth"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [correoUsuario, setCorreoUsuario] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

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
              <div className="space-y-2">
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  disabled={loading}
                />
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
