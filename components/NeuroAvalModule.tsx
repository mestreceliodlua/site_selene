/**@fileoverview NeuroAvalModule - Módulo de Avaliação Neuropsicológica integrado ao Portal Selene Terapias
 * @version 2.1.0 - Integração com tema lilás/dourado da clínica
 */

import { useState, useEffect } from 'react'

// Definição das 6 etapas do questionário
const etapas = [
  {
    id: 1,
    titulo: 'Dados Pessoais',
    descricao: 'Informações básicas e histórico de saúde',
    campos: [
      { id: 'nomeCompleto', label: 'Nome completo *', type: 'text', required: true },
      { id: 'dataNascimento', label: 'Data de nascimento *', type: 'date', required: true },
      { id: 'email', label: 'E-mail *', type: 'email', required: true },
      { id: 'telefone', label: 'Telefone *', type: 'tel', required: true },
      { id: 'profissao', label: 'Profissão', type: 'text' },
    ],
  },
  {
    id: 2,
    titulo: 'Síntomas e Queixas',
    descricao: 'Principais sintomas e duração',
    campos: [
      { id: 'sintomasPrincipal', label: 'Sintoma principal *', type: 'select', required: true, options: ['Dor crônica', 'Tensão muscular', 'Dor de cabeça', 'Insônia', 'Ansiedade', 'Outros'] },
      { id: 'duracaoSintomas', label: 'Há quanto tempo apresenta esses sintomas? *', type: 'select', required: true, options: ['Menos de 1 mês', '1-3 meses', '3-6 meses', 'Mais de 6 meses'] },
      { id: 'intensidade', label: 'Nível de intensidade *', type: 'radio', required: true, options: ['Leve', 'Moderada', 'Severa'] },
      { id: 'localizacao', label: 'Localização da dor/desconforto *', type: 'text', required: true },
    ],
  },
  {
    id: 3,
    titulo: 'Histórico de Tratamentos',
    descricao: 'Tratamentos anteriores e eficácia',
    campos: [
      { id: 'tratamentosAnteriores', label: 'Já realizou algum tratamento anterior? *', type: 'radio', required: true, options: ['Não', 'Sim - fisioterapia', 'Sim - medicação', 'Sim - quiropraxia', 'Outros'] },
      { id: 'tratamentoEficacia', label: 'Quão eficaz foi o tratamento anterior? *', type: 'select', required: true, options: ['Nenhuma melhora', 'Melhoria moderada', 'Melhora significativa'] },
      { id: 'medicamentosAtuais', label: 'Medicamentos em uso atualmente', type: 'textarea' },
    ],
  },
  {
    id: 4,
    titulo: 'Fatores de Estilo de Vida',
    descricao: 'Rotina, exercícios e hábitos',
    campos: [
      { id: 'atividadeFisica', label: 'Pratica atividade física *', type: 'select', required: true, options: ['Não', 'Levemente', 'Moderadamente', 'Intensamente'] },
      { id: 'horasSono', label: 'Horas de sono por noite *', type: 'number', min: 0, max: 24 },
      { id: 'alimentacao', label: 'Avaliação da alimentação *', type: 'select', required: true, options: ['Ruim', 'Regular', 'Boa', 'Muito boa'] },
      { id: 'estresseNivel', label: 'Nível de estresse *', type: 'select', required: true, options: ['Baixo', 'Médio', 'Alto', 'Muito alto'] },
    ],
  },
  {
    id: 5,
    titulo: 'Histórico Familiar',
    descricao: 'Saúde dos familiares de primeiro grau',
    campos: [
      { id: 'historiaFamiliar', label: 'Histórico familiar de problemas neurológicos *', type: 'textarea', required: true },
      { id: 'doencasFamiliares', label: 'Algum familiar com histórico de:', type: 'multiselect', options: ['Dor crônica', 'Enxaqueca', 'Acidente vascular cerebral', 'Demência', 'Depressão'] },
    ],
  },
  {
    id: 6,
    titulo: 'Expectativas de Tratamento',
    descricao: 'Objetivos e expectativas',
    campos: [
      { id: 'objetivosTratamento', label: 'Principais objetivos com o tratamento *', type: 'textarea', required: true },
      { id: 'expectativas', label: 'Expectativas sobre a avaliação *', type: 'select', required: true, options: ['Esperançosas', 'Céticas', 'Indecisas', 'Medo de resultados'] },
      { id: 'consentimento', label: 'Consente com o tratamento proposto? *', type: 'radio', required: true, options: ['Sim', 'Não', 'Preciso de mais informações'] },
    ],
  },
]

export interface RespostaEtapa {
  [key: string]: string | string[] | number | boolean | null
}

interface UseNeuroEvalReturn {
  currentStep: number
  totalSteps: number
  formData: RespostaEtapa
  setFormData: (data: RespostaEtapa) => void
  handleNext: () => void
  handlePrev: () => void
  handleSubmit: (e: React.FormEvent) => void
  resetForm: () => void
  saveCurrentStep: () => void
  loadSavedData: () => void
  toggleTheme: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void
  theme: 'light' | 'dark'
}

