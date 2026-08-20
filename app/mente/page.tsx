import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cuidados com a Mente | Clínica Selene',
  description: 'Terapias mentais: Mentoria, Psicanálise, Hipnoterapia e Terapia Cognitivo-Comportamental.',
}

const TERAPIAS = [
  {
    nome:    'Mentoria / Psicanálise',
    desc:    'Espaço seguro para autoconhecimento profundo, compreensão dos padrões inconscientes e desenvolvimento pessoal guiado.',
    beneficios: ['Autoconhecimento', 'Resolução de conflitos internos', 'Crescimento pessoal'],
  },
  {
    nome:    'Hipnoterapia',
    desc:    'Uso do estado hipnótico para acessar o subconsciente, reprogramar crenças limitantes e resolver questões emocionais.',
    beneficios: ['Controle de ansiedade', 'Mudança de hábitos', 'Superação de fobias'],
  },
  {
    nome:    'Terapia Cognitivo-Comportamental (TCC)',
    desc:    'Abordagem baseada em evidências que transforma padrões de pensamento e comportamento negativos em respostas saudáveis.',
    beneficios: ['Redução de ansiedade e depressão', 'Técnicas práticas', 'Resultados mensuráveis'],
  },
]

export default function MentePage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <p className="text-[#9B7ED9] text-sm font-semibold tracking-widest uppercase mb-3">Clínica Selene</p>
        <h1 className="text-4xl md:text-5xl font-serif text-[#6B4C9A] mb-4">Cuidados com a Mente</h1>
        <p className="text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
          Terapias que cuidam do seu mundo interior — emoções, pensamentos e padrões — para uma vida mais plena.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {TERAPIAS.map((t) => (
          <div key={t.nome} className="card-selene">
            <h2 className="text-xl font-serif font-semibold text-[#6B4C9A] mb-3">{t.nome}</h2>
            <p className="text-[#4A4A4A] text-sm leading-relaxed mb-4">{t.desc}</p>
            <ul className="flex flex-wrap gap-2">
              {t.beneficios.map((b) => (
                <li key={b} className="text-xs bg-[#E8E0F0] text-[#6B4C9A] px-3 py-1 rounded-full font-medium">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="/agendamento" className="btn-gold text-base">Agendar Consulta</a>
      </div>
    </div>
  )
}
