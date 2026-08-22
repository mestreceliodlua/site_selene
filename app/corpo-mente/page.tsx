import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Corpo & Mente | Clínica Selene',
  description: 'Terapias integrativas para corpo e mente: Shiatsu, Quiropraxia, Reiki, Liberação Miofascial, Drenagem Linfática, Hipnoterapia, Psicanálise e TCC em Guarulhos-SP.',
}

const MOBILIDADE = [
  {
    nome: 'Shiatsu',
    desc: 'Técnica de pressão nos meridianos do corpo para restaurar o equilíbrio energético e aliviar tensões.',
    beneficios: ['Alívio de dores musculares', 'Redução de stress', 'Melhora da circulação energética'],
  },
  {
    nome: 'Quiropraxia',
    desc: 'Ajustes vertebrais precisos para realinhar a coluna e liberar o sistema nervoso de interferências.',
    beneficios: ['Alívio de dores nas costas', 'Melhora da postura', 'Redução de cefaleias'],
  },
  {
    nome: 'Reiki',
    desc: 'Canalização de energia universal para promover cura física, emocional e espiritual profunda.',
    beneficios: ['Equilíbrio energético', 'Redução de ansiedade', 'Bem-estar geral'],
  },
  {
    nome: 'Liberação Miofascial',
    desc: 'Técnica manual que libera restrições no tecido conjuntivo para restaurar mobilidade e reduzir dor.',
    beneficios: ['Aumento de mobilidade', 'Redução de dor crônica', 'Melhora do desempenho físico'],
  },
  {
    nome: 'Drenagem Linfática',
    desc: 'Massagem suave que ativa o sistema linfático, reduz edemas e melhora a imunidade.',
    beneficios: ['Redução de inchaço', 'Detoxificação', 'Melhora da imunidade'],
  },
  {
    nome: 'Massoterapia',
    desc: 'Massagem terapêutica profunda que alivia tensões musculares, melhora a circulação e promove relaxamento.',
    beneficios: ['Relaxamento profundo', 'Melhora da circulação', 'Redução de tensão muscular'],
  },
]

const MENTE = [
  {
    nome: 'Mentoria / Psicanálise',
    desc: 'Espaço seguro para autoconhecimento profundo, compreensão dos padrões inconscientes e desenvolvimento pessoal guiado.',
    beneficios: ['Autoconhecimento', 'Resolução de conflitos internos', 'Crescimento pessoal'],
  },
  {
    nome: 'Hipnoterapia',
    desc: 'Uso do estado hipnótico para acessar o subconsciente, reprogramar crenças limitantes e resolver questões emocionais.',
    beneficios: ['Controle de ansiedade', 'Mudança de hábitos', 'Superação de fobias'],
  },
  {
    nome: 'Terapia Cognitivo-Comportamental (TCC)',
    desc: 'Abordagem baseada em evidências que transforma padrões de pensamento e comportamento negativos em respostas saudáveis.',
    beneficios: ['Redução de ansiedade e depressão', 'Técnicas práticas', 'Resultados mensuráveis'],
  },
  {
    nome: 'Terapia Integrativa do Movimento (T.I.M.)',
    desc: 'Une práticas de movimento consciente, arte marcial e terapia corporal para promover equilíbrio e autoconhecimento.',
    beneficios: ['Integração corpo-mente', 'Foco e disciplina', 'Equilíbrio emocional'],
  },
]

/* ── Inline SVG icons ──────────────────────────────────────── */
function BodyIcon() {
  return (
    <svg className="w-9 h-9 text-[#6B4C9A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v5l-2 3h4l-2-3V7" />
      <path d="M9 11l-3 4M15 11l3 4M9 22l3-5 3 5" />
    </svg>
  )
}
function MindIcon() {
  return (
    <svg className="w-9 h-9 text-[#6B4C9A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3 12h3M18 12h3" />
    </svg>
  )
}

export default function CorpoMentePage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header tituloPagina="Corpo & Mente" variante="escuro" />

      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">

        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-[#3d2352] text-sm font-semibold tracking-widest uppercase mb-3">
            Clínica Selene
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] mb-4">
            Corpo &amp; Mente
          </h1>
          <p className="text-[#4a3b5c] max-w-2xl mx-auto leading-relaxed">
            Terapias integrativas que cuidam de você de dentro para fora — aliviando tensões corporais,
            equilibrando emoções e expandindo seu potencial.
          </p>
        </div>

        {/* ── Mobilidade e Cura ────────────────────────────── */}
        <section aria-labelledby="mobilidade-heading" className="mb-14">
          <div className="flex items-center gap-3 mb-7">
            <BodyIcon />
            <h2 id="mobilidade-heading" className="text-2xl font-serif text-[#2a153b] font-bold pb-1 border-b-2 border-[#d4af37]">
              Cuidados de Mobilidade e Cura
            </h2>
          </div>
          <p className="text-[#4a3b5c] text-sm mb-6 leading-relaxed">
            Terapias corporais que liberam tensões, restauram o equilíbrio e devolvem a vitalidade ao seu corpo.
          </p>
          <div className="flex flex-col gap-5">
            {MOBILIDADE.map((t) => (
              <div key={t.nome} className="glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-20 h-20 rounded-xl bg-[#6B4C9A]/15 flex items-center justify-center border border-[#d4af37]/30 self-start">
                  <svg className="w-10 h-10 text-[#6B4C9A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 21c0 0-6-4-6-9a6 6 0 0 1 12 0c0 5-6 9-6 9z" />
                    <path d="M12 12c-2-2-4-2-5-1M12 12c2-2 4-2 5-1M12 12c0-3 1-5 2-6M12 12c0-3-1-5-2-6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-[#2a153b] mb-2">{t.nome}</h3>
                  <p className="text-[#4a3b5c] text-sm leading-relaxed mb-3">{t.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {t.beneficios.map((b) => (
                      <li key={b}
                        className="text-xs bg-[#6B4C9A]/15 text-[#2a153b] px-3 py-1 rounded-full font-medium border border-[#d4af37]/30">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cuidados com a Mente ─────────────────────────── */}
        <section aria-labelledby="mente-heading" className="mb-14">
          <div className="flex items-center gap-3 mb-7">
            <MindIcon />
            <h2 id="mente-heading" className="text-2xl font-serif text-[#2a153b] font-bold pb-1 border-b-2 border-[#d4af37]">
              Cuidados com a Mente
            </h2>
          </div>
          <p className="text-[#4a3b5c] text-sm mb-6 leading-relaxed">
            Terapias que cuidam do seu mundo interior — emoções, pensamentos e padrões — para uma vida mais plena.
          </p>
          <div className="flex flex-col gap-5">
            {MENTE.map((t) => (
              <div key={t.nome} className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-serif font-bold text-[#2a153b] mb-3">{t.nome}</h3>
                <p className="text-[#4a3b5c] text-sm leading-relaxed mb-4">{t.desc}</p>
                <ul className="flex flex-wrap gap-2">
                  {t.beneficios.map((b) => (
                    <li key={b}
                      className="text-xs bg-[#6B4C9A]/15 text-[#2a153b] px-3 py-1 rounded-full font-medium border border-[#d4af37]/30">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/contato" className="btn-gold text-base px-10 py-3.5 rounded-full">
            Agendar uma Sessão
          </Link>
          <p className="mt-3 text-xs text-[#4a3b5c]/80">
            Jardim Maia — Guarulhos-SP — (11) 91590-9002
          </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