export function useNeuroEval(): UseNeuroEvalReturn {
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(6)
  const [formData, setFormData] = useState<RespostaEtapa>({})
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('neuroeval_data')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('neuroeval_theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleNext = () => {
    setCurrentStep(currentStep < totalSteps ? currentStep + 1 : totalSteps)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep > 1 ? currentStep - 1 : 1)
  }

  const saveCurrentStep = () => {
    localStorage.setItem('neuroeval_data', JSON.stringify(formData))
    showToast('Dados da etapa salvos com sucesso!', 'success')
  }

  const loadSavedData = () => {
    const saved = localStorage.getItem('neuroeval_data')
    if (saved) {
      setFormData(JSON.parse(saved))
      showToast('Dados carregados do salvamento anterior.', 'info')
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    showToast(`Tema alterado para ${theme === 'dark' ? 'escuro' : 'claro'}`, 'info')
  }

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'info') => {
    const toast = document.getElementById('toast')
    if (!toast) return

    toast.textContent = message
    toast.className = `toast show ${type}`

    setTimeout(() => {
      toast.classList.remove('show')
    }, 3500)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Validar campos obrigatórios da etapa atual
    const currentEtapa = etapas[currentStep - 1]
    let isValid = true

    currentEtapa.campos.forEach((campo) => {
      if (campo.required) {
        const valor = formData[campo.id]
        if (!valor || (Array.isArray(valor) && valor.length === 0) || (typeof valor === 'string' && valor.trim() === '')) {
          isValid = false
        }
      }
    })

    if (!isValid) {
      showToast('Por favor, preencha todos os campos marcados com *.', 'warning')
      setIsSubmitting(false)
      return
    }

    // Salvar localStorage como backup
    saveCurrentStep()

    try {
      const resposta = await fetch('/api/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nomeCompleto || '',
          email: formData.email || '',
          respostas: formData,
          etapaAtual: currentStep,
          data: new Date().toISOString()
        })
      })

      const resultado = await resposta.json()

      if (resultado.success) {
        // Limpa dados temporários e vai para tela de sucesso
        localStorage.removeItem('neuroeval_data')
        setIsSubmitting(false)
        // Avança para a tela de resultado (Etapa 6)
        setCurrentStep(6)
        showToast('Avaliação enviada com sucesso!', 'success')
      } else {
        showToast('Erro ao enviar avaliação. Tente o WhatsApp.', 'error')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Erro na API:', error)
      // Fallback: usar WhatsApp se API falhar
      showToast('Erro de conexão. Use o WhatsApp para enviar seus dados.', 'warning')
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    localStorage.removeItem('neuroeval_data')
    setFormData({})
    setCurrentStep(1)
    document.getElementById('evaluationForm')?.reset()
    document.getElementById('evaluationForm')?.style.display = 'block'
    document.querySelector('.stepper')?.style.display = 'block'
    document.getElementById('postSubmitActions')?.style.display = 'none'
    showToast('Formulário resetado. Pronto para novo mapeamento!', 'success')
  }

  return {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    handleNext,
    handlePrev,
    handleSubmit,
    resetForm,
    saveCurrentStep,
    loadSavedData,
    toggleTheme,
    showToast,
    theme,
  }
}

