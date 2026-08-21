'use client'

/**
 * @fileoverview NeuroAvalModule — Módulo de Avaliação Neuropsicológica
 * @version 2.2.0 — Tema Selene Premium (lilás/dourado, glassmorphism escuro)
 */

import { useState, useEffect } from 'react'

/* ── Tipos ──────────────────────────────────────────────────── */
interface Campo {
  id: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  min?: number
  max?: number
}

interface Etapa {
  id: number
  titulo: string
  descricao: string
  campos: Campo[]
}

export interface RespostaEtapa {
  [key: string]: string | string[] | number | boolean | null
}

/* ── Etapas do questionário ─────────────────────────────────── */
const etapas: Etapa[] = [
  {
    id: 1,
    titulo: 'Dados Pessoais',
    descricao: 'Informações básicas e histórico de saúde',
    campos: [
      { id: 'nomeCompleto',    label: 'Nome completo',       type: 'text',  required: true },
      { id: 'dataNascimento',  label: 'Data de nascimento',  type: 'date',  required: true },
      { id: 'email',           label: 'E-mail',              type: 'email', required: true },
      { id: 'telefone',        label: 'Telefone',            type: 'tel',   required: true },
      { id: 'profissao',       label: 'Profissão',           type: 'text' },
    ],
  },
  {
    id: 2,
    titulo: 'Sintomas e Queixas',
    descricao: 'Principais sintomas e duração',
    campos: [
      {
        id: 'sintomasPrincipal', label: 'Sintoma principal', type: 'select', required: true,
        options: ['Dor crônica', 'Tensão muscular', 'Dor de cabeça', 'Insônia', 'Ansiedade', 'Outros'],
      },
      {
        id: 'duracaoSintomas', label: 'Há quanto tempo apresenta esses sintomas?', type: 'select', required: true,
        options: ['Menos de 1 mês', '1-3 meses', '3-6 meses', 'Mais de 6 meses'],
      },
      { id: 'intensidade',  label: 'Nível de intensidade',          type: 'radio', required: true, options: ['Leve', 'Moderada', 'Severa'] },
      { id: 'localizacao',  label: 'Localização da dor/desconforto', type: 'text',  required: true },
    ],
  },
  {
    id: 3,
    titulo: 'Histórico de Tratamentos',
    descricao: 'Tratamentos anteriores e eficácia',
    campos: [
      {
        id: 'tratamentosAnteriores', label: 'Já realizou algum tratamento anterior?', type: 'radio', required: true,
        options: ['Não', 'Sim — fisioterapia', 'Sim — medicação', 'Sim — quiropraxia', 'Outros'],
      },
      {
        id: 'tratamentoEficacia', label: 'Quão eficaz foi o tratamento anterior?', type: 'select', required: true,
        options: ['Nenhuma melhora', 'Melhoria moderada', 'Melhora significativa'],
      },
      { id: 'medicamentosAtuais', label: 'Medicamentos em uso atualmente', type: 'textarea' },
    ],
  },
  {
    id: 4,
    titulo: 'Estilo de Vida',
    descricao: 'Rotina, exercícios e hábitos',
    campos: [
      {
        id: 'atividadeFisica', label: 'Pratica atividade física?', type: 'select', required: true,
        options: ['Não', 'Levemente', 'Moderadamente', 'Intensamente'],
      },
      { id: 'horasSono',    label: 'Horas de sono por noite', type: 'number', min: 0, max: 24 },
      {
        id: 'alimentacao',  label: 'Avaliação da alimentação', type: 'select', required: true,
        options: ['Ruim', 'Regular', 'Boa', 'Muito boa'],
      },
      {
        id: 'estresseNivel', label: 'Nível de estresse', type: 'select', required: true,
        options: ['Baixo', 'Médio', 'Alto', 'Muito alto'],
      },
    ],
  },
  {
    id: 5,
    titulo: 'Histórico Familiar',
    descricao: 'Saúde dos familiares de primeiro grau',
    campos: [
      { id: 'historiaFamiliar',  label: 'Histórico familiar de problemas neurológicos', type: 'textarea', required: true },
      {
        id: 'doencasFamiliares', label: 'Familiar com histórico de:', type: 'multiselect',
        options: ['Dor crônica', 'Enxaqueca', 'Acidente vascular cerebral', 'Demência', 'Depressão'],
      },
    ],
  },
  {
    id: 6,
    titulo: 'Expectativas',
    descricao: 'Objetivos e expectativas com o tratamento',
    campos: [
      { id: 'objetivosTratamento', label: 'Principais objetivos com o tratamento', type: 'textarea', required: true },
      {
        id: 'expectativas', label: 'Expectativas sobre a avaliação', type: 'select', required: true,
        options: ['Esperançosas', 'Céticas', 'Indecisas', 'Preciso de mais informações'],
      },
      {
        id: 'consentimento', label: 'Consente com o tratamento proposto?', type: 'radio', required: true,
        options: ['Sim', 'Não', 'Preciso de mais informações'],
      },
    ],
  },
]

