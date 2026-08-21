'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface ContactData {
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  consentimento: boolean
}

/** Each trait score: sum of Likert answers (3 questions × 1–5 = 3–15) */
interface TraitScores {
  tdah: number[]
  tea: number[]
  borderline: number[]
  narcisismo: number[]
  ahsd: number[]
}

/* ─────────────────────────────────────────────────────────────
   Likert questions per trait
   3 questions each, scale 1 (Nunca) → 5 (Sempre)
───────────────────────────────────────────────────────────── */
const TRAIT_STEPS: {
  key: keyof TraitScores
  label: string
  subtitle: string
  color: string
  questions: string[]
}[] = [
  {
    key: 'tdah',
    label: 'TDAH',
    subtitle: 'Transtorno de Déficit de Atenção e Hiperatividade',
    color: '#7c5cd8',
    questions: [
      'Tenho dificuldade em manter o foco em tarefas longas ou que exigem concentração.',
      'Ajo ou falo sem pensar, me arrependendo depois.',
      'Sinto inquietação física ou mental — dificuldade de ficar parado(a) ou em silêncio.',
    ],
  },
  {
    key: 'tea',
    label: 'TEA',
    subtitle: 'Traços do Espectro Autista',
    color: '#3b82d4',
    questions: [
      'Tenho dificuldade em interpretar expressões faciais, tom de voz ou linguagem não-verbal.',
      'Prefiro rotinas fixas e me sinto muito incomodado(a) com mudanças inesperadas.',
      'Tenho interesses muito intensos e específicos que ocupam grande parte do meu tempo.',
    ],
  },
  {
    key: 'borderline',
    label: 'Borderline',
    subtitle: 'Traços de Personalidade Borderline',
    color: '#e05c9b',
    questions: [
      'Minhas emoções mudam de forma muito intensa e rápida ao longo do dia.',
      'Tenho medo intenso de ser abandonado(a) ou rejeitado(a) por pessoas próximas.',
      'Minha autoimagem ou senso de identidade parece instável ou confusa.',
    ],
  },
  {
    key: 'narcisismo',
    label: 'Narcisismo',
    subtitle: 'Traços Narcísicos de Personalidade',
    color: '#d4af37',
    questions: [
      'Acredito que mereço reconhecimento e tratamento especial com frequência.',
      'Sinto pouca empatia ou indiferença diante das dificuldades dos outros.',
      'Reajo com raiva ou humilhação quando minha imagem é criticada ou questionada.',
    ],
  },
  {
    key: 'ahsd',
    label: 'AH/SD',
    subtitle: 'Altas Habilidades / Superdotação',
    color: '#2ecc71',
    questions: [
      'Aprendo novos conteúdos com muita facilidade e rapidez comparado à maioria.',
      'Tenho pensamento criativo intenso — ideias incomuns surgem com frequência.',
      'Me sinto subdesafiado(a) na escola, trabalho ou em atividades do cotidiano.',
    ],
  },
]

const LIKERT_LABELS = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre']
const TOTAL_STEPS = 1 + TRAIT_STEPS.length // step 1 = contact, steps 2–6 = traits

/* ─────────────────────────────────────────────────────────────
   Scoring helpers
───────────────────────────────────────────────────────────── */
function traitSum(answers: number[]) {
  return answers.reduce((s, v) => s + v, 0)
}

function traitLevel(sum: number): { label: string; color: string; pct: number } {
  // max per trait = 3 questions × 5 = 15, min = 3
  const pct = Math.round(((sum - 3) / 12) * 100)
  if (sum <= 6)  return { label: 'Baixo',    color: '#2ecc71', pct }
  if (sum <= 10) return { label: 'Moderado', color: '#d4af37', pct }
  return              { label: 'Elevado',  color: '#e05c9b', pct }
}

/* ─────────────────────────────────────────────────────────────
   Shared field / label helpers
───────────────────────────────────────────────────────────── */
const fieldCls =
  'w-full bg-gradient-to-br from-white/90 to-[#f8f4fc] border-2 border-[#D4AF37]/50 rounded-xl px-4 py-3 ' +
  'text-[#2D2D2D] placeholder-[#999] shadow-sm ' +
  'focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/25 hover:shadow-md transition-all'

