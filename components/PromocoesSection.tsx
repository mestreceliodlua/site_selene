import Link from 'next/link'

const COMBOS = [
  { nome: 'Plano Equilíbrio',  sessoes: 2, total: 160, cada: 80  },
  { nome: 'Plano Vitalidade',  sessoes: 4, total: 300, cada: 75  },
  { nome: 'Plano Renovação',   sessoes: 8, total: 560, cada: 70  },
]

export function PromocoesSection() {
  return (
    <section
      id="promocoes"
      aria-labelledby="promo-heading"
      className="py-16 px-4"
      style={{ background: 'linear-gradient(180deg, #1A0D2E 0%, #2a153b 50%, #1A0D2E 100%)' }}
    >
      <div className="max-w-3xl mx-auto rounded-3xl border border-[#d4af37]/40 p-6 md:p-10 shadow-2xl relative overflow-hidden"
        style={{ background: 'rgba(42,21,59,0.85)', backdropFilter: 'blur(16px)' }}>

        {/* Subtle gold glow top-right */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
          aria-hidden="true" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">
            ✨ Promoção Especial para Novos Clientes ✨
          </p>
          <h2 id="promo-heading" className="text-2xl md:text-4xl font-serif text-[#fcf6ba] mb-3">
            Tabela de Terapias e Combos
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full"
            style={{ background: 'linear-gradient(90deg, #bf953f, #fcf6ba, #aa771c)' }} />
        </div>

        {/* Sessão Única */}
        <div className="relative z-10 rounded-2xl border border-[#d4af37]/40 p-6 text-center mb-6"
          style={{ background: 'rgba(26,12,38,0.70)' }}>
          <h3 className="text-base md:text-lg font-serif text-[#fcf6ba] font-bold uppercase mb-1">
            Sessão Única &mdash; 60 min
          </h3>
          <p className="text-3xl md:text-4xl font-extrabold text-[#d4af37] my-2">
            R$&nbsp;100,00
          </p>
          <p className="text-xs md:text-sm text-[#e3dbe8]/80 leading-relaxed">
            Massoterapia &bull; Drenagem Linfática &bull; Shiatsu com Quiropraxia &bull; Reiki
          </p>
        </div>

        {/* Combos */}
        <div className="relative z-10 mb-6">
          <h3 className="text-center font-serif text-[#fcf6ba] text-base font-semibold mb-1">
            Combos Promocionais
          </h3>
          <p className="text-center text-xs text-[#e3dbe8]/60 mb-4">Para pacotes de 2 ou mais sessões</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMBOS.map(({ nome, sessoes, total, cada }) => (
              <div key={nome}
                className="rounded-xl border border-[#d4af37]/25 p-4 text-center transition-all hover:border-[#d4af37]/60 hover:-translate-y-0.5"
                style={{ background: 'rgba(26,12,38,0.50)' }}>
                <p className="font-bold text-[#fcf6ba] text-sm">{nome}</p>
                <p className="text-xs text-[#e3dbe8]/60 mb-2">({sessoes} Sessões)</p>
                <p className="text-xl font-extrabold text-[#d4af37]">
                  R$&nbsp;{total.toLocaleString('pt-BR')},00
                </p>
                <p className="text-[11px] text-[#e3dbe8]/55 mt-1">
                  Apenas R$&nbsp;{cada},00 cada
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* T.I.M. */}
        <div className="relative z-10 rounded-2xl border border-[#d4af37]/40 p-5 text-center mb-8"
          style={{ background: 'rgba(26,12,38,0.70)' }}>
          <h3 className="text-base font-serif text-[#fcf6ba] font-bold mb-0.5">
            Terapia Integrativa do Movimento <abbr title="Terapia Integrativa do Movimento">(T.I.M.)</abbr>
          </h3>
          <p className="text-xs text-[#e3dbe8]/60 mb-2">Sessão de 60 min</p>
          <p className="text-3xl font-extrabold text-[#d4af37]">R$&nbsp;70,00</p>
        </div>

        {/* CTA */}
        <div className="relative z-10 text-center mb-6">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-[#2a153b] shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm"
            style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' }}
          >
            ✨ Agendar Agora
          </Link>
        </div>

        {/* Footer bar */}
        <div className="relative z-10 pt-4 border-t border-[#d4af37]/20 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#e3dbe8]/70 text-center">
          <span>📍 <strong className="text-white">Local:</strong> Jardim Maia — Guarulhos — SP — Brasil</span>
          <span>✨ <strong className="text-white">Siga-nos:</strong> @ClinicaSelene</span>
        </div>
      </div>
    </section>
  )
}