/** Componente principal do NeuroEval com tema Selene */
export default function NeuroAvalModule() {
  const {
    currentStep,
    totalSteps,
    formData,
    handleNext,
    handlePrev,
    handleSubmit,
    resetForm,
    toggleTheme,
    showToast,
    theme,
  } = useNeuroEval()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const etapaAtual = etapas[currentStep - 1]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          id="themeToggle"
          onClick={toggleTheme}
          className="bg-[#d4af37] text-[#0a0e27] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition"
        >
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Formulário da Etapa Atual */}
      <form
        id="evaluationForm"
        onSubmit={handleSubmit}
        className="pt-32 pb-24"
      >
        {/* Progress Stepper */}
        <div className="stepper mb-16">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Etapa {currentStep} de {totalSteps}</span>
            <span className="text-sm text-gray-400">Progresso</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-[#d4af37] rounded-full h-3 transition-width"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Título e Progresso */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-[#d4af37] mb-4">
            {etapaAtual.titulo}
          </h2>
          <p className="text-gray-400">{etapaAtual.descricao}</p>
        </div>

        {/* Cards dos Campos */}
        <div className="grid md:grid-cols-2 gap-6">
          {etapaAtual.campos.map((campo) => (
            <div
              key={campo.id}
              className="group border-orange-500/20 rounded-lg p-6 backdrop-blur-sm orchid-corner transition-all"
              style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            >
              <h4 className="text-lg font-medium text-[#d4af37] mb-4">{campo.label}</h4>

              {/* Campo Texto Simples */}
              {campo.type === 'text' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    {campo.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={campo.id}
                    name={campo.id}
                    type="text"
                    value={formData[campo.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [campo.id]: e.target.value })
                    }
                    required={campo.required}
                    className="w-full bg-transparent border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] transition"
                  />
                </div>
              )

              {/* Campo Select */}
              {campo.type === 'select' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    {campo.required && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    id={campo.id}
                    name={campo.id}
                    value={formData[campo.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [campo.id]: e.target.value })
                    }
                    required={campo.required}
                    className="w-full bg-transparent border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] transition"
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    {campo.options?.map((opcao) => (
                      <option key={opcao} value={opcao}>
                        {opcao}
                      </option>
                    ))}
                  </select>
                </div>
              )

              {/* Campo Radio */}
              {campo.type === 'radio' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  {campo.options?.map((opcao) => (
                    <label key={opcao} className="flex items-center">
                      <input
                        type="radio"
                        name={campo.id}
                        value={opcao}
                        checked={formData[campo.id] === opcao}
                        onChange={(e) =>
                          setFormData({ ...formData, [campo.id]: e.target.value as string })
                        }
                        className="w-4 h-4 rounded border-gray-300 bg-white focus:ring-2 focus:ring-[#d4af37]"
                      />
                      <span className="ml-2 text-sm text-gray-300">{opcao}</span>
                    </label>
                  ))}
                </div>
              )

              {/* Campo Radio (2 opções) */}
              {campo.type === 'binary' && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  {campo.options?.map((opcao) => (
                    <label key={opcao} className="flex items-center">
                      <input
                        type="radio"
                        name={campo.id}
                        value={opcao}
                        checked={formData[campo.id] === opcao}
                        onChange={(e) =>
                          setFormData({ ...formData, [campo.id]: e.target.value as string })
                        }
                        className="w-4 h-4 rounded border-gray-300 bg-white focus:ring-2 focus:ring-[#d4af37]"
                      />
                      <span className="ml-2 text-sm text-gray-300">{opcao}</span>
                    </label>
                  ))}
                </div>
              )

              {/* Campo Textarea */}
              {campo.type === 'textarea' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    {campo.required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    id={campo.id}
                    name={campo.id}
                    rows={3}
                    value={formData[campo.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [campo.id]: e.target.value })
                    }
                    required={campo.required}
                    className="w-full bg-transparent border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] resize-none transition"
                  />
                </div>
              )

              {/* Campo Number */}
              {campo.type === 'number' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    {campo.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={campo.id}
                    name={campo.id}
                    type="number"
                    value={formData[campo.id] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [campo.id]: Number(e.target.value) || 0 })
                    }
                    required={campo.required}
                    className="w-full bg-transparent border border-gray-300 rounded px-3 py-2 text-white focus:outline-none focus:border-[#d4af37] transition"
                    min={campo.min ?? undefined}
                    max={campo.max ?? undefined}
                  />
                </div>
              )

              {/* Campo Multi-select */}
              {campo.type === 'multiselect' && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    {campo.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {campo.options?.map((opcao) => (
                      <label key={opcao} className="flex items-center px-3 py-1 border border-gray-300 rounded hover:border-[#d4af37] transition">
                        <input
                          type="checkbox"
                          name={campo.id}
                          value={opcao}
                          checked={formData[campo.id]?.includes(opcao)}
                          onChange={(e) => {
                            const valoresAtuais = formData[campo.id] as string[] || []
                            if (e.target.checked) {
                              setFormData({ ...formData, [campo.id]: [...valoresAtuais, opcao] })
                            } else {
                              setFormData({
                                ...formData,
                                [campo.id]: valoresAtuais.filter((v) => v !== opcao),
                              })
                            }
                          }
                        />
                        <span className="ml-2 text-sm text-gray{theme === 'dark' ? '200' : '300'}">
                          {opcao}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navegação */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="bg-transparent border border-gray-300 px-6 py-2 rounded text-sm text-gray-300 hover:bg-gray-700 transition"
              >
                Anterior
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#d4af37] text-[#0a0e27] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition next-btn"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d4af37] text-[#0a0e27] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar e Finalizar'}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Áreas de Devolutiva (apenas na última etapa) */}
      {currentStep === totalSteps && (
        <div id="postSubmitActions" className="mt-16 pt-8 border-t border-gray-700 hidden">
          <h2 className="text-3xl font-serif text-[#d4af37] mb-6">
            Resultado do Mapeamento
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl text-[#d4af37] mb-4">Perfil Identificado</h3>
              <p className="text-gray-400 text-sm">
                O mapeamento identificou padrões que auxiliam na definição de
                tratamento personalizado para suas necessidades específicas.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-[#d4af37] mb-4">Próximos Passos</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li>Agendar consulta de seguimento</li>
                <li>Receber plano de tratamento personalizado</li>
                <li>Acessar materiais de apoio ao tratamento</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={resetForm}
              className="bg-[#d4af37] text-[#0a0e27] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition mt-4"
            >
              Fazer novo mapeamento
            </button>
            <a
              href="/contato"
              className="mt-2 inline-block bg-gray-800 text-gray-300 px-6 py-3 rounded text-sm hover:bg-gray-700 transition"
            >
              Agendar via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}