const TERAPIAS_MOBILIDADE = [
  { nome: 'Shiatsu',               desc: 'Equilíbrio energético por pressão nos meridianos.' },
  { nome: 'Quiropraxia',           desc: 'Alinhamento da coluna e sistema nervoso.' },
  { nome: 'Reiki',                 desc: 'Canalização de energia para cura integral.' },
  { nome: 'Lib. Miofascial',       desc: 'Libertação de tensões profundas no tecido conjuntivo.' },
  { nome: 'Drenagem Linfática',    desc: 'Ativação do sistema linfático e redução de edemas.' },
]

const TERAPIAS_MENTE = [
  { nome: 'Mentoria / Psicanálise', desc: 'Autoconhecimento e desenvolvimento pessoal profundo.' },
  { nome: 'Hipnoterapia',           desc: 'Reprogramação de padrões no estado hipnótico.' },
  { nome: 'TCC',                    desc: 'Terapia Cognitivo-Comportamental baseada em evidências.' },
]

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#9B7ED9]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-[#9B7ED9] text-sm font-semibold tracking-widest uppercase mb-4">
            Clínica Selene Terapias — Guarulhos-SP
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-[#6B4C9A] mb-6 leading-tight">
            Bem-vindo à sua jornada de<br />
            <span className="text-[#D4AF37]">equilíbrio e renovação</span>
          </h1>
          <p className="text-lg text-[#4A4A4A] mb-10 max-w-2xl mx-auto leading-relaxed">
            Terapias integrativas para corpo e mente — cuidando de quem você é,
            de dentro para fora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/neuroeval"   className="btn-gold text-base">Iniciar Avaliação Neurológica</a>
            <a
              href="/agendamento"
              className="inline-block border-2 border-[#6B4C9A] text-[#6B4C9A] px-8 py-3 rounded-lg font-semibold hover:bg-[#6B4C9A] hover:text-white transition-colors"
            >
              Agendar Sessão
            </a>
          </div>
        </div>
      </section>

      {/* ── Terapias ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16">

          {/* Mobilidade e Cura */}
          <div>
            <h2 className="text-3xl font-serif text-[#6B4C9A] text-center mb-8 border-b-2 border-[#D4AF37]/40 pb-3">
              Mobilidade e Cura
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {TERAPIAS_MOBILIDADE.map((t) => (
                <a href="/mobilidade" key={t.nome} className="card-selene group block">
                  <div className="h-24 mb-3 rounded-lg bg-gradient-to-br from-[#E8E0F0] to-[#D8CEF0] flex items-center justify-center">
                    <OrchidIcon className="w-10 h-10 text-[#9B7ED9] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-serif font-semibold text-[#6B4C9A] text-sm leading-snug">{t.nome}</h4>
                  <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">{t.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Mente */}
          <div>
            <h2 className="text-3xl font-serif text-[#6B4C9A] text-center mb-8 border-b-2 border-[#D4AF37]/40 pb-3">
              Cuidados com a Mente
            </h2>
            <div className="flex flex-col gap-4">
              {TERAPIAS_MENTE.map((t) => (
                <a href="/mente" key={t.nome} className="card-selene group flex gap-4 items-start">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-[#E8E0F0] to-[#D8CEF0] flex items-center justify-center">
                    <OrchidIcon className="w-8 h-8 text-[#9B7ED9] opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-[#6B4C9A]">{t.nome}</h4>
                    <p className="text-sm text-[#6B6B6B] mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section className="bg-[#6B4C9A] text-white py-16 mt-8">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">Pronta para dar o primeiro passo?</h2>
          <p className="text-purple-200 mb-8 max-w-xl mx-auto">
            Faça a avaliação neurológica gratuita e descubra quais terapias se encaixam melhor para você.
          </p>
          <a href="/neuroeval" className="btn-gold text-base">Iniciar Avaliação Gratuita</a>
        </div>
      </section>
    </div>
  )
}

/* Ícone SVG de orquídea estilizada */
function OrchidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 21c0 0-6-4-6-9a6 6 0 0 1 12 0c0 5-6 9-6 9z" />
      <path d="M12 12c-2-2-4-2-5-1M12 12c2-2 4-2 5-1M12 12c0-3 1-5 2-6M12 12c0-3-1-5-2-6" />
    </svg>
  )
}
