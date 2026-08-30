import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { mapeamento } = await request.json();
    if (!mapeamento) {
      return NextResponse.json({ error: 'Mapeamento não fornecido' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Você é um profissional sênior em saúde mental integrativa, com especialização em Neurociência, Terapia Cognitivo-Comportamental (TCC), Hipnose Clínica, Psicanálise e Mentoria Comportamental.

Abaixo está o MAPEAMENTO COMPLETO de um paciente. Com base EXCLUSIVAMENTE nestes dados, elabore uma ANÁLISE TERAPÊUTICA ESTRUTURADA.

REGRAS OBRIGATÓRIAS:
1. Use APENAS os dados do mapeamento. Não invente sintomas ou características.
2. Seja específico: cite os scores e níveis de alerta reais.
3. Se o nível de alerta for "Alto", destaque isso com urgência.
4. Se houver tensão muscular/estresse corporal, inclua a seção de dores.
5. Linguagem empática, profissional e acolhedora.
6. NÃO faça diagnóstico clínico fechado — use termos como "indicadores compatíveis com", "sinais de atenção para".

ESTRUTURA OBRIGATÓRIA DA RESPOSTA (use estes títulos em negrito):

**SÍNTESE DO PERFIL**
(2-3 frases conectando temperamento + principais alertas)

**ABORDAGEM EM NEUROCIÊNCIA**
(Como o cérebro deste perfil funciona. Neuroplasticidade, regulação emocional, sistemas de recompensa. 3-4 frases.)

**ABORDAGEM EM TERAPIA COGNITIVO-COMPORTAMENTAL (TCC)**
(Distorções cognitivas prováveis, técnicas sugeridas: reestruturação cognitiva, exposição, registro de pensamentos. 3-4 frases.)

**ABORDAGEM EM HIPNOSE CLÍNICA**
(Sugestões hipnóticas adequadas ao perfil, estados de trance indicados, metas terapêuticas via hipnose. 3-4 frases.)

**ABORDAGEM EM PSICANÁLISE**
(Mecanismos de defesa prováveis, dinâmicas inconscientes, questões transferenciais. 3-4 frases.)

**ABORDAGEM EM MENTORIA**
(Plano de ação comportamental, micro-tarefas semanais, hábitos a construir. 3-4 frases com sugestões práticas.)

**RELAÇÃO COM DORES MUSCULARES E PSICOSSOMÁTICA**
(Aparece APENAS se o mapeamento indicar tensão muscular/estresse corporal. Conecte emoções reprimidas com regiões do corpo: ombros/pescoço = responsabilidade excessiva; mandíbula = raiva contida; lombar = insegurança financeira; costas = peso emocional. 3-4 frases.)

**ENCAMINHAMENTOS RECOMENDADOS**
(Se algum alerta for "Alto", recomende avaliação com psiquiatra/psicólogo. Sempre inclua: "Este material é de psicoeducação e não substitui avaliação clínica.")

---
MAPEAMENTO DO PACIENTE:
${mapeamento}
---
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textoAnalise = response.text();

    return NextResponse.json({ analise: textoAnalise });
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    return NextResponse.json({ error: 'Falha ao gerar análise' }, { status: 500 });
  }
}
