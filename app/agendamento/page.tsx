'use client'
import { useState, type FormEvent } from 'react'

const SERVICOS = [
  'Shiatsu',
  'Quiropraxia',
  'Reiki',
  'Liberação Miofascial',
  'Drenagem Linfática',
  'Mentoria / Psicanálise',
  'Hipnoterapia',
  'Terapia Cognitivo-Comportamental',
  'Avaliação Neurológica',
]

export default function AgendamentoPage() {
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: integrar com backend / Calendly / WhatsApp API
    setEnviado(true)
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl relative">

      {/* Orquídea decorativa — canto superior esquerdo */}
      <div className="pointer-events-none absolute -top-4 -left-8 opacity-25 select-none" aria-hidden="true">
        <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="0.8">
          <path d="M12 21c0 0-6-4-6-9a6 6 0 0 1 12 0c0 5-6 9-6 9z" />
          <path d="M12 12c-2-2-4-2-5-1M12 12c2-2 4-2 5-1M12 12c0-3 1-5 2-6M12 12c0-3-1-5-2-6" />
        </svg>
      </div>

      {enviado ? (
        <div className="card-selene text-center py-16">
          <div className="text-5xl mb-4">🌸</div>
          <h2 className="text-3xl font-serif text-[#6B4C9A] mb-2">Agendamento Recebido!</h2>
          <p className="text-[#4A4A4A] mb-6">Entraremos em contato em breve para confirmar sua sessão.</p>
          <a href="/" className="btn-gold">Voltar ao Início</a>
        </div>
      ) : (
        <div className="card-selene">
          <h1 className="text-4xl font-serif text-[#6B4C9A] text-center mb-2">Agende sua Sessão</h1>
          <p className="text-center text-[#6B6B6B] mb-8 text-sm">
            Preencha o formulário e entraremos em contato para confirmar.
          </p>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            {/* Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6B4C9A]">Nome completo *</label>
              <input
                type="text"
                required
                placeholder="Seu nome"
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors"
              />
            </div>

            {/* E-mail */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6B4C9A]">E-mail *</label>
              <input
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors"
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6B4C9A]">Telefone / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="(11) 91590-9002"
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors"
              />
            </div>

            {/* Serviço */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#6B4C9A]">Serviço desejado *</label>
              <select
                required
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors"
              >
                <option value="">Selecione...</option>
                {SERVICOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-semibold text-[#6B4C9A]">Data preferida</label>
              <input
                type="date"
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors"
              />
            </div>

            {/* Observações */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-semibold text-[#6B4C9A]">Observações</label>
              <textarea
                rows={3}
                placeholder="Conte um pouco sobre o que está sentindo ou o que busca..."
                className="w-full px-3 py-2 border-b-2 border-[#9B7ED9] focus:border-[#D4AF37] outline-none bg-transparent text-[#2D2D2D] transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 text-center pt-4">
              <button type="submit" className="btn-gold text-base px-12">
                Agendar Sessão
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contato rápido */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-[#6B4C9A]">
        <span>📍 Guarulhos-SP</span>
        <a href="tel:+5511915909002" className="hover:text-[#D4AF37] transition-colors">📞 (11) 91590-9002</a>
        <a href="mailto:contato@clinicaselene.com.br" className="hover:text-[#D4AF37] transition-colors">✉ contato@clinicaselene.com.br</a>
      </div>
    </div>
  )
}
