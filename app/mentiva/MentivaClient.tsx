'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function MentivaClient() {
  const router = useRouter()
  const [fase, setFase] = useState<'intro' | 'pergunta' | 'devolutiva'>('intro')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const [nomeCliente, setNomeCliente] = useState('viajante')
  const [temperamento, setTemperamento] = useState('equilibrado')
  const [sinais, setSinais] = useState<string[]>([])

  const [pergunta, setPergunta] = useState('')
  const [resposta, setResposta] = useState('')
  const [devolutiva, setDevolutiva] = useState('')

  const [falando, setFalando] = useState(false)
  const relatorioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dados = sessionStorage.getItem('mentiva_data')
    if (dados) {
      try {
        const d = JSON.parse(dados)
        setNomeCliente(d.nome || 'viajante')
        setTemperamento(d.temperamento || 'equilibrado')
        setSinais(Array.isArray(d.alertas) ? d.alertas : [])
      } catch { /* ignore parse errors */ }
    }
  }, [])

  // ── Passo A: gerar a pergunta poderosa ──
  async function iniciarJornada() {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/mentiva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passo: 'pergunta', nome: nomeCliente, temperamento }),
      })
      const data = await res.json()
      if (!res.ok || !data.texto) throw new Error('sem resposta')
      setPergunta(data.texto)
      setFase('pergunta')
    } catch {
      setErro('Não consegui iniciar a jornada agora. Tente novamente em instantes.')
    } finally {
      setLoading(false)
    }
  }

  // ── Passo C: gerar a devolutiva do mentor ──
  async function enviarResposta() {
    if (resposta.trim().length < 3) return
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/mentiva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passo: 'feedback',
          nome: nomeCliente,
          temperamento,
          resposta,
          sinais,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.texto) throw new Error('sem resposta')
      setDevolutiva(data.texto)
      setFase('devolutiva')
    } catch {
      setErro('O mentor não conseguiu processar sua resposta agora. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // ── Voz do mentor (SpeechSynthesis, sem custo extra) ──
  function falar() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (falando) {
      window.speechSynthesis.cancel()
      setFalando(false)
      return
    }
    const utter = new SpeechSynthesisUtterance(devolutiva)
    utter.lang = 'pt-BR'
    utter.rate = 0.95
    utter.pitch = 0.9
    utter.onend = () => setFalando(false)
    window.speechSynthesis.speak(utter)
    setFalando(true)
  }

  function gerarPDF() {
    if (!relatorioRef.current) return
    import('html2pdf.js').then(({ default: html2pdf }) => {
      html2pdf()
        .set({
          margin: 15,
          filename: `Mentiva_${nomeCliente.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(relatorioRef.current!)
        .save()
    })
  }

  function enviarWhatsApp() {
    const resumo = devolutiva.substring(0, 250).replace(/\n/g, ' ')
    const msg = `Olá, Mestre Célio! Sou ${nomeCliente}. Acabei de fazer a jornada Mentiva (perfil ${temperamento}) e gostaria de agendar uma sessão para aprofundar esse trabalho. Resumo: ${resumo}`
    window.open(`https://wa.me/5511915909002?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (erro && fase === 'intro') {
    return (
      <div className="min-h-screen bg-[#E8E0F0] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <p className="text-red-600 mb-4">{erro}</p>
          <button onClick={() => router.push('/neuroeval')} className="bg-[#6B4C9A] text-white px-6 py-2 rounded hover:bg-[#9B7ED9] transition">
            Voltar ao Mapeamento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8E0F0] py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2">Mentiva</h1>
          <p className="text-[#6B4C9A] text-lg">Micro-mentoria guiada pela Terapia Integrativa do Movimento.</p>
        </div>

        {erro && (
          <p className="text-center text-red-600 mb-4">{erro}</p>
        )}

        {/* ── Intro / Contextualização ── */}
        {fase === 'intro' && (
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#D4AF37] text-center">
            <div className="text-5xl mb-4">🧘</div>
            <h2 className="text-2xl font-serif text-[#6B4C9A] mb-4">
              Olá, {nomeCliente}.
            </h2>
            <p className="text-[#2D2D2D] leading-relaxed mb-6">
              Com base no seu perfil <strong>{temperamento}</strong>, hoje vamos trabalhar o equilíbrio entre
              ação e presença. Esta é uma jornada curta de autoconhecimento — não um diagnóstico, mas um espelho
              gentil para você se mover com mais consciência.
            </p>
            <button
              onClick={iniciarJornada}
              disabled={loading}
              className="bg-[#6B4C9A] text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-[#9B7ED9] transition disabled:opacity-60"
            >
              {loading ? 'Preparando…' : '✨ Iniciar Jornada'}
            </button>
          </div>
        )}

        {/* ── Passo A: Pergunta Poderosa ── */}
        {fase === 'pergunta' && (
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#D4AF37]">
            <p className="text-xs uppercase tracking-widest text-[#6B4C9A] mb-2">Pergunta Poderosa</p>
            <p className="text-[#2D2D2D] leading-relaxed text-lg whitespace-pre-wrap mb-6">{pergunta}</p>
            <label className="block text-sm font-bold text-[#6B4C9A] mb-2">Sua resposta</label>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              rows={4}
              placeholder="Escreva o que vier ao coração…"
              className="w-full bg-[#F7F2FB] border-2 border-[#D4AF37]/40 rounded-xl px-4 py-3 text-[#2D2D2D] focus:outline-none focus:border-[#D4AF37] transition"
            />
            <button
              onClick={enviarResposta}
              disabled={loading || resposta.trim().length < 3}
              className="mt-4 bg-[#6B4C9A] text-white font-semibold py-3 px-8 rounded-lg shadow hover:bg-[#9B7ED9] transition disabled:opacity-60"
            >
              {loading ? 'O mentor está refletindo…' : 'Enviar resposta'}
            </button>
          </div>
        )}

        {/* ── Passo C: Devolutiva do Mentor ── */}
        {fase === 'devolutiva' && (
          <div>
            <div id="relatorio-mentiva" ref={relatorioRef} className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#D4AF37]">
              <div className="flex justify-center mb-6">
                <img src="/logo-selene.png" alt="Clínica Selene" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <h2 className="text-2xl font-serif text-[#6B4C9A] mb-4 text-center">Devolutiva do Mentor</h2>
              <p className="text-[#2D2D2D] leading-relaxed whitespace-pre-wrap text-lg">{devolutiva}</p>
              <p className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 italic text-center">
                Disclaimer: este é um material de psicoeducação e ressignificação gerado por IA com base no seu perfil.
                Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional na Clínica Selene.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <button onClick={falar} className="bg-[#6B4C9A] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#9B7ED9] transition">
                {falando ? '⏸️ Parar áudio' : '🔊 Ouvir como áudio'}
              </button>
              <button onClick={gerarPDF} className="bg-[#D4AF37] text-white font-semibold py-3 px-6 rounded-lg shadow hover:opacity-90 transition">
                📄 Baixar PDF
              </button>
              <button onClick={enviarWhatsApp} className="bg-[#25D366] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#128C7E] transition">
                📱 Falar com o Mestre Célio
              </button>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => router.push('/contato')}
                className="inline-block bg-gradient-to-r from-[#6B4C9A] to-[#3d2352] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition"
              >
                Agendar avaliação profissional na Clínica Selene →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
