"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoDisplay } from "@/components/VideoDisplay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import type { Proyecto, CreateProyectoDto } from "@/lib/api"

interface AdminProjectFormProps {
  proyecto?: Proyecto
  onSubmit: (data: CreateProyectoDto & { videoFile?: File | null }) => Promise<void>
  onCancel?: () => void
}

export function AdminProjectForm({ proyecto, onSubmit, onCancel }: AdminProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<CreateProyectoDto>({
    nombreProyecto: proyecto?.nombreProyecto || "",
    descripcionProyecto: proyecto?.descripcionProyecto || "",
    urlImagen: proyecto?.urlImagen || "",
    url: proyecto?.url || "",
    disponibleProyecto: proyecto?.disponibleProyecto !== undefined ? proyecto.disponibleProyecto : true,
  })
  const [imageUrlError, setImageUrlError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.urlImagen.startsWith("data:")) {
      setImageUrlError("Por favor ingresa una URL HTTP/HTTPS válida, no datos base64")
      return
    }

    setImageUrlError("")
    setLoading(true)
    try {
      // Enviar datos del proyecto + archivo de video (si existe)
      await onSubmit({
        ...formData,
        videoFile: videoFile,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlChange = (value: string) => {
    setFormData({ ...formData, urlImagen: value })
    if (value.startsWith("data:")) {
      setImageUrlError("No se permiten datos base64. Usa una URL HTTP/HTTPS")
    } else {
      setImageUrlError("")
    }
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setVideoFile(file)
    console.log("[Form] Archivo de video seleccionado:", file?.name)
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    // Limpiar el input file
    const input = document.getElementById("videoFile") as HTMLInputElement
    if (input) input.value = ""
    console.log("[Form] Archivo de video removido")
  }

  const handleDisponibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, disponibleProyecto: e.target.checked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{proyecto ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</CardTitle>
        <CardDescription>
          {proyecto ? "Modifica los datos del proyecto" : "Completa los datos del nuevo proyecto"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombreProyecto">Título</Label>
            <Input
              id="nombreProyecto"
              value={formData.nombreProyecto}
              onChange={(e) => setFormData({ ...formData, nombreProyecto: e.target.value })}
              required
              disabled={loading}
              placeholder="Nombre del proyecto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcionProyecto">Descripción</Label>
            <Textarea
              id="descripcionProyecto"
              value={formData.descripcionProyecto}
              onChange={(e) => setFormData({ ...formData, descripcionProyecto: e.target.value })}
              required
              disabled={loading}
              placeholder="Describe el proyecto"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urlImagen">URL de Imagen</Label>
            <Input
              id="urlImagen"
              type="url"
              value={formData.urlImagen}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              required
              disabled={loading}
              placeholder="https://ejemplo.com/imagen.jpg"
              className={imageUrlError ? "border-red-500" : ""}
            />
            {imageUrlError && <p className="text-sm text-red-500">{imageUrlError}</p>}
            <p className="text-sm text-muted-foreground">
              Ingresa la URL completa de una imagen (debe comenzar con http:// o https://)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Enlace del Proyecto</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              disabled={loading}
              placeholder="https://proyecto.com"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Input
              id="disponibleProyecto"
              type="checkbox"
              checked={formData.disponibleProyecto}
              onChange={handleDisponibleChange}
              disabled={loading}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="disponibleProyecto">Proyecto Disponible</Label>
          </div>

          {/* Video actual (si existe en modo edición) */}
          {proyecto?.s3VideoKey && (
            <div className="space-y-2">
              <Label>Video actual</Label>
              <VideoDisplay s3VideoKey={proyecto.s3VideoKey} />
              <p className="text-sm text-muted-foreground">
                Si subes un nuevo video, este reemplazará al actual automáticamente.
              </p>
            </div>
          )}

          {/* Subir nuevo video */}
          <div className="space-y-2">
            <Label htmlFor="videoFile">
              {proyecto ? "Cambiar video (opcional)" : "Subir video (opcional)"}
            </Label>

            {!videoFile ? (
              <div className="flex items-center gap-2">
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  disabled={loading}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium">{videoFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveVideo}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Formatos soportados: MP4, WebM, AVI. Máximo recomendado: 100MB
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : proyecto ? (
                "Actualizar Proyecto"
              ) : (
                "Crear Proyecto"
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}