function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#3d2352] mb-2">
      {children}
      {required && <> <span className="text-[#D4AF37]" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span></>}
    </label>
  )
}

/* ─────────────────────────────────────────────────────────────
   Likert row component
───────────────────────────────────────────────────────────── */
function LikertRow({
  questionIndex, traitKey, questionText, value, onChange,
}: {
  questionIndex: number
  traitKey: string
  questionText: string
  value: number
  onChange: (val: number) => void
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-[#2a153b] mb-3 leading-relaxed">{questionText}</p>
      <div className="grid grid-cols-5 gap-2">
        {LIKERT_LABELS.map((lbl, i) => {
          const val = i + 1
          const selected = value === val
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border-2 text-center transition-all transform hover:scale-105 ${
                selected
                  ? 'border-[#D4AF37] shadow-lg text-[#2a153b]'
                  : 'bg-gradient-to-br from-white/80 to-[#f8f4fc] border-[#D4AF37]/40 text-[#3d2352] hover:border-[#D4AF37] hover:shadow-md'
              }`}
              style={selected ? { background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 100%)' } : undefined}
              aria-pressed={selected}
            >
              <span className="text-lg font-bold leading-none">{val}</span>
              <span className="text-[10px] leading-tight font-medium">{lbl}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   OrchidDecor SVG
───────────────────────────────────────────────────────────── */
function OrchidDecor({ className, side }: { className?: string; side: 'left' | 'right' }) {
  const gradId = `og-neo-${side}`
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#bf953f" />
          <stop offset="40%"  stopColor="#fcf6ba" />
          <stop offset="100%" stopColor="#aa771c" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradId})`} d="M50 10 C60 20, 65 30, 60 40 C55 50, 45 45, 40 40 C35 35, 40 20, 50 10 Z" />
      <path fill={`url(#${gradId})`} d="M50 40 C60 50, 70 55, 75 50 C80 45, 70 35, 60 30 C50 25, 45 35, 50 40 Z" />
      <path fill={`url(#${gradId})`} d="M50 40 C40 50, 30 55, 25 50 C20 45, 30 35, 40 30 C50 25, 55 35, 50 40 Z" />
      <circle cx="50" cy="40" r="5" fill="#fff8dc" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Results Screen
───────────────────────────────────────────────────────────── */
function ResultsScreen({
  contact,
  scores,
  onReset,
}: {
  contact: ContactData
  scores: TraitScores
  onReset: () => void
}) {
  const date = new Date().toLocaleDateString('pt-BR')

  // Build WhatsApp message
  function buildWAMessage() {
    const lines = [
      `*🌸 Triagem Neuropsicológica — Clínica Selene*`,
      ``,
      `*Paciente:* ${contact.nome}`,
      `*Data:* ${date}`,
      `*E-mail:* ${contact.email}`,
      `*Telefone:* ${contact.telefone}`,
      ``,
      `*Resultados por Traço:*`,
      ...TRAIT_STEPS.map(t => {
        const sum = traitSum(scores[t.key])
        const lvl = traitLevel(sum)
        return `• ${t.label} (${t.subtitle}): *${lvl.label}* (${sum}/15)`
      }),
      ``,
      `⚠️ Este resultado é uma triagem preliminar, não um diagnóstico clínico.`,
      `Recomendamos avaliação profissional individualizada.`,
    ]
    return encodeURIComponent(lines.join('\n'))
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/5511915909002?text=${buildWAMessage()}`, '_blank')
  }

  function handlePrint() {
    window.print()
  }

  return (
    <>
      {/* Print-only style */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { box-shadow: none !important; border: 1px solid #ccc !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="min-h-screen bg-selene-gradient flex flex-col" id="results-page">
        <div className="no-print">
          <Header tituloPagina="Triagem Neuropsicológica" variante="escuro" />
        </div>

        {/* Print header */}
        <div className="hidden print-only" style={{ display: 'none' }} id="print-header">
          <div style={{ textAlign: 'center', padding: '20px 0 10px', borderBottom: '2px solid #D4AF37' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#2a153b' }}>Clínica Selene</h1>
            <p style={{ fontSize: '13px', color: '#6B4C9A' }}>Estética, Massoterapia & Terapias Holísticas</p>
            <p style={{ fontSize: '11px', color: '#888' }}>Guarulhos-SP | Lisboa, Portugal — contato@clinicaselene.pt</p>
          </div>
        </div>

        <main className="flex-grow px-4 sm:px-6 py-10 relative z-10">
          <div className="max-w-2xl mx-auto">

            {/* Title */}
            <div className="text-center mb-8">
              <p className="text-[#3d2352] text-xs font-bold tracking-widest uppercase mb-2">Relatório de Triagem</p>
              <h1 className="text-3xl md:text-4xl font-serif text-[#2a153b] mb-1">Resultado da Avaliação</h1>
              <p className="text-[#6B4C9A] text-sm">{contact.nome} — {date}</p>
            </div>

            {/* Results card */}
            <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 print-full mb-6">

              {/* Trait bars */}
              <div className="space-y-6 mb-8">
                {TRAIT_STEPS.map(t => {
                  const sum = traitSum(scores[t.key])
                  const lvl = traitLevel(sum)
                  return (
                    <div key={t.key}>
                      <div className="flex justify-between items-baseline mb-1">
                        <div>
                          <span className="font-serif font-bold text-[#2a153b] text-base">{t.label}</span>
                          <span className="text-[#6B4C9A] text-xs ml-2">{t.subtitle}</span>
                        </div>
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full text-white"
                          style={{ background: lvl.color }}
                        >
                          {lvl.label} — {sum}/15
                        </span>
                      </div>
                      {/* Bar */}
                      <div className="w-full bg-[#E8E0F0] rounded-full h-4 overflow-hidden border border-[#D4AF37]/20">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(lvl.pct, 4)}%`, background: lvl.color }}
                        />
                      </div>
                      {/* Per-question scores */}
                      <div className="flex gap-2 mt-1">
                        {scores[t.key].map((v, qi) => (
                          <span key={qi} className="text-[10px] text-[#6B4C9A]">Q{qi + 1}: {v > 0 ? v : '—'}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-[#D4AF37]/20">
                {[
                  { label: 'Baixo (3–6)',    color: '#2ecc71' },
                  { label: 'Moderado (7–10)', color: '#d4af37' },
                  { label: 'Elevado (11–15)', color: '#e05c9b' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: l.color }} />
                    <span className="text-xs text-[#6B4C9A]">{l.label}</span>
                  </div>
                ))}
              </div>

              {/* Legal disclaimer */}
              <div className="rounded-xl border-2 border-[#D4AF37]/30 p-4 mb-6"
                style={{ background: 'rgba(212,175,55,0.07)' }}>
                <p className="text-xs text-[#3d2352] leading-relaxed">
                  <strong>⚠️ Aviso Legal:</strong> Este instrumento é uma <strong>triagem preliminar de auto-avaliação</strong>, 
                  elaborado com fins educativos e informativos. <strong>Não constitui diagnóstico clínico</strong> de nenhuma 
                  condição de saúde mental. Os resultados não substituem avaliação por profissional habilitado 
                  (psicólogo, psiquiatra ou neurologista). A Clínica Selene recomenda acompanhamento profissional 
                  individualizado para qualquer condição identificada.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
                <button
                  onClick={handleWhatsApp}
                  className="btn-gold px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enviar pelo WhatsApp
                </button>
                <button
                  onClick={handlePrint}
                  className="px-8 py-3 rounded-full text-sm font-bold bg-[#6B4C9A] text-white hover:bg-[#3d2352] transition shadow-md flex items-center gap-2 justify-center"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
                  </svg>
                  Exportar PDF
                </button>
                <button
                  onClick={onReset}
                  className="px-8 py-3 rounded-full text-sm font-semibold border-2 border-[#6B4C9A] text-[#3d2352] hover:bg-[#E8E0F0] transition"
                >
                  ↺ Nova Avaliação
                </button>
              </div>
            </div>

            <p className="text-center text-[#6B4C9A] text-xs no-print">
              📍 Guarulhos-SP &amp; Lisboa, Portugal &nbsp;|&nbsp; 📱 (11) 91590-9002
            </p>
          </div>
        </main>

        <div className="no-print">
          <Footer />
        </div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function NeuroEvalPage() {
  const [step, setStep] = useState(1)
  const [contact, setContact] = useState<ContactData>({
    nome: '', email: '', telefone: '', dataNascimento: '', consentimento: false,
  })
  const [scores, setScores] = useState<TraitScores>({
    tdah:       [0, 0, 0],
    tea:        [0, 0, 0],
    borderline: [0, 0, 0],
    narcisismo: [0, 0, 0],
    ahsd:       [0, 0, 0],
  })
  const [showResults, setShowResults] = useState(false)

  // step 1 = contact; steps 2–6 = trait index 0–4
  const currentTrait = step >= 2 ? TRAIT_STEPS[step - 2] : null
  const progress = Math.round((step / TOTAL_STEPS) * 100)

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setContact(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function setTraitAnswer(traitKey: keyof TraitScores, qIdx: number, val: number) {
    setScores(prev => {
      const updated = [...prev[traitKey]] as number[]
      updated[qIdx] = val
      return { ...prev, [traitKey]: updated }
    })
  }

  function canAdvance() {
    if (step === 1) {
      return contact.nome.trim() && contact.email.trim() && contact.telefone.trim() && contact.consentimento
    }
    if (currentTrait) {
      return scores[currentTrait.key].every(v => v > 0)
    }
    return true
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else setShowResults(true)
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 1))
  }

  function handleReset() {
    setStep(1)
    setContact({ nome: '', email: '', telefone: '', dataNascimento: '', consentimento: false })
    setScores({ tdah: [0, 0, 0], tea: [0, 0, 0], borderline: [0, 0, 0], narcisismo: [0, 0, 0], ahsd: [0, 0, 0] })
    setShowResults(false)
  }

  if (showResults) {
    return <ResultsScreen contact={contact} scores={scores} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col relative overflow-hidden">
      <Header tituloPagina="Triagem Neuropsicológica" variante="escuro" />

      <OrchidDecor className="absolute top-20 left-0 w-40 h-40 opacity-20 pointer-events-none" side="left" />
      <OrchidDecor className="absolute bottom-20 right-0 w-52 h-52 opacity-20 pointer-events-none" side="right" />

      <main className="flex-grow relative z-10 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-8">
            <p className="text-[#3d2352] text-xs font-bold tracking-widest uppercase mb-2">Clínica Selene</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] mb-2">
              Triagem Neuropsicológica
            </h1>
            <p className="text-[#6B4C9A] text-base max-w-md mx-auto">
              Responda com honestidade. Os resultados são confidenciais e usados para direcionar seu atendimento.
            </p>
          </div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#6B4C9A]/5 rounded-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">

              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-semibold text-[#6B4C9A] mb-2">
                  <span>Etapa {step} de {TOTAL_STEPS}</span>
                  <span>{progress}% concluído</span>
                </div>
                <div className="w-full bg-[#E8E0F0] rounded-full h-3 overflow-hidden border border-[#D4AF37]/30">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #D4AF37 0%, #F4E8C1 50%, #B8941F 100%)',
                    }}
                    role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
                  />
                </div>
                {/* Step dots */}
                <div className="flex justify-between px-1 mt-2">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i + 1 < step   ? 'bg-[#D4AF37]' :
                      i + 1 === step ? 'bg-[#b38728] ring-2 ring-[#D4AF37]/40 ring-offset-1' :
                                       'bg-[#E8E0F0] border border-[#D4AF37]/30'
                    }`} aria-hidden="true" />
                  ))}
                </div>
              </div>

              {/* Step 1 — Contact + LGPD */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-2xl font-serif text-[#3d2352] font-bold">Identificação</h2>
                    <p className="text-[#6B4C9A] text-sm mt-1">Preencha seus dados para personalizar o relatório</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <FieldLabel htmlFor="nome" required>Nome completo</FieldLabel>
                      <input id="nome" name="nome" type="text" value={contact.nome} onChange={handleContactChange}
                        required placeholder="Digite seu nome completo" className={fieldCls} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="email" required>E-mail</FieldLabel>
                      <input id="email" name="email" type="email" value={contact.email} onChange={handleContactChange}
                        required placeholder="seu@email.com" className={fieldCls} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="telefone" required>Telefone / WhatsApp</FieldLabel>
                      <input id="telefone" name="telefone" type="tel" value={contact.telefone} onChange={handleContactChange}
                        required placeholder="(11) 91590-9002" className={fieldCls} />
                    </div>
                    <div className="md:col-span-2">
                      <FieldLabel htmlFor="dataNascimento">Data de nascimento</FieldLabel>
                      <input id="dataNascimento" name="dataNascimento" type="date" value={contact.dataNascimento}
                        onChange={handleContactChange} className={fieldCls} />
                    </div>
                  </div>

                  {/* LGPD Consent */}
                  <div className="rounded-xl border-2 border-[#D4AF37]/40 p-4 mt-2"
                    style={{ background: 'rgba(212,175,55,0.07)' }}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        id="consentimento"
                        name="consentimento"
                        type="checkbox"
                        checked={contact.consentimento}
                        onChange={handleContactChange}
                        className="mt-1 w-5 h-5 accent-[#D4AF37] rounded cursor-pointer flex-shrink-0"
                      />
                      <span className="text-xs text-[#3d2352] leading-relaxed">
                        <strong>Consentimento LGPD (Lei 13.709/2018):</strong> Autorizo a Clínica Selene a coletar e processar 
                        os dados informados neste formulário com finalidade exclusiva de triagem e acompanhamento terapêutico. 
                        Os dados não serão compartilhados com terceiros. Posso solicitar a exclusão a qualquer momento pelo 
                        e-mail <span className="text-[#6B4C9A] underline">contato@clinicaselene.pt</span>.{' '}
                        <strong className="text-[#D4AF37]">*</strong>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Steps 2–6 — Trait Likert questions */}
              {step >= 2 && currentTrait && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ background: currentTrait.color }}
                      >
                        {currentTrait.label}
                      </span>
                      <span className="text-[#6B4C9A] text-xs">{step - 1} de {TRAIT_STEPS.length}</span>
                    </div>
                    <h2 className="text-2xl font-serif text-[#3d2352] font-bold">{currentTrait.subtitle}</h2>
                    <p className="text-[#6B4C9A] text-sm mt-1">
                      Avalie cada afirmação de <strong>1 (Nunca)</strong> a <strong>5 (Sempre)</strong>
                    </p>
                  </div>

                  {currentTrait.questions.map((q, qi) => (
                    <LikertRow
                      key={qi}
                      questionIndex={qi}
                      traitKey={currentTrait.key}
                      questionText={`${qi + 1}. ${q}`}
                      value={scores[currentTrait.key][qi]}
                      onChange={val => setTraitAnswer(currentTrait.key, qi, val)}
                    />
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4 pt-8 mt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-8 py-3 rounded-full font-semibold transition-all text-sm ${
                    step === 1
                      ? 'bg-[#E8E0F0] text-[#aaa] cursor-not-allowed'
                      : 'bg-[#6B4C9A] text-white hover:bg-[#3d2352] shadow-md hover:shadow-lg'
                  }`}
                >
                  ← Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                    canAdvance()
                      ? 'btn-gold'
                      : 'bg-[#E8E0F0] text-[#aaa] cursor-not-allowed'
                  }`}
                  title={!canAdvance() ? (step === 1 ? 'Preencha todos os campos e aceite o consentimento' : 'Responda todas as perguntas para continuar') : ''}
                >
                  {step < TOTAL_STEPS ? 'Próximo →' : 'Gerar Relatório ✨'}
                </button>
              </div>

            </div>
          </div>

          <p className="text-center mt-6 text-[#6B4C9A] text-xs">
            📍 Guarulhos-SP &amp; Lisboa, Portugal &nbsp;|&nbsp; 📱 (11) 91590-9002
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
