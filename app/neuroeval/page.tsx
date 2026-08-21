'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ─────────────────────────────────────────────────────────────
   Likert scale labels
───────────────────────────────────────────────────────────── */
const LIKERT_OPTIONS = [
  { value: 1, label: 'Discordo Totalmente' },
  { value: 2, label: 'Discordo' },
  { value: 3, label: 'Neutro' },
  { value: 4, label: 'Concordo' },
  { value: 5, label: 'Concordo Totalmente' },
]

/* ─────────────────────────────────────────────────────────────
   Trait categories
───────────────────────────────────────────────────────────── */
type TraitKey = 'tdah' | 'tea' | 'borderline' | 'narcisismo' | 'ah_sd'
type TempKey  = 'sanguineo' | 'colerico' | 'melancolico' | 'fleumatico'

interface TraitStep {
  key: TraitKey
  title: string
  subtitle: string
  resultLabel: string
  resultDesc: string
  questions: string[]
}

const TRAIT_STEPS: TraitStep[] = [
  {
    key: 'tdah',
    title: 'Rotina e Organização',
    subtitle: 'Pense em como você lida com suas tarefas no dia a dia.',
    resultLabel: 'Rotina e Foco',
    resultDesc: 'Indicadores relacionados à organização, atenção sustentada e manejo de impulsos.',
    questions: [
      'Frequentemente deixo tarefas pela metade ou perco o fio da meada em conversas longas.',
      'Tenho dificuldade em começar tarefas que exigem esforço mental prolongado, deixando tudo para a última hora.',
      'Sinto uma inquietação interna constante ou tenho dificuldade em relaxar, mesmo quando não há nada urgente para fazer.',
      'Perco objetos importantes com frequência (chaves, celular, documentos) ou esqueço compromissos agendados.',
      'Tenho dificuldade em seguir instruções longas ou manter o foco em detalhes importantes.',
    ],
  },
  {
    key: 'tea',
    title: 'Ambientes e Padrões',
    subtitle: 'Pense em como você reage a mudanças e estímulos ao seu redor.',
    resultLabel: 'Sensibilidade e Padrões',
    resultDesc: 'Indicadores relacionados ao processamento sensorial e adaptação a mudanças.',
    questions: [
      'Ambientes com muita luz, barulho, cheiros fortes ou movimento tendem a me causar cansaço ou irritação rápida.',
      'Prefiro que as coisas sigam uma rotina previsível e fico muito ansioso(a) quando planos mudam de última hora.',
      'Tenho assuntos ou hobbies específicos nos quais consigo me aprofundar por horas, às vezes ignorando o que acontece ao redor.',
      'Tenho dificuldade em entender ironias, sarcasmo ou expressões faciais das pessoas em conversas.',
      'Sinto-me mais confortável em interações sociais quando há regras claras ou um roteiro definido a seguir.',
    ],
  },
  {
    key: 'borderline',
    title: 'Intensidade Emocional',
    subtitle: 'Pense em como você vivencia seus sentimentos e relacionamentos.',
    resultLabel: 'Intensidade Emocional',
    resultDesc: 'Indicadores relacionados à regulação do humor e estabilidade nos vínculos.',
    questions: [
      'Minha percepção sobre as pessoas pode mudar drasticamente de um dia para o outro (de muito idealizadas a muito decepcionantes).',
      'Frequentemente sinto um vazio interior ou um medo intenso de que pessoas importantes se afastem de mim.',
      'Minhas emoções mudam de forma muito rápida e intensa ao longo do dia, muitas vezes sem um motivo aparente para os outros.',
      'Já tomei decisões impulsivas em momentos de forte emoção (gastos excessivos, relacionamentos rápidos, mudanças radicais).',
      'Sinto dificuldade em saber quem eu realmente sou ou quais são meus valores e objetivos de vida.',
    ],
  },
  {
    key: 'narcisismo',
    title: 'Autoimagem e Reconhecimento',
    subtitle: 'Pense em como você se vê e como acredita que os outros o veem.',
    resultLabel: 'Autoimagem e Reconhecimento',
    resultDesc: 'Indicadores relacionados à percepção de si e à empatia nas relações.',
    questions: [
      'Sinto que minhas conquistas e esforços muitas vezes não são valorizados na devida proporção pelas pessoas ao meu redor.',
      'Tenho dificuldade em compreender ou validar os sentimentos alheios quando eles entram em conflito com os meus.',
      'Reajo com muita irritação, raiva ou sentimento de humilhação quando recebo críticas, mesmo que sejam construtivas.',
      'Frequentemente me comparo com os outros e sinto que mereço mais reconhecimento ou oportunidades especiais.',
      'Em grupos, sinto necessidade de ser o centro das atenções ou de liderar as conversas e decisões.',
    ],
  },
  {
    key: 'ah_sd',
    title: 'Processamento e Potencial',
    subtitle: 'Pense em como você aprende e processa o mundo ao seu redor.',
    resultLabel: 'Processamento e Potencial',
    resultDesc: 'Indicadores relacionados à velocidade de aprendizado, criatividade e intensidade.',
    questions: [
      'Desde criança, senti que processava informações, aprendia ou me conectava com assuntos de forma diferente ou mais intensa que a maioria.',
      'Sinto uma necessidade intensa de justiça e questiono regras ou autoridades que parecem ilógicas ou injustas.',
      'Tenho uma sensibilidade emocional, empática ou sensorial (luz, som, toque) que considero acima da média das outras pessoas.',
      'Consigo fazer conexões rápidas entre assuntos aparentemente desconexos ou tenho insights criativos frequentes.',
      'Sinto-me entediado(a) facilmente em tarefas repetitivas ou quando não sou desafiado(a) intelectual ou criativamente.',
    ],
  },
]

