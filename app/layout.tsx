import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clínica Selene Terapias',
  description: 'Terapias integrativas e avaliação neurológica personalizada.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}