/* ── Shared input classes ───────────────────────────────────── */
// Light semi-transparent inputs on the dark glass card background
const inputCls =
  'w-full bg-white/10 border border-[#d4af37]/40 rounded-lg px-4 py-2.5 ' +
  'text-[#f0e8ff] placeholder-[#c8b6d6]/60 ' +
  'focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all'

const selectCls =
  'w-full bg-[#2a153b] border border-[#d4af37]/40 rounded-lg px-4 py-2.5 ' +
  'text-[#f0e8ff] ' +
  'focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all'

/* ── Componente principal ───────────────────────────────────── */
export default function NeuroAvalModule() {
  const [currentStep,  setCurrentStep]  = useState(1)
  const [formData,     setFormData]     = useState<RespostaEtapa>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [toast,        setToast]        = useState<{ msg: string; type: string } | null>(null)

  const totalSteps = etapas.length
  const etapaAtual = etapas[currentStep - 1]
  const progress   = Math.round((currentStep / totalSteps) * 100)

  /* Persist draft */
  useEffect(() => {
    const saved = localStorage.getItem('neuroeval_data')
    if (saved) {
      try { setFormData(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  function showToast(msg: string, type = 'info') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  function update(id: string, value: RespostaEtapa[string]) {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  function validate(): boolean {
    for (const campo of etapaAtual.campos) {
      if (!campo.required) continue
      const v = formData[campo.id]
      if (!v || (Array.isArray(v) && v.length === 0) || (typeof v === 'string' && !v.trim())) {
        showToast('Preencha todos os campos obrigatórios (*).', 'warning')
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (!validate()) return
    localStorage.setItem('neuroeval_data', JSON.stringify(formData))
    setCurrentStep(s => Math.min(s + 1, totalSteps))
  }

  function handlePrev() {
    setCurrentStep(s => Math.max(s - 1, 1))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    localStorage.setItem('neuroeval_data', JSON.stringify(formData))

    try {
      const res = await fetch('/api/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:       formData.nomeCompleto || '',
          email:      formData.email        || '',
          respostas:  formData,
          etapaAtual: currentStep,
          data:       new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.removeItem('neuroeval_data')
        setSubmitted(true)
        showToast('Avaliação enviada com sucesso!', 'success')
      } else {
        showToast('Erro ao enviar. Tente pelo WhatsApp.', 'error')
      }
    } catch {
      showToast('Erro de conexão. Use o WhatsApp para enviar seus dados.', 'warning')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    localStorage.removeItem('neuroeval_data')
    setFormData({})
    setCurrentStep(1)
    setSubmitted(false)
    showToast('Formulário resetado. Pronto para novo mapeamento!', 'success')
  }

  /* ── Tela de sucesso ───────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-5xl mb-6">🌸</div>
        <h2 className="text-3xl font-serif text-[#d4af37] mb-3">Avaliação Enviada!</h2>
        <p className="text-[#c8b6d6] mb-2">
          Em breve entraremos em contato com seu plano de tratamento personalizado.
        </p>
        <p className="text-[#c8b6d6] text-sm mb-8">
          Dúvidas? Fale conosco:{' '}
          <a href="https://wa.me/5511915909002" className="text-[#d4af37] underline">
            (11) 91590-9002
          </a>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            className="btn-gold px-8 py-3 rounded-full text-sm"
          >
            Fazer novo mapeamento
          </button>
          <a
            href="/agendamento"
            className="px-8 py-3 rounded-full text-sm font-semibold border border-[#d4af37]/50 text-[#f0e8ff] hover:border-[#d4af37] transition"
          >
            Agendar Sessão
          </a>
        </div>
      </div>
    )
  }

  /* ── Formulário ─────────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto">

      {/* Toast */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition-all ${
            toast.type === 'success' ? 'bg-green-700 text-white' :
            toast.type === 'error'   ? 'bg-red-700 text-white' :
            toast.type === 'warning' ? 'bg-[#b38728] text-[#2a153b]' :
                                       'bg-[#3d2352] text-[#f0e8ff] border border-[#d4af37]/40'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Barra de progresso ─────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-[#d4af37] tracking-widest uppercase">
            Etapa {currentStep} de {totalSteps}
          </span>
          <span className="text-xs text-[#c8b6d6]">{progress}% concluído</span>
        </div>
        <div className="w-full bg-[#1a0d2e] rounded-full h-2.5">
          <div
            className="bg-[#d4af37] rounded-full h-2.5 transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        {/* Etapa dots */}
        <div className="flex justify-between mt-2">
          {etapas.map((e) => (
            <div
              key={e.id}
              className={`w-2 h-2 rounded-full transition-all ${
                e.id < currentStep  ? 'bg-[#d4af37]' :
                e.id === currentStep ? 'bg-[#fcf6ba] ring-2 ring-[#d4af37]/50 ring-offset-1 ring-offset-transparent' :
                                      'bg-[#3d2352]'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* ── Cabeçalho da etapa ──────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif text-[#d4af37] mb-1">{etapaAtual.titulo}</h2>
        <p className="text-[#c8b6d6] text-sm">{etapaAtual.descricao}</p>
      </div>

      {/* ── Campos ──────────────────────────────────────────────── */}
      <form id="evaluationForm" onSubmit={handleSubmit} noValidate>
        <div className="grid md:grid-cols-2 gap-5">
          {etapaAtual.campos.map((campo) => (
            <FieldCard
              key={campo.id}
              campo={campo}
              value={formData[campo.id]}
              onChange={update}
            />
          ))}
        </div>

        {/* ── Navegação ─────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-[#d4af37]/20 flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-2.5 rounded-full text-sm font-semibold border border-[#d4af37]/40 text-[#f0e8ff] hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all"
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-gold px-8 py-2.5 rounded-full text-sm"
            >
              Próximo →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold px-8 py-2.5 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando…' : 'Enviar Avaliação ✓'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

/* ── FieldCard ──────────────────────────────────────────────── */
function FieldCard({
  campo,
  value,
  onChange,
}: {
  campo: Campo
  value: RespostaEtapa[string]
  onChange: (id: string, v: RespostaEtapa[string]) => void
}) {
  const str = (value as string) || ''
  const arr = Array.isArray(value) ? (value as string[]) : []

  return (
    <div className="rounded-xl p-5 bg-[#1A0D2E]/60 border border-[#d4af37]/20 hover:border-[#d4af37]/50 backdrop-blur-md shadow-lg shadow-[#6B4C9A]/10 transition-all duration-300">

      {/* Label */}
      <label
        htmlFor={campo.id}
        className="block text-sm font-semibold text-[#e8d8ff] mb-2 leading-snug"
      >
        {campo.label}
        {campo.required && (
          <>
            {' '}<span className="text-[#d4af37]" aria-hidden="true">*</span>
            <span className="sr-only">(obrigatório)</span>
          </>
        )}
      </label>

      {/* text / email / tel / date */}
      {(campo.type === 'text' || campo.type === 'email' || campo.type === 'tel' || campo.type === 'date') && (
        <input
          id={campo.id}
          name={campo.id}
          type={campo.type}
          value={str}
          onChange={e => onChange(campo.id, e.target.value)}
          required={campo.required}
          aria-required={campo.required}
          placeholder={campo.type === 'date' ? undefined : `Digite ${campo.label.toLowerCase().replace(' *', '')}`}
          className={inputCls}
        />
      )}

      {/* number */}
      {campo.type === 'number' && (
        <input
          id={campo.id}
          name={campo.id}
          type="number"
          value={str}
          onChange={e => onChange(campo.id, Number(e.target.value) || 0)}
          required={campo.required}
          aria-required={campo.required}
          min={campo.min}
          max={campo.max}
          className={inputCls}
        />
      )}

      {/* select */}
      {campo.type === 'select' && (
        <select
          id={campo.id}
          name={campo.id}
          value={str}
          onChange={e => onChange(campo.id, e.target.value)}
          required={campo.required}
          aria-required={campo.required}
          className={selectCls}
        >
          <option value="" disabled>Selecione uma opção</option>
          {campo.options?.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}

      {/* radio */}
      {(campo.type === 'radio' || campo.type === 'binary') && (
        <fieldset>
          <legend className="sr-only">{campo.label}</legend>
          <div className="flex flex-wrap gap-3 mt-1">
            {campo.options?.map(opcao => (
              <label
                key={opcao}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all ${
                  value === opcao
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f0e8ff]'
                    : 'border-[#d4af37]/25 text-[#c8b6d6] hover:border-[#d4af37]/60'
                }`}
              >
                <input
                  type="radio"
                  name={campo.id}
                  value={opcao}
                  checked={value === opcao}
                  onChange={e => onChange(campo.id, e.target.value)}
                  className="sr-only"
                  aria-required={campo.required}
                />
                {opcao}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* textarea */}
      {campo.type === 'textarea' && (
        <textarea
          id={campo.id}
          name={campo.id}
          rows={3}
          value={str}
          onChange={e => onChange(campo.id, e.target.value)}
          required={campo.required}
          aria-required={campo.required}
          placeholder={`Descreva ${campo.label.toLowerCase().replace(' *', '')}…`}
          className={`${inputCls} resize-none`}
        />
      )}

      {/* multiselect checkboxes */}
      {campo.type === 'multiselect' && (
        <fieldset>
          <legend className="sr-only">{campo.label}</legend>
          <div className="flex flex-col gap-2 mt-1">
            {campo.options?.map(opcao => {
              const checked = arr.includes(opcao)
              return (
                <label
                  key={opcao}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-all ${
                    checked
                      ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f0e8ff]'
                      : 'border-[#d4af37]/25 text-[#c8b6d6] hover:border-[#d4af37]/60'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={campo.id}
                    value={opcao}
                    checked={checked}
                    onChange={e => {
                      const next = e.target.checked
                        ? [...arr, opcao]
                        : arr.filter(v => v !== opcao)
                      onChange(campo.id, next)
                    }}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
                      checked ? 'bg-[#d4af37] border-[#d4af37]' : 'border-[#d4af37]/40'
                    }`}
                    aria-hidden="true"
                  >
                    {checked && (
                      <svg className="w-2.5 h-2.5 text-[#2a153b]" viewBox="0 0 10 8" fill="currentColor">
                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {opcao}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