/* ─────────────────────────────────────────────────────────────
   Temperament step (step 7)
───────────────────────────────────────────────────────────── */
const TEMP_QUESTIONS: { id: string; key: TempKey; text: string }[] = [
  { id: 'temp_1', key: 'sanguineo',   text: 'Sou uma pessoa extrovertida, otimista e que gosta de estar rodeada de pessoas e novidades.' },
  { id: 'temp_2', key: 'sanguineo',   text: 'Tomo decisões rapidamente, sou comunicativo(a) e tenho facilidade em começar novos projetos com entusiasmo.' },
  { id: 'temp_3', key: 'colerico',    text: 'Sou determinado(a), competitivo(a) e gosto de estar no controle das situações e desafios.' },
  { id: 'temp_4', key: 'colerico',    text: 'Tenho forte vontade própria, sou direto(a) nas minhas opiniões e não tenho medo de confrontos quando necessário.' },
  { id: 'temp_5', key: 'melancolico', text: 'Sou analítico(a), perfeccionista e presto muita atenção aos detalhes e à qualidade do que faço.' },
  { id: 'temp_6', key: 'melancolico', text: 'Tendo a ser introspectivo(a), reflexivo(a) e às vezes preocupado(a) com o que os outros pensam de mim.' },
  { id: 'temp_7', key: 'fleumatico',  text: 'Sou calmo(a), paciente e tenho facilidade em manter a estabilidade emocional mesmo em situações de pressão.' },
  { id: 'temp_8', key: 'fleumatico',  text: 'Prefiro evitar conflitos, sou bom(boa) ouvinte e tenho facilidade em mediar situações entre pessoas.' },
]

const TEMP_LABELS: Record<TempKey, { name: string; desc: string }> = {
  sanguineo:   { name: 'Sanguíneo',   desc: 'Extrovertido, otimista e comunicativo. Gosta de novidades e interações sociais.' },
  colerico:    { name: 'Colérico',    desc: 'Determinado, competitivo e líder natural. Focado em resultados e desafios.' },
  melancolico: { name: 'Melancólico', desc: 'Analítico, perfeccionista e reflexivo. Atento aos detalhes e à qualidade.' },
  fleumatico:  { name: 'Fleumático',  desc: 'Calmo, paciente e mediador. Mantém estabilidade emocional e evita conflitos.' },
}

/* ─────────────────────────────────────────────────────────────
   Total steps: 1 contact + 5 traits + 1 temperament = 7
───────────────────────────────────────────────────────────── */
const TOTAL_STEPS = 1 + TRAIT_STEPS.length + 1

/* ─────────────────────────────────────────────────────────────
   Scoring helpers
───────────────────────────────────────────────────────────── */
function traitLevel(score: number, max: number): { label: string; colorClass: string; barColor: string; pct: number } {
  const pct = Math.round((score / max) * 100)
  if (pct >= 70) return { label: 'Atenção Elevada',  colorClass: 'text-[#c0392b] bg-red-50   border-red-200',   barColor: '#e05c9b', pct }
  if (pct >= 45) return { label: 'Atenção Moderada', colorClass: 'text-[#b8860b] bg-yellow-50 border-yellow-200', barColor: '#d4af37', pct }
  return              { label: 'Dentro da Média',   colorClass: 'text-[#27ae60] bg-green-50  border-green-200',  barColor: '#2ecc71', pct }
}

