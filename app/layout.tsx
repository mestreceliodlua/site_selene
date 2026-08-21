import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clínica Selene | Equilíbrio e Renovação',
  description: 'Jornada de equilíbrio corporal e mental através de terapias integrativas.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-[#2D2D2D] font-sans">
        {children}
      </body>
    </html>
  )
}
