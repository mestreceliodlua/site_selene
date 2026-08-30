import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('[API] GEMINI_API_KEY não configurada no servidor');
      return NextResponse.json(
        { error: 'Chave da API não configurada. Entre em contato com o suporte.' },
        { status: 500 }
      );
    }

    const { mapeamento } = await request.json();
    if (!mapeamento) {
      return NextResponse.json({ error: 'Mapeamento não fornecido' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Você é um profissional sênior em saúde mental integrativa, com especialização em Neurociência, Terapia Cognitivo-Comportamental (TCC), Hipnose Clínica, Psicanálise e Mentoria Comportamental.

Abaixo está o MAPEAMENTO COMPLETO de um paciente. Com base EXCLUSIVAMENTE nestes dados, elabore uma ANÁLISE TERAPÊUTICA ESTRUTURADA.

REGRAS OBRIGATÓRIAS:
1. Use APENAS os dados do mapeamento. Não invente sintomas.
2. Seja específico: cite os scores e níveis de alerta reais.
3. Se o nível de alerta for "Alto", destaque isso com urgência.
4. Se houver tensão muscular/estresse corporal, inclua a seção de dores.
5. Linguagem empática, profissional e acolhedora.
6. NÃO faça diagnóstico clínico fechado — use termos como "indicadores compatíveis com", "sinais de atenção para".

ESTRUTURA OBRIGATÓRIA DA RESPOSTA (use estes títulos em negrito):

🎯 **SÍNTESE DO PERFIL**
(2-3 frases conectando temperamento + principais alertas)

🧠 **ABORDAGEM EM NEUROCIÊNCIA**
(Como o cérebro deste perfil funciona. Neuroplasticidade, regulação emocional. 3-4 frases.)

💭 **ABORDAGEM EM TERAPIA COGNITIVO-COMPORTAMENTAL (TCC)**
(Distorções cognitivas prováveis, técnicas sugeridas. 3-4 frases.)

🌀 **ABORDAGEM EM HIPNOSE CLÍNICA**
(Sugestões hipnóticas adequadas ao perfil. 3-4 frases.)

🔍 **ABORDAGEM EM PSICANÁLISE**
(Mecanismos de defesa prováveis, dinâmicas inconscientes. 3-4 frases.)

🧭 **ABORDAGEM EM MENTORIA**
(Plano de ação comportamental, micro-tarefas semanais. 3-4 frases práticas.)

💪 **RELAÇÃO COM DORES MUSCULARES E PSICOSSOMÁTICA**
(Aparece APENAS se o mapeamento indicar tensão muscular. Conecte emoções com regiões do corpo. 3-4 frases.)

⚠️ **ENCAMINHAMENTOS RECOMENDADOS**
(Se algum alerta for "Alto", recomende avaliação profissional.)

---
MAPEAMENTO DO PACIENTE:
${mapeamento}
---`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoAnalise = response.text();

    return NextResponse.json({ analise: textoAnalise });
  } catch (error: any) {
    console.error('[API] Erro detalhado:', {
      message: error?.message,
      status: error?.status,
      stack: error?.stack?.split('\n').slice(0, 3).join('\n')
    });

    const mensagemUsuario = error?.message?.includes('API_KEY')
      ? 'Chave da API inválida. Entre em contato com o suporte.'
      : error?.message?.includes('quota')
      ? 'Limite de uso da IA atingido. Tente novamente em alguns minutos.'
      : 'Erro ao gerar análise. Tente novamente em instantes.';

    return NextResponse.json({ error: mensagemUsuario }, { status: 500 });
  }
}
