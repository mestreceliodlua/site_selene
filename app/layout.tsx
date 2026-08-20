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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gradient-to-b from-[#E8E0F0] to-[#F5F0FA] min-h-screen text-[#2D2D2D] font-sans">
        <Header />
        <main className="pt-28">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="fixed top-0 w-full bg-[#6B4C9A] shadow-lg z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="2" />
              <path d="M 50 15 A 35 35 0 0 1 50 85" fill="none" stroke="#D4AF37" strokeWidth="2" />
              <ellipse cx="50" cy="50" rx="18" ry="28" fill="#D4AF37" opacity="0.35" />
            </svg>
            <span className="text-3xl font-serif text-[#D4AF37] tracking-wide">Clínica Selene</span>
          </div>

          {/* Navegação */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-white">
            {[
              { href: '/',              label: 'Início' },
              { href: '/mobilidade',   label: 'Mobilidade e Cura' },
              { href: '/mente',        label: 'Mente' },
              { href: '/agendamento',  label: 'Agendamento' },
              { href: '/neuroeval',    label: 'Avaliação Neurológica' },
              { href: '/contato',      label: 'Contato' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="border-b-2 border-transparent hover:text-[#D4AF37] hover:border-[#D4AF37] pb-0.5 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#6B4C9A] text-white mt-20 py-8 border-t-2 border-[#D4AF37]">
      <div className="container mx-auto px-6 text-center space-y-1">
        <p className="text-sm">
          Guarulhos-SP — (11) 91590-9002 — contato@clinicaselene.com.br
        </p>
        <p className="text-sm text-[#D4AF37]">
          © 2026 Clínica Selene Terapias. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
