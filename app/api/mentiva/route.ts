import { NextResponse } from 'next/server'

interface DadosMentiva {
  nome: string
  email: string
  respostas: any
  etapaAtual: number
  data: string
}

export async function POST(request: Request) {
  try {
    const body: DadosMentiva = await request.json()

    // Monta o prompt de ressignificação baseado na Terapia Integrativa do Movimento
    const prompt = `
      Como profissional da Terapia Integrativa do Movimento, realize uma ressignificação positiva a partir dos seguintes dados de avaliação neurocomportamental:

      Dados do paciente:
      - Nome: ${body.nome}
      - Etapa: ${body.etapaAtual}
      - Respostas principais: ${JSON.stringify(body.respostas, null, 2)}

      Orientação:
      - Use linguagem acolhedora, profunda e transformadora
      - Foque em padrões de movimento, bloqueios emocionais e potenciais de crescimento
      - Não faça diagnóstico clínico; ofereça ressignificação psicopedagógica
      - Termine com uma pergunta ou convite para sessão presencial
      - Use até 350 palavras
      - Portuguese language

      Retorne APENAS um objeto JSON com a chave "texto" contendo o texto gerado. Nenhum outro texto fora do JSON.
    `

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { texto: 'Serviço de IA temporariamente indisponível. Entre em contato com a clínica pelo WhatsApp.' },
        { status: 503 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Erro na API OpenAI')
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content ?? ''
    // The prompt asks the model to return a JSON object like {"texto": "..."}
    // Try to parse it; fall back to using the raw string directly.
    let texto = raw
    try {
      const parsed = JSON.parse(raw)
      if (parsed?.texto) texto = parsed.texto
    } catch {
      // raw is already plain text — use it as-is
    }
    if (!texto) texto = 'Não foi possível gerar a nova perspectiva no momento.'

    return NextResponse.json({ texto })
  } catch (error: any) {
    console.error('Erro no route /api/mentiva:', error)
    return NextResponse.json(
      { texto: 'Não foi possível gerar a nova perspectiva no momento. Tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}