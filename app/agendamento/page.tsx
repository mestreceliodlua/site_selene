'use client'
import { useState, type FormEvent } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const SERVICOS = [
  'Shiatsu', 'Quiropraxia', 'Reiki', 'Liberação Miofascial',
  'Drenagem Linfática', 'Mentoria / Psicanálise',
  'Terapia Cognitivo-Comportamental', 'Hipnoterapia', 'Avaliação Neurológica',
]

type Tab = 'agendar' | 'contato' | 'whatsapp'

export default function AgendamentoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('agendar')
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', servico: '', data: '', hora: '', mensagem: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviado(true)
  }

  const fieldCls =
    'w-full bg-gradient-to-br from-white/90 to-[#f8f4fc] border-2 border-[#D4AF37]/50 rounded-xl px-4 py-3 ' +
    'text-[#2D2D2D] placeholder-[#999] shadow-sm ' +
    'focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/25 hover:shadow-md transition-all'

  const TABS: { id: Tab; label: string }[] = [
    { id: 'agendar',   label: '📅 Agendar Sessão' },
    { id: 'contato',   label: '✉️ Fale Conosco' },
    { id: 'whatsapp',  label: '💬 WhatsApp' },
  ]

  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col relative overflow-hidden">
      <Header tituloPagina="Agendamento & Contato" variante="transparente" />

      {/* Orquídeas douradas decorativas */}
      <OrchidCorner className="absolute top-14 left-0 w-56 h-72 opacity-85 pointer-events-none" side="left" />
      <OrchidCorner className="absolute bottom-14 right-0 w-64 h-80 opacity-85 pointer-events-none" side="right" />

      <main className="flex-grow relative z-10 px-4 sm:px-6 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] font-bold mb-2">
              Agendamento &amp; Contato
            </h1>
            <p className="text-[#6B4C9A]">Escolha a melhor forma de se conectar conosco</p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-full p-1.5 shadow-lg border-2 border-[#D4AF37]/40 inline-flex gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEnviado(false) }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'text-[#2a153b] shadow-md'
                      : 'text-[#3d2352] hover:bg-white/60'
                  }`}
                  style={activeTab === tab.id
                    ? { background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 40%, #b38728 100%)' }
                    : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-6 md:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#6B4C9A]/5 rounded-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">

              {/* ── TAB: Agendar ─────────────────────────────── */}
              {activeTab === 'agendar' && (
                enviado ? (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-4">🌸</div>
                    <h2 className="text-3xl font-serif text-[#3d2352] mb-3">Solicitação Recebida!</h2>
                    <p className="text-[#6B4C9A] mb-6">
                      Obrigado, <strong>{form.nome || 'cliente'}</strong>! Entraremos em contato em breve para confirmar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a href="https://wa.me/5511915909002" target="_blank" rel="noopener noreferrer"
                        className="btn-gold px-8 py-3 rounded-full text-sm">
                        Confirmar pelo WhatsApp
                      </a>
                      <button onClick={() => setEnviado(false)}
                        className="text-sm text-[#6B4C9A] underline hover:text-[#3d2352] transition">
                        Novo agendamento
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-serif text-[#3d2352] font-bold mb-1">Agende Sua Sessão</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="ag-nome" className="block text-sm font-bold text-[#3d2352] mb-1">
                          Nome completo <span className="text-[#D4AF37]" aria-hidden="true">*</span>
                        </label>
                        <input id="ag-nome" name="nome" type="text" required value={form.nome} onChange={handleChange}
                          placeholder="Seu nome" className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="ag-email" className="block text-sm font-bold text-[#3d2352] mb-1">
                          E-mail <span className="text-[#D4AF37]" aria-hidden="true">*</span>
                        </label>
                        <input id="ag-email" name="email" type="email" required value={form.email} onChange={handleChange}
                          placeholder="seu@email.com" className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="ag-tel" className="block text-sm font-bold text-[#3d2352] mb-1">
                          Telefone <span className="text-[#D4AF37]" aria-hidden="true">*</span>
                        </label>
                        <input id="ag-tel" name="telefone" type="tel" required value={form.telefone} onChange={handleChange}
                          placeholder="(11) 91590-9002" className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="ag-servico" className="block text-sm font-bold text-[#3d2352] mb-1">
                          Serviço desejado <span className="text-[#D4AF37]" aria-hidden="true">*</span>
                        </label>
                        <select id="ag-servico" name="servico" required value={form.servico} onChange={handleChange} className={fieldCls}>
                          <option value="">Selecione…</option>
                          {SERVICOS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ag-data" className="block text-sm font-bold text-[#3d2352] mb-1">
                          Data preferida <span className="text-[#D4AF37]" aria-hidden="true">*</span>
                        </label>
                        <input id="ag-data" name="data" type="date" required value={form.data} onChange={handleChange} className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="ag-hora" className="block text-sm font-bold text-[#3d2352] mb-1">Horário preferido</label>
                        <input id="ag-hora" name="hora" type="time" value={form.hora} onChange={handleChange} className={fieldCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ag-msg" className="block text-sm font-bold text-[#3d2352] mb-1">Mensagem adicional</label>
                      <textarea id="ag-msg" name="mensagem" rows={3} value={form.mensagem} onChange={handleChange}
                        placeholder="Conte-nos mais sobre o que você precisa…"
                        className={`${fieldCls} resize-none`} />
                    </div>
                    <div className="text-center pt-2">
                      <button type="submit" className="btn-gold px-10 py-4 rounded-full text-base font-bold">
                        ✨ Solicitar Agendamento
                      </button>
                    </div>
                  </form>
                )
              )}

              {/* ── TAB: Contato ──────────────────────────────── */}
              {activeTab === 'contato' && (
                <div>
                  <h2 className="text-2xl font-serif text-[#3d2352] font-bold mb-6 text-center">Fale Conosco</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-gradient-to-br from-[#E8E0F0]/60 to-[#F5F0FA]/60 border-2 border-[#D4AF37]/40 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#3d2352] mb-4">📍 Localização</h3>
                      <p className="text-[#6B4C9A] text-sm font-semibold mb-1">Endereço:</p>
                      <p className="text-[#2D2D2D] text-sm">Guarulhos — SP, Brasil</p>
                      <p className="text-[#2D2D2D] text-sm">Lisboa, Portugal</p>
                      <p className="text-[#6B4C9A] text-sm font-semibold mt-4 mb-1">Atendimento:</p>
                      <p className="text-[#2D2D2D] text-sm">Segunda a Sexta: 9h – 19h</p>
                      <p className="text-[#2D2D2D] text-sm">Sábado: 9h – 13h</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#E8E0F0]/60 to-[#F5F0FA]/60 border-2 border-[#D4AF37]/40 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-[#3d2352] mb-4">📱 Canais de Atendimento</h3>
                      <p className="text-[#6B4C9A] text-sm font-semibold mb-1">WhatsApp:</p>
                      <a href="https://wa.me/5511915909002" target="_blank" rel="noopener noreferrer"
                        className="text-[#b38728] font-bold hover:underline">(11) 91590-9002</a>
                      <p className="text-[#6B4C9A] text-sm font-semibold mt-4 mb-1">E-mail:</p>
                      <a href="mailto:contato@clinicaselene.pt"
                        className="text-[#b38728] text-sm hover:underline">contato@clinicaselene.pt</a>
                      <p className="text-[#6B4C9A] text-sm font-semibold mt-4 mb-1">Instagram:</p>
                      <p className="text-[#2D2D2D] text-sm">@ClinicaSelene</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <a href="/agendamento" onClick={() => setActiveTab('agendar')}
                      className="btn-gold px-8 py-3 rounded-full text-sm font-bold inline-block cursor-pointer">
                      Agendar pelo Formulário
                    </a>
                  </div>
                </div>
              )}

              {/* ── TAB: WhatsApp ─────────────────────────────── */}
              {activeTab === 'whatsapp' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-5">💬</div>
                  <h2 className="text-2xl font-serif text-[#3d2352] font-bold mb-3">
                    Atendimento Rápido pelo WhatsApp
                  </h2>
                  <p className="text-[#6B4C9A] mb-8">Clique no botão abaixo e fale diretamente conosco!</p>
                  <a href="https://wa.me/5511915909002?text=Olá! Gostaria de agendar uma sessão na Clínica Selene."
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Conversar no WhatsApp
                  </a>
                  <p className="text-[#6B4C9A] mt-5 text-sm">
                    Ou adicione: <strong className="text-[#3d2352]">(11) 91590-9002</strong>
                  </p>
                </div>
              )}
            </div>{/* /relative z-10 */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/* ── Orchid corner for agendamento page ─────────────────────── */
function OrchidCorner({ side, className }: { side: 'left' | 'right'; className?: string }) {
  const gid = `ag-og-${side}`
  return (
    <svg className={className} viewBox="0 0 140 200" fill="none" aria-hidden="true"
      style={{ transform: side === 'left' ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#bf953f" />
          <stop offset="40%"  stopColor="#fcf6ba" />
          <stop offset="100%" stopColor="#aa771c" />
        </linearGradient>
      </defs>
      <path d="M80 195 Q85 160 82 130 Q78 100 84 60 Q87 40 80 10" stroke="#b38728" strokeWidth="3" fill="none" />
      <path d="M80 130 Q60 110 45 120" stroke="#b38728" strokeWidth="2" fill="none" />
      {[
        { x: 80, y: 25,  r: 0,   s: 1 },
        { x: 84, y: 75,  r: 15,  s: 1 },
        { x: 45, y: 125, r: -20, s: 0.8 },
        { x: 82, y: 140, r: 5,   s: 0.9 },
      ].map(({ x, y, r, s }, i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          {[0, 72, 144, 216, 288].map((a, j) => (
            <ellipse key={j} cx={0} cy={0} rx={14 * s} ry={7 * s}
              fill={`url(#${gid})`} opacity="0.88"
              transform={`rotate(${a}) translate(0,${-9 * s})`} />
          ))}
          <circle r={5 * s} fill="#fcf6ba" opacity="0.95" />
          <circle r={2.5 * s} fill="#b38728" />
        </g>
      ))}
      <path d="M80 95 Q55 80 40 95 Q58 82 80 95Z" fill="#8a6a10" opacity="0.45" />
      <path d="M82 150 Q108 138 118 155 Q100 140 82 150Z" fill="#8a6a10" opacity="0.45" />
    </svg>
  )
}
