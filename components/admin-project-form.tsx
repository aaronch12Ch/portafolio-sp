"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VideoDisplay } from "@/components/VideoDisplay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { Proyecto } from "@/lib/api"
// Necesitas este hook para manejar el estado de envío del formulario nativo
import { useFormStatus } from "react-dom" 

// 🚨 INTERFACE MODIFICADA: Ahora espera el token y la Server Action
interface AdminProjectFormProps {
    proyecto?: Proyecto
    onCancel?: () => void
    token: string // El token se pasa como prop
    // La acción puede ser createProyectoNativeAction o updateProyectoNativeAction
    action: (formData: FormData) => Promise<any> 
}

// 💡 Nuevo componente para manejar el estado de carga del formulario nativo
function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending} className="flex-1">
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                </>
            ) : isEditing ? (
                "Actualizar Proyecto"
            ) : (
                "Crear Proyecto"
            )}
        </Button>
    )
}

export function AdminProjectForm({ proyecto, token, action, onCancel }: AdminProjectFormProps) {
    // Mantenemos el estado para el control visual de inputs (como la URL de imagen)
    // PERO NO usaremos más handleSubmit
    const [formData, setFormData] = useState({
        nombreProyecto: proyecto?.nombreProyecto || "",
        descripcionProyecto: proyecto?.descripcionProyecto || "",
        urlImagen: proyecto?.urlImagen || "",
        url: proyecto?.url || "",
        disponibleProyecto: proyecto?.disponibleProyecto ?? true, 
        s3VideoKey: proyecto?.s3VideoKey || null, 
        videoFile: null, // Mantenemos solo para la previsualización local
    })
    const [imageUrlError, setImageUrlError] = useState("")

    const handleImageUrlChange = (value: string) => {
        setFormData({ ...formData, urlImagen: value })
        if (value.startsWith("data:")) {
            setImageUrlError("No se permiten datos base64. Usa una URL HTTP/HTTPS")
        } else {
            setImageUrlError("")
        }
    }
    
    // Este handler solo actualiza el estado local (no se usa para el envío)
    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, videoFile: e.target.files ? e.target.files[0] : null })
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
                {/* 🚨 CAMBIO CRÍTICO: Usar 'action' nativo, sin onSubmit */}
                <form action={action} className="space-y-4">
                    
                    {/* 💡 CAMPOS OCULTOS PARA LA SERVER ACTION */}
                    <input type="hidden" name="token" value={token} />
                    {proyecto && (
                        // Solo si estamos editando, incluimos el ID
                        <input type="hidden" name="idProyecto" value={proyecto.idProyecto} />
                    )}

                    {/* 🚨 CLAVE: El nombre debe ser 'proyecto' o 'proyectoData' para que la Server Action lo reconozca */}
                    {/* En lugar de inputs individuales, vamos a enviar el JSON completo como un campo oculto 
                       para simular el comportamiento anterior de 'proyectoData'. */}
                    <input 
                        type="hidden" 
                        name="proyecto" 
                        value={JSON.stringify({
                            nombreProyecto: formData.nombreProyecto,
                            descripcionProyecto: formData.descripcionProyecto,
                            urlImagen: formData.urlImagen,
                            url: formData.url,
                            disponibleProyecto: formData.disponibleProyecto,
                            s3VideoKey: proyecto?.s3VideoKey || null, // Mantenemos la clave S3 original si no hay nuevo video
                        })}
                    />


                    {/* 1. INPUTS VISIBLES (Sin name, ya que los recogemos en el campo oculto de arriba) */}

                    <div className="space-y-2">
                        <Label htmlFor="nombreProyecto">Título</Label>
                        <Input
                            id="nombreProyecto"
                            // ❌ NO NECESITA name="nombreProyecto" si se recoge en el campo oculto 'proyecto'
                            value={formData.nombreProyecto}
                            onChange={(e) => setFormData({ ...formData, nombreProyecto: e.target.value })}
                            required
                            placeholder="Nombre del proyecto"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="descripcionProyecto">Descripción</Label>
                        <Textarea
                            id="descripcionProyecto"
                            // ❌ NO NECESITA name="descripcionProyecto"
                            value={formData.descripcionProyecto}
                            onChange={(e) => setFormData({ ...formData, descripcionProyecto: e.target.value })}
                            required
                            placeholder="Describe el proyecto"
                            rows={4}
                        />
                    </div>

                    {/* ... (Otros inputs como urlImagen y url son similares) ... */}
                    
                    {/* 2. INPUT DE ARCHIVO (ESTE SÍ DEBE TENER NAME) */}
                    <div className="space-y-2">
                        {/* ... (VideoDisplay y Label) ... */}
                        <Label htmlFor="s3VideoKey">Video actual (Opcional)</Label>
                        <VideoDisplay s3VideoKey={formData.s3VideoKey} />
                        <Label htmlFor="video">Subir Video (Opcional)</Label>
                        <Input
                            id="video"
                            type="file" 
                            accept="video/*"
                            name="video" // 🚨 CLAVE: ESTE NAME es obligatorio para que FormData lo recoja
                            onChange={handleVideoFileChange} 
                        />
                        {/* ... (Texto de ayuda) ... */}
                    </div>

                    {/* ... (El resto del formulario se mantiene similar) ... */}

                    <div className="flex gap-3 pt-4">
                        {/* 🚨 Usar el componente SubmitButton con useFormStatus */}
                        <SubmitButton isEditing={!!proyecto} /> 
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}