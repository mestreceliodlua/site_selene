import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobilidade e Cura | Clínica Selene',
  description: 'Terapias de mobilidade e cura corporal: Shiatsu, Quiropraxia, Reiki, Liberação Miofascial e Drenagem Linfática.',
}

const TERAPIAS = [
  {
    nome:    'Shiatsu',
    desc:    'Técnica de pressão nos meridianos do corpo para restaurar o equilíbrio energético e aliviar tensões.',
    beneficios: ['Alívio de dores musculares', 'Redução de stress', 'Melhora da circulação energética'],
  },
  {
    nome:    'Quiropraxia',
    desc:    'Ajustes vertebrais precisos para realinhar a coluna e liberar o sistema nervoso de interferências.',
    beneficios: ['Alívio de dores nas costas', 'Melhora da postura', 'Redução de cefaleias'],
  },
  {
    nome:    'Reiki',
    desc:    'Canalização de energia universal para promover cura física, emocional e espiritual profunda.',
    beneficios: ['Equilíbrio energético', 'Redução de ansiedade', 'Bem-estar geral'],
  },
  {
    nome:    'Liberação Miofascial',
    desc:    'Técnica manual que libera restrições no tecido conjuntivo para restaurar mobilidade e reduzir dor.',
    beneficios: ['Aumento de mobilidade', 'Redução de dor crônica', 'Melhora do desempenho físico'],
  },
  {
    nome:    'Drenagem Linfática',
    desc:    'Massagem suave que ativa o sistema linfático, reduz edemas e melhora a imunidade.',
    beneficios: ['Redução de inchaço', 'Detoxificação', 'Melhora da imunidade'],
  },
]

export default function MobilidadePage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-[#9B7ED9] text-sm font-semibold tracking-widest uppercase mb-3">Clínica Selene</p>
        <h1 className="text-4xl md:text-5xl font-serif text-[#6B4C9A] mb-4">Mobilidade e Cura</h1>
        <p className="text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
          Terapias corporais que liberam tensões, restauram o equilíbrio e devolvem a vitalidade ao seu corpo.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {TERAPIAS.map((t) => (
          <div key={t.nome} className="card-selene flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-xl bg-gradient-to-br from-[#E8E0F0] to-[#D8CEF0] flex items-center justify-center">
              <svg className="w-12 h-12 text-[#9B7ED9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 21c0 0-6-4-6-9a6 6 0 0 1 12 0c0 5-6 9-6 9z" />
                <path d="M12 12c-2-2-4-2-5-1M12 12c2-2 4-2 5-1M12 12c0-3 1-5 2-6M12 12c0-3-1-5-2-6" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-semibold text-[#6B4C9A] mb-2">{t.nome}</h2>
              <p className="text-[#4A4A4A] text-sm leading-relaxed mb-3">{t.desc}</p>
              <ul className="flex flex-wrap gap-2">
                {t.beneficios.map((b) => (
                  <li key={b} className="text-xs bg-[#E8E0F0] text-[#6B4C9A] px-3 py-1 rounded-full font-medium">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="/agendamento" className="btn-gold text-base">Agendar uma Sessão</a>
      </div>
    </div>
  )
}
