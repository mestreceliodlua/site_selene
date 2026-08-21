import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clínica Selene | Terapêutica e Estética — Guarulhos SP',
  description: 'Clínica Selene em Guarulhos — Shiatsu, Quiropraxia, Reiki, Massoterapia, Drenagem Linfática, Hipnoterapia e Avaliação Neurológica. Agende sua sessão no Jardim Maia.',
  keywords: 'clínica holística, shiatsu, quiropraxia, reiki, massoterapia, drenagem linfática, hipnoterapia, avaliação neurológica, Guarulhos, Jardim Maia, terapia integrativa',
  authors: [{ name: "Mestre Célio D'Lua — Roscelio P. Silva" }],
  metadataBase: new URL('https://clinicaselene.com.br'),
  openGraph: {
    title: 'Clínica Selene | Equilíbrio e Renovação',
    description: 'Terapias integrativas para corpo e mente. Shiatsu, Quiropraxia, Reiki e muito mais em Guarulhos — SP.',
    url: 'https://clinicaselene.com.br',
    siteName: 'Clínica Selene',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Clínica Selene' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clínica Selene | Terapêutica e Estética',
    images: ['/images/og-image.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
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
