'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface HeaderProps {
  tituloPagina?: string
  subtitulo?: string
  variante?: 'escuro' | 'transparente'
}

const NAV_ITEMS = [
  { href: '/',             label: 'Início' },
  { href: '/corpo-mente',  label: 'Corpo & Mente' },
  { href: '/neuroeval',    label: 'Avaliação Neurológica' },
  { href: '/contato',      label: 'Contato & Agendamento' },
]

export default function Header({
  tituloPagina,
  subtitulo,
  variante = 'escuro',
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isDark = variante === 'escuro'

  return (
    <header
      className={`w-full z-50 transition-all ${
        isDark
          ? 'bg-selene-dark text-white border-b-2 border-[#d4af37] shadow-lg'
          : 'bg-white/30 backdrop-blur-md border-b border-[#d4af37]/40 text-[#2a153b]'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-md shadow-[#3d2352]/30 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-selene-seal.png"
                alt="Logo Clínica Selene"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }}
              />
              {/* SVG fallback — hidden when image loads */}
              <span className="absolute inset-0 bg-[#3d2352] items-center justify-center" style={{ display: 'flex' }} aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#D4AF37" strokeWidth="3" />
                  <path d="M 62 28 A 28 28 0 1 0 62 72 A 20 20 0 1 1 62 28 Z" fill="#D4AF37" opacity="0.9" />
                  <circle cx="30" cy="32" r="2.5" fill="#fcf6ba" />
                  <circle cx="72" cy="35" r="2"   fill="#fcf6ba" />
                  <circle cx="26" cy="62" r="1.8" fill="#fcf6ba" />
                </svg>
              </span>
            </div>
            <div>
              <span className={`font-serif text-xl tracking-wide block ${isDark ? 'text-white group-hover:text-[#fcf6ba]' : 'text-[#2a153b]'} transition`}>
                Clínica Selene
              </span>
              <span className={`text-xs font-light tracking-wider uppercase block ${isDark ? 'text-[#fcf6ba]/70' : 'text-[#6B4C9A]'}`}>
                {tituloPagina ?? 'Estética & Terapias Holísticas'}
              </span>
            </div>
          </Link>

          {/* Subtitulo central */}
          {subtitulo && (
            <p className="hidden xl:block font-serif text-sm italic text-[#fcf6ba]/90 text-center max-w-xs">
              &ldquo;{subtitulo}&rdquo;
            </p>
          )}

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative pb-0.5 border-b-2 border-transparent transition-colors group ${
                  isDark
                    ? 'text-white hover:text-[#fcf6ba] hover:border-[#d4af37]'
                    : 'text-[#2a153b] hover:text-[#6B4C9A] hover:border-[#d4af37]'
                }`}
              >
                {label}
              </Link>
            ))}
            {/* WhatsApp pill */}
            <a
              href="https://wa.me/5511915909002"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 px-4 py-1.5 rounded-full text-sm font-bold text-[#2a153b] shadow-md hover:shadow-lg hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 100%)' }}
            >
              💬 WhatsApp
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-[#d4af37]/40"
          >
            <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="lg:hidden mt-3 pb-2 border-t border-[#d4af37]/30 pt-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isDark
                    ? 'text-white hover:text-[#fcf6ba] hover:bg-white/10'
                    : 'text-[#2a153b] hover:text-[#6B4C9A] hover:bg-white/20'
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://wa.me/5511915909002"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mx-3 mt-2 py-2.5 rounded-full text-sm font-bold text-[#2a153b] text-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 100%)' }}
            >
              💬 WhatsApp
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
