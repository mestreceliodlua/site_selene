import { NextResponse } from 'next/server'

interface DadosMentiva {
  nome?: string
  temperamento?: string
  passo?: 'pergunta' | 'feedback'
  resposta?: string
  sinais?: string[]
}

const SYSTEM_PROMPT = `Você é um Mentor Integrativo da Clínica Selene, especializado no método "Terapia Integrativa do Movimento".
Sua base combina: TCC (reestruturação cognitiva), Psicanálise (escuta do inconsciente), Artes Marciais (disciplina e fluxo) e Sabedoria Holística (chacras e equilíbrio energético).
SUA LINGUAGEM: acolhedora, firme e metafórica. Nunca ríspida, nunca vazia.
REGRAS RÍGIDAS:
- NUNCA dê diagnóstico médico ou psiquiátrico. Você orienta, não patologiza.
- Mantenha tom de micro-mentoria: entregue UMA ideia por vez.
- Use referências sutis a chacras quando fizer sentido (ex: "leve a atenção ao seu Chacra Cardíaco").
- Responda sempre em português do Brasil, em texto puro (sem JSON, sem markdown de bloco).
- Seja breve: até 120 palavras por resposta.`

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DadosMentiva
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { texto: 'Serviço de mentoria temporariamente indisponível. Fale com a Clínica Selene pelo WhatsApp (11) 91590-9002.' },
        { status: 503 }
      )
    }

    const nome = body.nome || 'viajante'
    const temperamento = body.temperamento || 'equilibrado'

    let userContent: string
    if (body.passo === 'feedback') {
      const sinais = (body.sinais && body.sinais.length)
        ? `\nSinais de alerta mapeados no NeuroEval: ${body.sinais.join('; ')}.`
        : ''
      userContent = `Perfil do cliente: Temperamento ${temperamento}, nome ${nome}.${sinais}
Ele(a) respondeu à pergunta poderosa com: "${body.resposta || '(sem resposta)'}".
Gere a DEVOLUTIVA do mentor contendo:
1. Uma validação empática (reconheça a coragem de compartilhar).
2. Uma micro-tarefa gamificada e corporal baseada no temperamento (ex: respire fundo 3x focando no Chacra Cardíaco antes de responder àquela mensagem difícil).
3. Um convite final para sessão presencial na Clínica Selene.`
    } else {
      userContent = `Gere a PERGUNTA PODEROSA para um cliente de temperamento ${temperamento} chamado ${nome}.
A pergunta deve ser ÚNICA, profunda e específica para esse temperamento (ex: para Melancólico: "Onde o seu perfeccionismo está lhe custando paz hoje?"). Não explique, apenas faça a pergunta.`
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        temperature: 0.85,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData?.error?.message || 'Erro na API OpenAI')
    }

    const data = await response.json()
    const texto = data.choices?.[0]?.message?.content?.trim() || ''
    if (!texto) {
      throw new Error('Resposta vazia da IA')
    }

    return NextResponse.json({ texto })
  } catch (error: any) {
    console.error('Erro no route /api/mentiva:', error?.message || error)
    return NextResponse.json(
      { texto: 'Não foi possível gerar a mentoria no momento. Tente novamente ou fale conosco pelo WhatsApp (11) 91590-9002.' },
      { status: 500 }
    )
  }
}
