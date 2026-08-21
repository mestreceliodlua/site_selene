'use client'
import React from 'react'
import { FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full bg-selene-dark text-white border-t-gold py-6 shadow-2xl relative z-40">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm">

        {/* Contato Principal / WhatsApp */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/5511915909002"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-700/80 hover:bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold transition border border-green-400"
          >
            <FaWhatsapp className="text-lg" />
            <span>+55 (11) 91590-9002</span>
          </a>
        </div>

        {/* Endereço / Localização */}
        <div className="text-center text-gray-300 font-light">
          <p>Guarulhos - SP | Lisboa, Portugal</p>
          <p className="text-[11px] text-[#fcf6ba]/70 mt-0.5">contato@clinicaselene.pt</p>
        </div>

        {/* Redes Sociais */}
        <div className="flex items-center gap-4 text-lg text-[#fcf6ba]">
          <a href="#" aria-label="Instagram" className="hover:text-white transition">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-white transition">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>

      {/* Linha de copyright */}
      <div className="text-center text-[10px] text-gray-400 mt-4 border-t border-white/10 pt-2 px-6">
        © {new Date().getFullYear()} Clínica Selene — Estética, Massoterapia &amp; Terapias Holísticas. Todos os direitos reservados.
      </div>
    </footer>
  )
}
