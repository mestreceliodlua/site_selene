import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Corpo & Mente | Clínica Selene',
  description:
    'A Terapia Integrativa do Movimento une psicanálise, TCC, artes marciais e terapias holísticas para equilíbrio corpo-mente. Conheça os 4 pilares na Clínica Selene.',
}

/* ── 4 Pilares ─────────────────────────────────────────────── */
const PILARES = [
  {
    titulo: '4 Temperamentos',
    desc: 'Mapeamento dos perfis Sanguíneo, Colérico, Melancólico e Fleumático para entender sua natureza.',
    icon: TemperamentosIcon,
  },
  {
    titulo: 'Equilíbrio dos Chacras',
    desc: 'Harmonização dos centros de energia para fluidez emocional, física e espiritual.',
    icon: ChakrasIcon,
  },
  {
    titulo: 'Performance e Movimento',
    desc: 'Técnicas corporais e artes marciais aplicadas ao bem-estar e à alta performance.',
    icon: MovimentoIcon,
  },
  {
    titulo: 'Autoconhecimento Profundo',
    desc: 'Ferramentas de psicanálise e TCC para dissolver padrões e expandir sua potência.',
    icon: MenteIcon,
  },
]

export default function CorpoMentePage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header tituloPagina="Corpo & Mente" variante="escuro" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #2a153b 0%, #6B4C9A 55%, #9B7ED9 100%)' }}
      >
        <div className="container mx-auto max-w-3xl relative z-10">
          <p className="text-[#fcf6ba] text-xs font-bold tracking-widest uppercase mb-4">
            Clínica Selene
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-5">
            Corpo e Mente em Sintonia
          </h1>
          <p className="text-[#E8E0F0] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Descubra o método integrativo que une autoconhecimento, performance e
            equilíbrio energético.
          </p>
          <Link
            href="/contato"
            className="btn-gold px-8 py-4 rounded-full text-base font-bold inline-block"
          >
            Agendar Avaliação
          </Link>
        </div>
      </section>

      <main className="flex-grow">
        {/* ── Filosofia ──────────────────────────────────────── */}
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-serif text-[#2a153b] font-bold mb-5 pb-2 border-b-2 border-[#D4AF37] inline-block">
                A Terapia Integrativa do Movimento
              </h2>
              <p className="text-[#4a3b5c] leading-relaxed mb-4">
                Nosso método único tece juntos a profundidade da{' '}
                <strong>psicanálise</strong> e da{' '}
                <strong>Terapia Cognitivo-Comportamental</strong>, a disciplina e
                o foco das <strong>artes marciais</strong> e o resgate vital das{' '}
                <strong>terapias holísticas</strong> — como o equilíbrio dos
                chacras e a reconexão corpo-mente.
              </p>
              <p className="text-[#4a3b5c] leading-relaxed">
                Não tratamos sintomas isolados: mapeamos seus temperamentos,
                harmonizamos sua energia e ativamos seu movimento para uma
                transformação real e duradoura.
              </p>
            </div>
            <div>
              <img
                src="/assets/img/corpo-mente.svg"
                alt="Sessão de Terapia Integrativa na Clínica Selene"
                className="w-full h-auto rounded-2xl shadow-[0_4px_12px_rgba(74,26,107,0.15)]"
              />
            </div>
          </div>
        </section>

        {/* ── Pilares ────────────────────────────────────────── */}
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2a153b] font-bold text-center mb-12">
            Os 4 Pilares do Seu Equilíbrio
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILARES.map(({ titulo, desc, icon: Icon }) => (
              <div
                key={titulo}
                className="bg-white rounded-xl border-t-4 border-[#6B4C9A] p-6 shadow-[0_4px_12px_rgba(74,26,107,0.15)] transition hover:-translate-y-[5px] hover:shadow-lg flex flex-col gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#6B4C9A]/15 flex items-center justify-center border border-[#D4AF37]/30">
                  <Icon className="w-8 h-8 text-[#6B4C9A]" />
                </div>
                <h3 className="font-serif text-lg text-[#2a153b] font-bold">
                  {titulo}
                </h3>
                <p className="text-sm text-[#4a3b5c] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Final ──────────────────────────────────────── */}
        <section
          className="py-16 px-6 text-center"
          style={{ background: 'var(--lilas-claro)' }}
        >
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-serif text-[#2a153b] font-bold mb-8">
              Pronto para iniciar sua jornada de transformação?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contato"
                className="btn-gold px-8 py-4 rounded-full text-base font-bold"
              >
                Agendar Consulta
              </Link>
              <Link
                href="/neuroeval"
                className="px-8 py-4 rounded-full text-base font-semibold border-2 border-[#6B4C9A]/50 text-[#2a153b] hover:bg-[#6B4C9A]/10 transition-all"
              >
                Fazer Triagem Gratuita
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ── Ícones dos pilares ───────────────────────────────────── */
function TemperamentosIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="7" r="2.5" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </svg>
  )
}
function ChakrasIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}
function MovimentoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="13" cy="4" r="2" />
      <path d="M11 21l1-6-3-2 4-4 1 4 3-1-2 5" />
    </svg>
  )
}
function MenteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3 12h3M18 12h3" />
    </svg>
  )
}
