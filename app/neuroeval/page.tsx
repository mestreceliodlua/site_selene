'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ── Form shape ─────────────────────────────────────────────── */
interface FormData {
  nome: string
  dataNascimento: string
  email: string
  telefone: string
  profissao: string
  queixaPrincipal: string
  duracaoSintomas: string
  medicamentos: string
  alergias: string
  doencasCronicas: string
  cirurgias: string
  sono: string
  alimentacao: string
  exercicios: string
  estresse: string
  terapiasAnteriores: string
  expectativas: string
}

const INITIAL: FormData = {
  nome: '', dataNascimento: '', email: '', telefone: '', profissao: '',
  queixaPrincipal: '', duracaoSintomas: '',
  medicamentos: '', alergias: '', doencasCronicas: '', cirurgias: '',
  sono: '', alimentacao: '', exercicios: '', estresse: '',
  terapiasAnteriores: '', expectativas: '',
}

/* ── Shared field classes — metallic light gradient background ── */
const fieldCls =
  'w-full bg-gradient-to-br from-white/90 to-[#f8f4fc] border-2 border-[#D4AF37]/50 rounded-xl px-4 py-3 ' +
  'text-[#2D2D2D] placeholder-[#999] shadow-sm ' +
  'focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/25 hover:shadow-md transition-all'

/* ── Radio pill helper — metallic selected state ────────────── */
function RadioPill({
  name, value, label, checked, onChange,
}: {
  name: string; value: string; label: string; checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`px-4 py-3 rounded-xl border-2 text-center text-sm font-bold transition-all transform hover:scale-105 ${
          checked
            ? 'border-[#D4AF37] text-[#2a153b] shadow-lg'
            : 'bg-gradient-to-br from-white/80 to-[#f8f4fc] border-[#D4AF37]/50 text-[#3d2352] hover:border-[#D4AF37] hover:shadow-md'
        }`}
        style={checked ? { background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 100%)' } : undefined}
      >
        {label}
      </div>
    </label>
  )
}

/* ── Label helper ───────────────────────────────────────────── */
function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#3d2352] mb-2">
      {children}
      {required && (
        <> <span className="text-[#D4AF37]" aria-hidden="true">*</span><span className="sr-only"> (obrigatório)</span></>
      )}
    </label>
  )
}

