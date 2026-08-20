import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clínica Selene Terapias | Avaliação Neurológica Integrativa',
  description: 'Jornada de autoconhecimento e cura através de terapias integrativas e mapeamento neurológico.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0a0e27] text-gray-100 font-sans min-h-screen">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="fixed top-0 w-full bg-[#0a0e27]/90 backdrop-blur-sm border-b border-[#D4AF37]/20 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-serif text-[#D4AF37]">
          ✦ Selene Terapias
        </div>
        <div className="hidden md:flex gap-8 text-sm">
          <a href="/" className="hover:text-[#D4AF37] transition">Início</a>
          <a href="/neuroeval" className="hover:text-[#D4AF37] transition">Avaliação</a>
          <a href="/contato" className="hover:text-[#D4AF37] transition">Contato</a>
        </div>
        <a
          href="/neuroeval"
          className="bg-[#D4AF37] text-[#0a0e27] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition"
        >
          Agendar
        </a>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#050814] border-t border-[#D4AF37]/20 mt-20 py-8">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
        © 2026 Clínica Selene Terapias. Todos os direitos reservados.
      </div>
    </footer>
  )
}
