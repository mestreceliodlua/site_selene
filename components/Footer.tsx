'use client'
import React from 'react'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A0D2E] text-[#e3dbe8] border-t border-[#d4af37]/30 py-10 px-4 relative z-40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">

        {/* Logo + tagline */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#d4af37] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-selene-seal.png"
                alt="Clínica Selene"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }}
              />
              {/* SVG fallback */}
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
              <h3 className="font-serif text-xl font-bold text-[#fcf6ba]">Clínica Selene</h3>
              <p className="text-xs text-[#e3dbe8]/70">Terapêutica e Estética</p>
            </div>
          </div>
          <p className="text-xs text-[#e3dbe8]/70 max-w-xs leading-relaxed">
            Promovendo equilíbrio, saúde integrativa e bem-estar físico e mental.
          </p>
        </div>

        {/* Contato e localização */}
        <div className="space-y-2 text-sm">
          <h4 className="font-serif text-[#d4af37] font-semibold text-base mb-3">Atendimento</h4>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <span aria-hidden="true">📍</span>
            <span><strong className="text-white">Local:</strong> Jardim Maia — Guarulhos — São Paulo — Brasil</span>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <FaWhatsapp className="text-green-400 flex-shrink-0" aria-hidden="true" />
            <a href="https://wa.me/5511915909002" target="_blank" rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition font-semibold">
              (11) 91590-9002
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <span aria-hidden="true">✉️</span>
            <a href="mailto:contato@clinicaselene.pt"
              className="text-[#fcf6ba]/80 hover:text-[#fcf6ba] transition text-xs">
              contato@clinicaselene.pt
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <span aria-hidden="true">🌐</span>
            <a href="https://seleneterapeutica.blogspot.com" target="_blank" rel="noopener noreferrer"
              className="text-[#fcf6ba]/70 hover:text-[#fcf6ba] transition text-xs">
              seleneterapeutica.blogspot.com
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <span aria-hidden="true">🕐</span>
            <span className="text-xs text-[#e3dbe8]/70">Seg – Sex: 9h–19h &nbsp;|&nbsp; Sáb: 9h–13h</span>
          </p>
        </div>

        {/* Redes sociais */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <span className="text-sm text-[#fcf6ba] font-medium">Siga-nos no Instagram</span>
          <a
            href="https://instagram.com/ClinicaSelene"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3d2352] border border-[#d4af37]/40 text-[#fcf6ba] hover:bg-[#d4af37] hover:text-[#1A0D2E] transition-all text-sm font-semibold"
          >
            <FaInstagram aria-hidden="true" />
            @ClinicaSelene
          </a>
          <a
            href="https://wa.me/5511915909002?text=Olá! Gostaria de agendar uma sessão na Clínica Selene."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-800/60 border border-green-500/40 text-green-300 hover:bg-green-700 hover:text-white transition-all text-sm font-semibold"
          >
            <FaWhatsapp aria-hidden="true" />
            Agendar pelo WhatsApp
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-4 border-t border-white/10 text-center text-[10px] text-[#e3dbe8]/50">
        © {new Date().getFullYear()} Clínica Selene — Estética, Massoterapia &amp; Terapias Holísticas. Todos os direitos reservados.
      </div>
    </footer>
  )
}
