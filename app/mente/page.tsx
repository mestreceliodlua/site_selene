import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Cuidados com a Mente | Clínica Selene',
  description: 'Terapias mentais: Mentoria, Psicanálise, Hipnoterapia e Terapia Cognitivo-Comportamental.',
}

const TERAPIAS = [
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
]

export default function MentePage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header tituloPagina="Cuidados com a Mente" variante="escuro" />

      <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-[#3d2352] text-sm font-semibold tracking-widest uppercase mb-3">
            Clínica Selene
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] mb-4">
            Cuidados com a Mente
          </h1>
          <p className="text-[#4a3b5c] max-w-2xl mx-auto leading-relaxed">
            Terapias que cuidam do seu mundo interior — emoções, pensamentos e padrões — para uma vida mais plena.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {TERAPIAS.map((t) => (
            <div key={t.nome} className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-serif font-bold text-[#2a153b] mb-3">{t.nome}</h2>
              <p className="text-[#4a3b5c] text-sm leading-relaxed mb-4">{t.desc}</p>
              <ul className="flex flex-wrap gap-2">
                {t.beneficios.map((b) => (
                  <li
                    key={b}
                    className="text-xs bg-[#6B4C9A]/15 text-[#2a153b] px-3 py-1 rounded-full font-medium border border-[#d4af37]/30"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/agendamento" className="btn-gold text-base px-10 py-3 rounded-full">
            Agendar Consulta
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