/* ── Main page ──────────────────────────────────────────────── */
export default function NeuroEvalPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const totalSteps = 6

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleNext() { setStep(s => Math.min(s + 1, totalSteps)) }
  function handleBack() { setStep(s => Math.max(s - 1, 1)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formData.nome, email: formData.email, respostas: formData, data: new Date().toISOString() }),
      })
    } catch { /* fallback silently */ }
    setSubmitted(true)
  }

  const progress = Math.round((step / totalSteps) * 100)

  /* ── Submitted state ────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-selene-gradient flex flex-col">
        <Header tituloPagina="Avaliação Neurológica" variante="escuro" />
        <main className="flex-grow flex items-center justify-center px-6 py-16">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/40 p-10 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🌸</div>
            <h2 className="text-3xl font-serif text-[#3d2352] mb-3">Avaliação Enviada!</h2>
            <p className="text-[#6B4C9A] mb-6">
              Obrigado, <strong>{formData.nome || 'cliente'}</strong>! Nossa equipe entrará em contato em breve para agendar sua avaliação personalizada.
            </p>
            <a href="https://wa.me/5511915909002" target="_blank" rel="noopener noreferrer"
              className="btn-gold px-8 py-3 rounded-full text-sm inline-block mb-3">
              Falar pelo WhatsApp
            </a>
            <br />
            <button onClick={() => { setFormData(INITIAL); setStep(1); setSubmitted(false) }}
              className="text-sm text-[#6B4C9A] underline hover:text-[#3d2352] transition mt-2">
              Fazer nova avaliação
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col relative overflow-hidden">
      <Header tituloPagina="Avaliação Neurológica" variante="escuro" />

      {/* Orquídeas decorativas */}
      <OrchidDecor className="absolute top-20 left-0 w-40 h-40 opacity-20 pointer-events-none" side="left" />
      <OrchidDecor className="absolute bottom-20 right-0 w-52 h-52 opacity-20 pointer-events-none" side="right" />

      <main className="flex-grow relative z-10 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-8">
            <p className="text-[#3d2352] text-xs font-bold tracking-widest uppercase mb-2">Clínica Selene</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] mb-2">
              Avaliação Neurológica Integrativa
            </h1>
            <p className="text-[#6B4C9A] text-base">
              Responda às etapas abaixo para mapearmos seu perfil.
            </p>
          </div>

          {/* Main card — metallic glass */}
          <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 overflow-hidden">
            {/* Subtle inner glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#6B4C9A]/5 rounded-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-semibold text-[#6B4C9A] mb-2">
                <span>Etapa {step} de {totalSteps}</span>
                <span>{progress}% completo</span>
              </div>
              <div className="w-full bg-[#E8E0F0] rounded-full h-3 overflow-hidden border border-[#D4AF37]/30">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #D4AF37 0%, #F4E8C1 50%, #B8941F 100%)',
                  }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              {/* Step dots */}
              <div className="flex justify-between px-1 mt-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i + 1 < step  ? 'bg-[#D4AF37]' :
                    i + 1 === step ? 'bg-[#b38728] ring-2 ring-[#D4AF37]/40 ring-offset-1' :
                                    'bg-[#E8E0F0] border border-[#D4AF37]/30'
                  }`} aria-hidden="true" />
                ))}
              </div>
            </div>

            {/* Step content */}
            <form id="neuroeval-form" onSubmit={handleSubmit} noValidate>
              {step === 1 && <Step1 formData={formData} onChange={handleChange} />}
              {step === 2 && <Step2 formData={formData} onChange={handleChange} />}
              {step === 3 && <Step3 formData={formData} onChange={handleChange} />}
              {step === 4 && <Step4 formData={formData} onChange={handleChange} />}
              {step === 5 && <Step5 formData={formData} onChange={handleChange} />}
              {step === 6 && <Step6 formData={formData} onChange={handleChange} />}

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

                {step < totalSteps ? (
                  <button type="button" onClick={handleNext}
                    className="btn-gold px-8 py-3 rounded-full text-sm">
                    Próximo →
                  </button>
                ) : (
                  <button type="submit"
                    className="btn-gold px-8 py-3 rounded-full text-sm">
                    Finalizar Avaliação ✨
                  </button>
                )}
              </div>
            </form>
            </div>{/* /relative z-10 */}
          </div>

          {/* Footer note */}
          <p className="text-center mt-6 text-[#6B4C9A] text-xs">
            📍 Guarulhos-SP &amp; Lisboa, Portugal &nbsp;|&nbsp; 📱 (11) 91590-9002
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/* ── Step components ────────────────────────────────────────── */
type StepProps = { formData: FormData; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }

function Step1({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <StepHeader title="Dados Pessoais" subtitle="Informações básicas para o seu mapeamento" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <FieldLabel htmlFor="nome" required>Nome completo</FieldLabel>
          <input id="nome" name="nome" type="text" value={formData.nome} onChange={onChange} required placeholder="Digite seu nome completo" className={fieldCls} />
        </div>
        <div>
          <FieldLabel htmlFor="dataNascimento" required>Data de nascimento</FieldLabel>
          <input id="dataNascimento" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={onChange} required className={fieldCls} />
        </div>
        <div>
          <FieldLabel htmlFor="profissao">Profissão</FieldLabel>
          <input id="profissao" name="profissao" type="text" value={formData.profissao} onChange={onChange} placeholder="Sua profissão" className={fieldCls} />
        </div>
        <div>
          <FieldLabel htmlFor="email" required>E-mail</FieldLabel>
          <input id="email" name="email" type="email" value={formData.email} onChange={onChange} required placeholder="seu@email.com" className={fieldCls} />
        </div>
        <div>
          <FieldLabel htmlFor="telefone" required>Telefone / WhatsApp</FieldLabel>
          <input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={onChange} required placeholder="(11) 91590-9002" className={fieldCls} />
        </div>
      </div>
    </div>
  )
}

function Step2({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <StepHeader title="Queixa Principal" subtitle="Conte-nos sobre seus sintomas e desconfortos" />
      <div>
        <FieldLabel htmlFor="queixaPrincipal" required>Qual é sua principal queixa?</FieldLabel>
        <textarea id="queixaPrincipal" name="queixaPrincipal" value={formData.queixaPrincipal} onChange={onChange} required rows={4}
          placeholder="Descreva seus sintomas, dores ou desconfortos…" className={`${fieldCls} resize-none`} />
      </div>
      <div>
        <FieldLabel htmlFor="duracaoSintomas" required>Há quanto tempo sente esses sintomas?</FieldLabel>
        <select id="duracaoSintomas" name="duracaoSintomas" value={formData.duracaoSintomas} onChange={onChange} required className={fieldCls}>
          <option value="">Selecione…</option>
          <option value="menos-1-mes">Menos de 1 mês</option>
          <option value="1-3-meses">1 a 3 meses</option>
          <option value="3-6-meses">3 a 6 meses</option>
          <option value="6-12-meses">6 a 12 meses</option>
          <option value="mais-1-ano">Mais de 1 ano</option>
        </select>
      </div>
    </div>
  )
}

const STEP3_FIELDS: { id: keyof FormData; label: string; ph: string }[] = [
  { id: 'medicamentos',    label: 'Faz uso de algum medicamento? Qual?',  ph: 'Liste os medicamentos que toma regularmente…' },
  { id: 'alergias',        label: 'Possui alguma alergia?',               ph: 'Descreva suas alergias (se houver)…' },
  { id: 'doencasCronicas', label: 'Possui doenças crônicas?',             ph: 'Diabetes, hipertensão, etc…' },
  { id: 'cirurgias',       label: 'Já passou por alguma cirurgia?',       ph: 'Descreva as cirurgias realizadas…' },
]

function Step3({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <StepHeader title="Histórico Médico" subtitle="Medicamentos, alergias e condições existentes" />
      {STEP3_FIELDS.map(({ id, label, ph }) => (
        <div key={id}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <textarea id={id} name={id} value={formData[id] as string} onChange={onChange}
            rows={2} placeholder={ph} className={`${fieldCls} resize-none`} />
        </div>
      ))}
    </div>
  )
}

function Step4({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <StepHeader title="Estilo de Vida" subtitle="Hábitos que influenciam sua saúde e bem-estar" />

      <div>
        <FieldLabel required>Como avalia a qualidade do seu sono?</FieldLabel>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {['Ótimo', 'Bom', 'Regular', 'Ruim', 'Péssimo'].map(o => (
            <RadioPill key={o} name="sono" value={o.toLowerCase()} label={o}
              checked={formData.sono === o.toLowerCase()} onChange={onChange} />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel required>Como é sua alimentação?</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {['Saudável', 'Regular', 'Pouco saudável'].map(o => (
            <RadioPill key={o} name="alimentacao" value={o.toLowerCase().replace(/ /g, '-')} label={o}
              checked={formData.alimentacao === o.toLowerCase().replace(/ /g, '-')} onChange={onChange} />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="exercicios">Pratica exercícios físicos? Com que frequência?</FieldLabel>
        <select id="exercicios" name="exercicios" value={formData.exercicios} onChange={onChange} className={fieldCls}>
          <option value="">Selecione…</option>
          <option value="nao-pratica">Não pratico</option>
          <option value="1-2x">1 a 2 vezes por semana</option>
          <option value="3-4x">3 a 4 vezes por semana</option>
          <option value="5x-ou-mais">5 vezes ou mais</option>
        </select>
      </div>

      <div>
        <FieldLabel required>Como avalia seu nível de estresse?</FieldLabel>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'].map((o, i) => (
            <RadioPill key={o} name="estresse" value={String(i)} label={o}
              checked={formData.estresse === String(i)} onChange={onChange} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Step5({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <StepHeader title="Tratamentos Anteriores" subtitle="Terapias e abordagens já experimentadas" />
      <div>
        <FieldLabel htmlFor="terapiasAnteriores">Já fez algum tratamento ou terapia anteriormente?</FieldLabel>
        <textarea id="terapiasAnteriores" name="terapiasAnteriores" value={formData.terapiasAnteriores} onChange={onChange}
          rows={4} placeholder="Descreva tratamentos, terapias ou abordagens já experimentadas…" className={`${fieldCls} resize-none`} />
      </div>
      <div className="bg-[#E8E0F0]/60 border-2 border-[#D4AF37]/30 rounded-xl p-5">
        <h3 className="text-[#3d2352] font-bold mb-3">Nossas terapias disponíveis:</h3>
        <ul className="grid grid-cols-2 gap-1.5 text-sm text-[#3d2352]">
          {['Shiatsu', 'Quiropraxia', 'Reiki', 'Liberação Miofascial', 'Drenagem Linfática', 'Mentoria / Psicanálise', 'Hipnoterapia', 'TCC'].map(t => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="text-[#D4AF37] font-bold">✓</span> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Step6({ formData, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <StepHeader title="Expectativas e Objetivos" subtitle="O que você deseja alcançar com nosso tratamento?" />
      <div>
        <FieldLabel htmlFor="expectativas" required>Quais são suas principais expectativas?</FieldLabel>
        <textarea id="expectativas" name="expectativas" value={formData.expectativas} onChange={onChange} required
          rows={5} placeholder="Descreva o que espera alcançar com o tratamento na Clínica Selene…" className={`${fieldCls} resize-none`} />
      </div>
      <div className="rounded-xl p-5 border-2 border-[#D4AF37]/40"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(107,76,154,0.12) 100%)' }}>
        <h3 className="text-[#3d2352] font-bold text-base mb-2">✨ Pronto para começar sua jornada?</h3>
        <p className="text-[#3d2352] text-sm mb-3">
          Ao finalizar, nossa equipe entrará em contato para agendar sua avaliação personalizada.
        </p>
        <div className="flex items-center gap-2 text-sm text-[#3d2352]">
          <span>📞</span>
          <span><strong>WhatsApp:</strong> (11) 91590-9002</span>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-2xl font-serif text-[#3d2352] font-bold">{title}</h2>
      <p className="text-[#6B4C9A] text-sm mt-1">{subtitle}</p>
    </div>
  )
}

/* ── Decorative orchid SVG — metallic gold gradient fill ────── */
function OrchidDecor({ className, side }: { className?: string; side: 'left' | 'right' }) {
  const gradId = `og-${side}`
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ transform: side === 'left' ? undefined : 'scaleX(-1)' }}
    >
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