function dominantTemperament(scores: Record<TempKey, number>): TempKey {
  const keys: TempKey[] = ['sanguineo', 'colerico', 'melancolico', 'fleumatico']
  return keys.reduce((a, b) => scores[a] >= scores[b] ? a : b)
}

function narcissismType(narcScore: number, bordScore: number): string {
  const pct = Math.round((narcScore / 25) * 100)
  if (pct < 45) return 'Sem traços significativos'
  if (pct >= 70 && bordScore < 15) return 'Grandioso (Clássico)'
  if (pct >= 50 && bordScore >= 15) return 'Vulnerável (Covert)'
  return 'Misto'
}

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface ContactData {
  nome: string
  email: string
  telefone: string
  consentimentoLGPD: boolean
}

type TraitAnswers = Record<TraitKey, number[]>
type TempAnswers  = Record<string, number>

/* ─────────────────────────────────────────────────────────────
   Shared field class
───────────────────────────────────────────────────────────── */
const fieldCls =
  'w-full bg-gradient-to-br from-white/90 to-[#f8f4fc] border-2 border-[#D4AF37]/50 rounded-xl px-4 py-3 ' +
  'text-[#2D2D2D] placeholder-[#999] ' +
  'focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/30 transition-all'

/* ─────────────────────────────────────────────────────────────
   LikertRow
───────────────────────────────────────────────────────────── */
function LikertRow({ questionText, value, onChange }: {
  questionText: string
  value: number
  onChange: (val: number) => void
}) {
  return (
    <div className="mb-8 p-4 bg-white/40 rounded-xl border border-[#D4AF37]/20">
      <p className="text-[#3d2352] font-medium mb-4 text-base leading-relaxed">
        &ldquo;{questionText}&rdquo;
      </p>
      <div className="flex flex-wrap gap-2">
        {LIKERT_OPTIONS.map(opt => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={selected}
              className={`flex-1 min-w-[80px] text-center py-3 px-2 rounded-lg border-2 text-sm transition-all transform hover:scale-105 font-medium ${
                selected
                  ? 'border-[#D4AF37] font-bold text-[#2a153b] shadow-lg'
                  : 'bg-white border-[#D4AF37]/30 text-[#3d2352] hover:border-[#D4AF37]'
              }`}
              style={selected ? { background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' } : undefined}
            >
              {opt.label}
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
  const id = `og-nb-${side}`
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#bf953f" />
          <stop offset="40%"  stopColor="#fcf6ba" />
          <stop offset="100%" stopColor="#aa771c" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M50 10 C60 20, 65 30, 60 40 C55 50, 45 45, 40 40 C35 35, 40 20, 50 10 Z" />
      <path fill={`url(#${id})`} d="M50 40 C60 50, 70 55, 75 50 C80 45, 70 35, 60 30 C50 25, 45 35, 50 40 Z" />
      <path fill={`url(#${id})`} d="M50 40 C40 50, 30 55, 25 50 C20 45, 30 35, 40 30 C50 25, 55 35, 50 40 Z" />
      <circle cx="50" cy="40" r="5" fill="#fff8dc" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Results Screen
───────────────────────────────────────────────────────────── */
function ResultsScreen({
  contact, traitAnswers, tempAnswers, onReset,
}: {
  contact: ContactData
  traitAnswers: TraitAnswers
  tempAnswers: TempAnswers
  onReset: () => void
}) {
  const date = new Date().toLocaleDateString('pt-BR')

  // Trait scores
  const traits = TRAIT_STEPS.map(t => {
    const score = traitAnswers[t.key].reduce((s, v) => s + v, 0)
    const max   = t.questions.length * 5
    const lvl   = traitLevel(score, max)
    return { ...t, score, max, lvl }
  })

  // Temperament scores
  const tempScores: Record<TempKey, number> = { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 }
  TEMP_QUESTIONS.forEach(q => {
    tempScores[q.key] += tempAnswers[q.id] ?? 0
  })
  const domTemp   = dominantTemperament(tempScores)
  const tempInfo  = TEMP_LABELS[domTemp]

  // Narcissism type
  const narcTrait = traits.find(t => t.key === 'narcisismo')!
  const bordTrait = traits.find(t => t.key === 'borderline')!
  const narcType  = narcissismType(narcTrait.score, bordTrait.score)

  // Augment narcissism desc with type
  const traitsDisplay = traits.map(t =>
    t.key === 'narcisismo'
      ? { ...t, lvl: { ...t.lvl }, resultDesc: `${t.resultDesc} Tipo identificado: ${narcType}.` }
      : t
  )

  function buildWAMessage() {
    const lines = [
      `*MAPEAMENTO COMPORTAMENTAL - CLÍNICA SELENE*`,
      ``,
      `Paciente: ${contact.nome}`,
      `Telefone: ${contact.telefone}`,
      `Data: ${date}`,
      ``,
      `*Perfil Preliminar:*`,
      ...traitsDisplay.map(t => `• ${t.resultLabel}: *${t.lvl.label}* (${t.score}/${t.max})`),
      `• Narcisismo – Tipo: ${narcType}`,
      `• Temperamento Dominante: ${tempInfo.name}`,
      ``,
      `⚠️ Este mapeamento é preliminar e *não substitui* diagnóstico clínico formal.`,
    ]
    return encodeURIComponent(lines.join('\n'))
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            background: white !important;
          }
          .print-header { display: block !important; }
        }
      `}</style>

      <div className="min-h-screen bg-selene-gradient flex flex-col">
        <div className="no-print">
          <Header tituloPagina="Mapeamento Comportamental" variante="escuro" />
        </div>

        {/* Print-only header */}
        <div className="print-header" style={{ display: 'none' }}>
          <div style={{ textAlign: 'center', padding: '16px 0 8px', borderBottom: '2px solid #D4AF37' }}>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: '22px', color: '#2a153b' }}>Clínica Selene</h1>
            <p style={{ fontSize: '13px', color: '#6B4C9A' }}>Mapeamento Comportamental Preliminar</p>
            <p style={{ fontSize: '11px', color: '#888' }}>Paciente: {contact.nome} — {date}</p>
          </div>
        </div>

        <main className="flex-grow px-4 sm:px-6 py-10 relative z-10">
          <div className="max-w-2xl mx-auto">

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif text-[#2a153b] mb-1">Mapeamento Gerado</h1>
              <p className="text-[#6B4C9A] text-sm">Obrigado, {contact.nome}. Aqui está o seu perfil comportamental preliminar.</p>
            </div>

            <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 mb-6 print-card">

              {/* Temperament highlight */}
              <div className="rounded-xl border-2 border-[#D4AF37]/50 p-5 mb-7 text-center"
                style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(107,76,154,0.12))' }}>
                <p className="text-xs font-bold text-[#6B4C9A] uppercase tracking-widest mb-1">Temperamento Dominante</p>
                <p className="text-2xl font-serif font-bold text-[#b38728]">{tempInfo.name}</p>
                <p className="text-sm text-[#3d2352] mt-1">{tempInfo.desc}</p>
              </div>

              {/* Trait bars */}
              <div className="space-y-5 mb-8">
                {traitsDisplay.map(t => (
                  <div key={t.key} className={`p-4 rounded-xl border-2 ${t.lvl.colorClass}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-base">{t.resultLabel}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80">{t.lvl.label}</span>
                    </div>
                    <p className="text-xs opacity-90 mb-2">{t.resultDesc}</p>
                    <div className="w-full bg-black/10 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${t.lvl.pct}%`, background: t.lvl.barColor }} />
                    </div>
                    <p className="text-right text-xs mt-1 opacity-70">{t.score}/{t.max} pts</p>
                  </div>
                ))}
              </div>

              {/* Legal disclaimer */}
              <div className="rounded-xl border-2 border-[#D4AF37]/30 p-4 mb-6 bg-[#3d2352] text-[#E8E0F0]">
                <p className="text-xs leading-relaxed">
                  <strong>⚠️ Aviso Legal e Ético:</strong> Este instrumento é uma ferramenta de <em>screening</em>{' '}
                  (mapeamento) baseada em autorrelato comportamental. Ele <strong>não</strong> constitui um diagnóstico
                  médico ou psicológico definitivo. Um diagnóstico formal requer avaliação clínica presencial por
                  profissional habilitado (psicólogo ou psiquiatra). Os dados coletados são tratados conforme a{' '}
                  <strong>Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018)</strong> e serão utilizados
                  exclusivamente para fins de contato e orientação profissional pela Clínica Selene.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center no-print">
                <button
                  onClick={() => window.open(`https://wa.me/5511915909002?text=${buildWAMessage()}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
                >
                  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Enviar para WhatsApp da Clínica
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)', color: '#2a153b' }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar / Imprimir PDF
                </button>
              </div>
              <div className="text-center mt-4 no-print">
                <button onClick={onReset} className="text-sm text-[#6B4C9A] hover:text-[#3d2352] underline transition">
                  ↺ Realizar novo mapeamento
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
    nome: '', email: '', telefone: '', consentimentoLGPD: false,
  })
  const [traitAnswers, setTraitAnswers] = useState<TraitAnswers>(() => {
    const init = {} as TraitAnswers
    TRAIT_STEPS.forEach(t => { init[t.key] = new Array(t.questions.length).fill(0) })
    return init
  })
  const [tempAnswers, setTempAnswers] = useState<TempAnswers>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [lgpdError, setLgpdError] = useState(false)

  const progress = Math.round((step / TOTAL_STEPS) * 100)

  // Current trait step index (0-based), or null when on contact / temperament steps
  const traitIdx  = step >= 2 && step <= 1 + TRAIT_STEPS.length ? step - 2 : null
  const isTempStep = step === TOTAL_STEPS

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setContact(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'consentimentoLGPD' && checked) setLgpdError(false)
  }

  function setTraitAnswer(traitKey: TraitKey, qIdx: number, val: number) {
    setTraitAnswers(prev => {
      const row = [...prev[traitKey]]
      row[qIdx] = val
      return { ...prev, [traitKey]: row }
    })
  }

  function setTempAnswer(qId: string, val: number) {
    setTempAnswers(prev => ({ ...prev, [qId]: val }))
  }

  function canAdvance(): boolean {
    if (step === 1) {
      return !!(contact.nome.trim() && contact.email.trim() && contact.telefone.trim() && contact.consentimentoLGPD)
    }
    if (traitIdx !== null) {
      const t = TRAIT_STEPS[traitIdx]
      return traitAnswers[t.key].every(v => v > 0)
    }
    if (isTempStep) {
      return TEMP_QUESTIONS.every(q => (tempAnswers[q.id] ?? 0) > 0)
    }
    return true
  }

  function handleNext() {
    if (step === 1 && !contact.consentimentoLGPD) {
      setLgpdError(true)
      return
    }
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1)
    } else {
      setIsGenerating(true)
      setTimeout(() => {
        setIsGenerating(false)
        setShowResults(true)
      }, 1200)
    }
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 1))
  }

  function handleReset() {
    setStep(1)
    setContact({ nome: '', email: '', telefone: '', consentimentoLGPD: false })
    setTraitAnswers(() => {
      const init = {} as TraitAnswers
      TRAIT_STEPS.forEach(t => { init[t.key] = new Array(t.questions.length).fill(0) })
      return init
    })
    setTempAnswers({})
    setShowResults(false)
    setLgpdError(false)
  }

  if (showResults) {
    return (
      <ResultsScreen
        contact={contact}
        traitAnswers={traitAnswers}
        tempAnswers={tempAnswers}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col relative overflow-hidden">
      <Header tituloPagina="Mapeamento Comportamental" variante="escuro" />

      <OrchidDecor className="absolute top-20 left-0 w-36 h-36 opacity-20 pointer-events-none" side="left" />
      <OrchidDecor className="absolute bottom-20 right-0 w-48 h-48 opacity-20 pointer-events-none" side="right" />

      <main className="flex-grow relative z-10 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-8">
            <p className="text-[#3d2352] text-xs font-bold tracking-widest uppercase mb-2">Clínica Selene</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] mb-2">
              Mapeamento Comportamental
            </h1>
            <p className="text-[#6B4C9A] text-base max-w-md mx-auto">
              Responda com honestidade. Os resultados são confidenciais e usados para direcionar seu atendimento.
            </p>
          </div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#6B4C9A]/5 rounded-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-semibold text-[#6B4C9A] mb-2">
                  <span>Etapa {step} de {TOTAL_STEPS}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-[#E8E0F0] rounded-full h-3 overflow-hidden border border-[#D4AF37]/30">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)',
                    }}
                    role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
                  />
                </div>
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

              {/* ── Step 1: Contact + LGPD ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-4">
                    <h2 className="text-2xl font-serif text-[#3d2352] font-bold">Dados e Consentimento</h2>
                    <p className="text-[#6B4C9A] text-sm mt-1">Informações iniciais e conformidade com a LGPD</p>
                  </div>

                  <div>
                    <label htmlFor="nome" className="block text-sm font-bold text-[#3d2352] mb-2">
                      Nome Completo <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input id="nome" name="nome" type="text" value={contact.nome} onChange={handleContactChange}
                      required placeholder="Seu nome completo" className={fieldCls} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-[#3d2352] mb-2">
                        E-mail <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input id="email" name="email" type="email" value={contact.email} onChange={handleContactChange}
                        required placeholder="seu@email.com" className={fieldCls} />
                    </div>
                    <div>
                      <label htmlFor="telefone" className="block text-sm font-bold text-[#3d2352] mb-2">
                        Telefone/WhatsApp <span className="text-[#D4AF37]">*</span>
                      </label>
                      <input id="telefone" name="telefone" type="tel" value={contact.telefone} onChange={handleContactChange}
                        required placeholder="(11) 91590-9002" className={fieldCls} />
                    </div>
                  </div>

                  {/* LGPD consent */}
                  <div className={`rounded-xl border-2 p-4 mt-2 transition-colors ${
                    lgpdError ? 'border-red-400 bg-red-50' : 'border-[#D4AF37]/40'
                  }`} style={lgpdError ? undefined : { background: 'rgba(212,175,55,0.07)' }}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="consentimentoLGPD"
                        name="consentimentoLGPD"
                        type="checkbox"
                        checked={contact.consentimentoLGPD}
                        onChange={handleContactChange}
                        className="mt-1 w-5 h-5 accent-[#D4AF37] flex-shrink-0 cursor-pointer"
                      />
                      <span className="text-xs text-[#3d2352] leading-relaxed">
                        <strong>Consentimento LGPD (Lei 13.709/2018):</strong> Declaro que as informações fornecidas são
                        verdadeiras. Autorizo o processamento destes dados pela Clínica Selene exclusivamente para fins
                        de mapeamento preliminar e contato profissional. Os dados serão tratados com sigilo e não serão
                        compartilhados com terceiros sem meu consentimento expresso.{' '}
                        <strong className="text-[#D4AF37]">*</strong>
                      </span>
                    </label>
                    {lgpdError && (
                      <p className="text-red-600 text-xs mt-2 font-semibold">
                        ⚠️ É necessário aceitar os termos da LGPD para prosseguir.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Steps 2–6: Trait questions ── */}
              {traitIdx !== null && (() => {
                const t = TRAIT_STEPS[traitIdx]
                return (
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#6B4C9A] font-semibold">{traitIdx + 1} de {TRAIT_STEPS.length}</span>
                      </div>
                      <h2 className="text-2xl font-serif text-[#3d2352] font-bold">{t.title}</h2>
                      <p className="text-[#6B4C9A] text-sm mt-1">{t.subtitle}</p>
                    </div>
                    {t.questions.map((q, qi) => (
                      <LikertRow
                        key={qi}
                        questionText={q}
                        value={traitAnswers[t.key][qi]}
                        onChange={val => setTraitAnswer(t.key, qi, val)}
                      />
                    ))}
                  </div>
                )
              })()}

              {/* ── Step 7: Temperament ── */}
              {isTempStep && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-serif text-[#3d2352] font-bold">Temperamento e Personalidade</h2>
                    <p className="text-[#6B4C9A] text-sm mt-1">
                      Pense em como você naturalmente reage e se comporta em diferentes situações.
                    </p>
                  </div>
                  {TEMP_QUESTIONS.map(q => (
                    <LikertRow
                      key={q.id}
                      questionText={q.text}
                      value={tempAnswers[q.id] ?? 0}
                      onChange={val => setTempAnswer(q.id, val)}
                    />
                  ))}
                  <div className="rounded-xl border-2 border-[#D4AF37]/40 p-4 mt-2 text-center text-xs text-[#3d2352] leading-relaxed"
                    style={{ background: 'rgba(212,175,55,0.07)' }}>
                    Ao clicar em <strong>&ldquo;Gerar Mapeamento&rdquo;</strong>, seus dados serão processados localmente
                    para gerar um perfil comportamental preliminar.<br />
                    <strong>Este instrumento não substitui um diagnóstico clínico formal.</strong>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between gap-4 pt-8 mt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-8 py-3 rounded-full font-bold transition-all text-sm ${
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
                  disabled={!canAdvance() || isGenerating}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    canAdvance() && !isGenerating
                      ? 'btn-gold'
                      : 'bg-[#E8E0F0] text-[#aaa] cursor-not-allowed'
                  }`}
                  title={!canAdvance() ? 'Preencha todos os campos para continuar' : ''}
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processando...
                    </>
                  ) : step < TOTAL_STEPS ? 'Próximo →' : 'Gerar Mapeamento ✨'}
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
