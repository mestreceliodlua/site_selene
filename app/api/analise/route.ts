import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mapeamento } = await request.json();
    if (!mapeamento) {
      return NextResponse.json({ error: 'Mapeamento não fornecido' }, { status: 400 });
    }

    const analise = gerarAnaliseLocal(mapeamento);
    return NextResponse.json({ analise });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

function gerarAnaliseLocal(mapeamento: string): string {
  const dominante = mapeamento.includes('COLÉRICO') ? 'Colérico' :
                    mapeamento.includes('SANGUÍNEO') ? 'Sanguíneo' :
                    mapeamento.includes('MELANCÓLICO') ? 'Melancólico' : 'Fleumático';

  const tdahAlto = mapeamento.includes('TDAH: Alto');
  const teaAlto = mapeamento.includes('TEA') && mapeamento.includes('Alto');
  const tagAlto = mapeamento.includes('TAG') && mapeamento.includes('Alto');
  const borderAlto = mapeamento.includes('Borderline') && mapeamento.includes('Alto');
  const narcAlto = mapeamento.includes('Narcisistas') && mapeamento.includes('Alto');
  const psicAlto = mapeamento.includes('Psicopatia') && mapeamento.includes('Alto');
  const dorAlta = mapeamento.includes('tensão muscular') && mapeamento.includes('Alto');
  const dorMod = mapeamento.includes('tensão muscular') && mapeamento.includes('Moderado');

  let sintese = '';
  if (dominante === 'Colérico') {
    sintese = `Perfil predominantemente Colérico, indicando uma pessoa de ação, foco e determinação. Tende a liderar situações e buscar resultados, mas pode acumular tensão e dificuldade em delegar.`;
  } else if (dominante === 'Sanguíneo') {
    sintese = `Perfil predominantemente Sanguíneo, indicando uma pessoa comunicativa, sociável e entusiasta. Tende a inspirar os outros, mas pode ter dificuldade com foco prolongado e rotinas estruturadas.`;
  } else if (dominante === 'Melancólico') {
    sintese = `Perfil predominantemente Melancólico, indicando uma pessoa analítica, sensível e perfeccionista. Tende à profundidade e qualidade, mas pode lutar com autocrítica e ruminação.`;
  } else {
    sintese = `Perfil predominantemente Fleumático, indicando uma pessoa calma, paciente e equilibrada. Tende à estabilidade e mediação, mas pode ter dificuldade em tomar iniciativas e expressar necessidades.`;
  }

  let neuro = '';
  if (tagAlto) {
    neuro = `O sistema nervoso apresenta sinais de hiperativação simpática (luta/fuga). Recomenda-se práticas de regulação do nervo vago: respiração diafragmática (4-7-8), exposição ao frio, e exercícios de grounding para ativar o sistema parassimpático. A neuroplasticidade permite reprogramar padrões de alerta através de práticas consistentes.`;
  } else if (tdahAlto) {
    neuro = `Indicadores sugerem possíveis desafios nas funções executivas do córtex pré-frontal (foco, planejamento, inibição). Dopamina e noradrenalina podem estar desreguladas. Estratégias como exercícios aeróbicos, sono regular e técnicas de "body doubling" podem auxiliar na modulação neuroquímica.`;
  } else if (dominante === 'Colérico') {
    neuro = `O perfil Colérico está associado a alta ativação do sistema dopaminérgico (busca por recompensa e conquista). O desafio neurobiológico é equilibrar a excitação com momentos de recuperação, permitindo que o sistema nervoso parassimpático atue e previna o esgotamento.`;
  } else if (dominante === 'Sanguíneo') {
    neuro = `O perfil Sanguíneo apresenta alta sensibilidade ao sistema de recompensa social (oxitocina e dopamina). O desafio é desenvolver circuitos de autorregulação que permitam foco sustentado sem perda da vitalidade característica.`;
  } else if (dominante === 'Melancólico') {
    neuro = `O perfil Melancólico apresenta alta atividade em regiões de processamento emocional profundo (ínsula, córtex cingulado anterior). O desafio é interromper ciclos de ruminação através de técnicas que ativem o córtex pré-frontal e tragam o foco para o presente.`;
  } else {
    neuro = `O perfil Fleumático apresenta equilíbrio neuroquímico, com tendência à homeostase. O desafio é estimular a ativação dopaminérgica necessária para iniciativa e tomada de decisão, sem perder a estabilidade característica.`;
  }

  let tcc = '';
  if (tagAlto) {
    tcc = `Trabalhar reestruturação cognitiva das crenças de ameaça ("e se algo der errado?"). Técnicas recomendadas: registro de pensamentos automáticos, exposição gradual, e treinamento em tolerância à incerteza. Mindfulness baseado em evidências (MBCT) é altamente indicado.`;
  } else if (tdahAlto) {
    tcc = `Foco em estratégias comportamentais para funções executivas: uso de agendas externas, técnica Pomodoro, decomposição de tarefas, e treinamento em habilidades organizacionais. Terapia cognitiva para crenças de "não sou capaz" que frequentemente acompanham o TDAH.`;
  } else if (borderAlto) {
    tcc = `Indicadores sugerem necessidade de DBT (Dialectical Behavior Therapy): treinamento em tolerância ao sofrimento, regulação emocional, eficácia interpessoal e mindfulness. Trabalho com a "mente sábia" e validação emocional são centrais.`;
  } else if (dominante === 'Colérico') {
    tcc = `Identificar crenças centrais de desempenho ("preciso ser perfeito", "não posso falhar"). Trabalhar a flexibilidade cognitiva e a distinção entre controle e influência. Técnicas de auto-compaixão para equilibrar a autocrítica severa típica do perfil.`;
  } else if (dominante === 'Sanguíneo') {
    tcc = `Trabalhar crenças de "preciso ser amado por todos" e a dificuldade com tarefas não estimulantes. Técnicas de ativação comportamental e estabelecimento de rotinas com recompensas imediatas para manter o engajamento.`;
  } else if (dominante === 'Melancólico') {
    tcc = `Trabalhar padrões de pensamento dicotômico ("tudo ou nada"), catastrofização e leitura mental. Técnicas de reestruturação cognitiva focadas em evidências e experimentos comportamentais para testar crenças perfeccionistas.`;
  } else {
    tcc = `Trabalhar a ativação comportamental e o enfrentamento de situações evitadas. Identificar crenças de "não vale a pena" ou "não sou importante o suficiente". Técnicas de estabelecimento de metas e auto-monitoramento.`;
  }

  let hipnose = '';
  if (dorAlta || dorMod) {
    hipnose = `A hipnose clínica é altamente indicada para o manejo da dor psicossomática. Técnicas de analgesia hipnótica, regressão etiológica para identificar a origem emocional da tensão, e sugestões de "soltar a armadura muscular" podem trazer alívio significativo. Protocolo de 4 a 6 sessões recomendado.`;
  } else if (tagAlto) {
    hipnose = `Hipnose ericksoniana para indução de estados de calma profunda. Sugestões de "lugar seguro", metáforas de soltar o controle, e ancoragem de recursos internos. Auto-hipnose como ferramenta complementar para crises de ansiedade.`;
  } else if (tdahAlto) {
    hipnose = `Hipnose para fortalecimento do foco e concentração. Técnicas de "cinema mental" para treinar atenção sustentada, e sugestões pós-hipnóticas para gatilhos de organização e conclusão de tarefas.`;
  } else if (dominante === 'Colérico') {
    hipnose = `Hipnose para trabalhar a permissão para descansar e soltar o controle. Sugestões de "você já fez o suficiente" e metáforas de fluxo (rio, vento) para equilibrar a rigidez do perfil. Excelente para liberar tensões musculares crônicas.`;
  } else if (dominante === 'Sanguíneo') {
    hipnose = `Hipnose para desenvolver foco sustentado e tolerância a tarefas menos estimulantes. Sugestões de "prazer no processo" e metáforas de profundidade (mergulho, raízes) para equilibrar a superficialidade.`;
  } else if (dominante === 'Melancólico') {
    hipnose = `Hipnose para interromper ciclos de ruminação e autocrítica. Sugestões de "soltar o peso" e metáforas de luz e leveza. Excelente para acessar recursos internos de alegria e espontaneidade.`;
  } else {
    hipnose = `Hipnose para ativação de recursos internos e motivação. Sugestões de "você é capaz" e metáforas de movimento (caminhada, voo) para equilibrar a inércia. Excelente para fortalecer a autoestima e iniciativa.`;
  }

  let psicanalise = '';
  if (narcAlto) {
    psicanalise = `Indicadores sugerem necessidade de investigação das dinâmicas narcísicas: ferida narcísica, idealização do self, e dificuldade com a alteridade. O setting analítico oferece espaço para elaboração da inveja, vergonha e necessidade de reconhecimento. Trabalho com transferência é fundamental.`;
  } else if (borderAlto) {
    psicanalise = `Dinâmicas de objeto parcial, cisão (tudo bom/tudo mau) e medo de abandono precisam de elaboração. A constância do setting analítico oferece a continuidade que permite a integração das partes fragmentadas do self.`;
  } else if (psicAlto) {
    psicanalise = `Investigar as defesas de isolamento afetivo, cinismo e dificuldade com vínculo. O trabalho analítico lento e consistente pode acessar a vulnerabilidade subjacente. Atenção à contratransferência é fundamental.`;
  } else if (dominante === 'Colérico') {
    psicanalise = `Investigar a relação com a autoridade interna (supereu severo) e as origens da necessidade de controle. A agressividade direcionada à conquista pode ser expressão de defesas contra vulnerabilidade. O trabalho com a sombra é fundamental.`;
  } else if (dominante === 'Sanguíneo') {
    psicanalise = `Investigar a relação com a ausência e o medo do vazio. A busca por estimulação pode ser defesa contra a depressão ou o tédio existencial. O trabalho com a solidão e a capacidade de estar só é central.`;
  } else if (dominante === 'Melancólico') {
    psicanalise = `Investigar a melancolia como luto não elaborado, a relação com a perda e a culpa inconsciente. O supereu severo e a autocrítica são expressões de uma agressividade voltada contra si. O trabalho com o ideal de ego é fundamental.`;
  } else {
    psicanalise = `Investigar a relação com o desejo próprio e a dificuldade em ocupar espaço. A passividade pode ser expressão de defesas contra a agressividade ou o medo do conflito. O trabalho com a afirmação do desejo é central.`;
  }

  let mentoria = '';
  if (tdahAlto) {
    mentoria = `Micro-tarefas semanais: (1) Usar agenda externa para TODOS compromissos; (2) Técnica Pomodoro (25min foco + 5min pausa); (3) Decompor tarefas grandes em passos de 15min; (4) Ambiente sem distrações durante trabalho profundo. Check-in semanal para ajustes.`;
  } else if (tagAlto) {
    mentoria = `Micro-tarefas semanais: (1) Prática de respiração 4-7-8 duas vezes ao dia; (2) Registro de preocupações em caderno (15min/dia); (3) Exposição gradual a uma situação evitada por semana; (4) Higiene do sono rigorosa. Check-in semanal para ajustes.`;
  } else if (dominante === 'Colérico') {
    mentoria = `Micro-tarefas semanais: (1) 10 minutos diários de "não-fazer" (meditação, contemplação); (2) Delegar uma tarefa por semana; (3) Prática de escuta ativa sem interromper; (4) Atividade física de liberação (boxe, corrida). Check-in semanal para ajustes.`;
  } else if (dominante === 'Sanguíneo') {
    mentoria = `Micro-tarefas semanais: (1) Completar UMA tarefa antes de começar outra; (2) Prática de foco único por 30min/dia; (3) Rotina matinal fixa (mesmo horário); (4) Reduzir compromissos sociais em 20%. Check-in semanal para ajustes.`;
  } else if (dominante === 'Melancólico') {
    mentoria = `Micro-tarefas semanais: (1) "Bom o suficiente" em uma tarefa por dia (não perfeccionista); (2) Atividade física prazerosa 3x/semana; (3) Expressar uma necessidade por dia; (4) Limitar tempo de ruminação (15min/dia). Check-in semanal para ajustes.`;
  } else {
    mentoria = `Micro-tarefas semanais: (1) Tomar uma decisão pequena por dia (sem consultar outros); (2) Iniciar um projeto pessoal e dedicar 30min/semana; (3) Expressar uma opinião em grupo; (4) Atividade física estimulante 3x/semana. Check-in semanal para ajustes.`;
  }

  let dores = '';
  if (dorAlta) {
    dores = `O nível ALTO de tensão muscular indica acúmulo significativo de estresse psicossomático. Regiões prováveis de manifestação: trapézio e ombros (peso/responsabilidade), mandíbula (raiva contida), lombar (insegurança), cervical (rigidez de controle). Recomenda-se: liberação miofascial, Rolfing, acupuntura, e práticas corporais conscientes (yoga, eutonia). A psicoterapia corporal é altamente indicada.`;
  } else if (dorMod) {
    dores = `O nível MODERADO de tensão muscular indica estresse psicossomático em desenvolvimento. Atenção aos sinais do corpo: ombros, pescoço e mandíbula são regiões comuns de manifestação. Recomenda-se: práticas de consciência corporal, alongamentos diários, e investigação das emoções associadas às tensões. Massagem terapêutica e práticas de relaxamento progressivo são indicadas.`;
  } else {
    dores = `O nível de tensão muscular está dentro de parâmetros saudáveis. Manter práticas preventivas: consciência corporal, atividade física regular e pausas ativas durante o trabalho. A prevenção é o melhor caminho para manter o equilíbrio psicossomático.`;
  }

  let encaminhamentos = '';
  const alertasAltos = [];
  if (tdahAlto) alertasAltos.push('TDAH');
  if (teaAlto) alertasAltos.push('TEA');
  if (tagAlto) alertasAltos.push('TAG');
  if (borderAlto) alertasAltos.push('Borderline');
  if (narcAlto) alertasAltos.push('Traços Narcisistas');
  if (psicAlto) alertasAltos.push('Psicopatia');

  if (alertasAltos.length > 0) {
    encaminhamentos = `Dado os indicadores elevados em ${alertasAltos.join(', ')}, recomenda-se avaliação profissional aprofundada com psicólogo e/ou psiquiatra para diagnóstico diferencial. Este material é de psicoeducação e triagem, NÃO substituindo avaliação clínica formal. Agende uma sessão na Clínica Selene para aprofundamento personalizado.`;
  } else {
    encaminhamentos = `Os indicadores estão dentro de parâmetros saudáveis. A Mentoria Integrativa na Clínica Selene pode auxiliar no desenvolvimento pessoal e no alcance de objetivos específicos. Este material é de psicoeducação e não substitui avaliação clínica profissional.`;
  }

  return `🎯 SÍNTESE DO PERFIL
${sintese}

🧠 ABORDAGEM EM NEUROCIÊNCIA
${neuro}

💭 ABORDAGEM EM TERAPIA COGNITIVO-COMPORTAMENTAL (TCC)
${tcc}

🌀 ABORDAGEM EM HIPNOSE CLÍNICA
${hipnose}

🔍 ABORDAGEM EM PSICANÁLISE
${psicanalise}

🧭 ABORDAGEM EM MENTORIA
${mentoria}

💪 RELAÇÃO COM DORES MUSCULARES E PSICOSSOMÁTICA
${dores}

⚠️ ENCAMINHAMENTOS RECOMENDADOS
${encaminhamentos}

---
Este material é de psicoeducação e triagem. Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional na Clínica Selene.`;
}
