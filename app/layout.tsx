import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

import { Inter } from 'next/font/google'

const sfPro = Inter({ 
  subsets: ['latin'],
  variable: '--font-sf-pro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Portfolio - Proyectos",
  description: "Portfolio profesional de proyectos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={sfPro.variable}>
      <body className={`${sfPro.className} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}