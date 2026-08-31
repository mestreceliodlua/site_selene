'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';

const modulos = [
  {
    id: 'impostor',
    titulo: 'Fenômeno do Impostor',
    descricao: 'Baseado na Escala de Clance — Identifica a incapacidade de internalizar conquistas e o medo de ser "desmascarado"',
    perguntas: [
      { id: 'i1', texto: 'Sinto que, mais cedo ou mais tarde, as pessoas vão descobrir que não sou tão competente quanto pareço.' },
      { id: 'i2', texto: 'Quando sou elogiado(a), costumo pensar que a pessoa está apenas sendo gentil ou que exagerou meus méritos.' },
      { id: 'i3', texto: 'Atribuo meus sucessos mais à sorte, ao timing ou à ajuda de outros do que à minha própria capacidade.' },
      { id: 'i4', texto: 'Evito novos desafios ou promoções porque tenho medo de não conseguir repetir o desempenho anterior.' },
      { id: 'i5', texto: 'Sinto que preciso trabalhar muito mais do que meus pares para provar que mereço estar onde estou.' },
    ]
  },
  {
    id: 'narcisismo',
    titulo: 'Padrões Relacionais e Espectro Narcísico',
    descricao: 'Mapeia traços de grandiosidade, vulnerabilidade ou necessidade de validação externa',
    perguntas: [
      { id: 'n1', texto: 'Quando recebo uma crítica (mesmo construtiva), sinto-me profundamente ofendido(a), envergonhado(a) ou com raiva intensa.' },
      { id: 'n2', texto: 'Frequentemente sinto que as pessoas não reconhecem o quanto sou especial, talentoso(a) ou quanto sacrifico por elas.' },
      { id: 'n3', texto: 'Tenho dificuldade em sentir compaixão ou paciência quando alguém está reclamando de problemas que considero "comuns" ou "menores".' },
      { id: 'n4', texto: 'Costumo me comparar com os outros e sinto uma pontada de inveja ou injustiça quando eles têm sucesso.' },
      { id: 'n5', texto: 'Preciso que minhas conquistas ou esforços sejam visíveis e reconhecidos publicamente para me sentir valorizado(a).' },
    ]
  },
  {
    id: 'ahsd',
    titulo: 'Altas Habilidades / Superdotação e Sobreexcitabilidades',
    descricao: 'Identifica intensidade, assincronia e padrões neurodivergentes (Baseado em Dabrowski e Renzulli)',
    perguntas: [
      { id: 'a1', texto: 'Minha mente raramente "desliga"; tenho um fluxo constante de pensamentos, ideias ou conexões entre assuntos aparentemente não relacionados.' },
      { id: 'a2', texto: 'Sinto emoções, injustiças ou estímulos sensoriais (barulho, texturas, luz) com uma intensidade muito maior do que a maioria das pessoas ao meu redor.' },
      { id: 'a3', texto: 'Na infância ou vida adulta, frequentemente me senti entediado(a) em ambientes que não me desafiavam, sendo às vezes rotulado(a) como "desatento" ou "preguiçoso".' },
      { id: 'a4', texto: 'Tenho um senso de justiça muito agudo e tenho dificuldade em aceitar regras ou autoridades que considero ilógicas ou arbitrárias.' },
      { id: 'a5', texto: 'Aprendo coisas novas com muita rapidez e facilidade, mas muitas vezes tenho dificuldade em terminar projetos porque perco o interesse ou busco a perfeição inatingível.' },
    ]
  }
];

const opcoesEscala = [
  { valor: 1, label: '1', desc: 'Discordo Totalmente / Raramente / Não me descreve' },
  { valor: 2, label: '2', desc: '' },
  { valor: 3, label: '3', desc: 'Neutro / Às vezes' },
  { valor: 4, label: '4', desc: '' },
  { valor: 5, label: '5', desc: 'Concordo Totalmente / Frequentemente / Descreve-me perfeitamente' },
];

const inputCls =
  'w-full bg-[#0a0e27] border-2 rounded-xl px-4 py-3 text-[#E8E0F0] placeholder-[#6B4C9A] ' +
  'focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all ' +
  'font-[Open_Sans]';

function calcularIdade(dataNasc: string): string {
  if (!dataNasc) return '';
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const mes = hoje.getMonth() - nasc.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade > 0 ? String(idade) : '';
}

function formatarWhatsApp(valor: string): string {
  let numeros = valor.replace(/\D/g, '');
  if (numeros.length > 11) numeros = numeros.slice(0, 11);
  if (numeros.length > 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  if (numeros.length > 2) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length > 0) return `(${numeros}`;
  return '';
}

export default function ProtocoloPage() {
  const router = useRouter();
  const [etapaLGPD, setEtapaLGPD] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [etapaResultado, setEtapaResultado] = useState(false);

  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [idade, setIdade] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [consentimento, setConsentimento] = useState(false);

  useEffect(() => {
    const salvos = localStorage.getItem('dadosPacienteSelene');
    if (salvos) {
      const d = JSON.parse(salvos);
      setNome(d.nome || '');
      setDataNasc(d.dataNascimento || '');
      setIdade(d.idade || '');
      setWhatsapp(d.whatsapp || '');
      setConsentimento(true);
    }
  }, []);

  useEffect(() => {
    setIdade(calcularIdade(dataNasc));
  }, [dataNasc]);

  const todasPerguntas = modulos.flatMap(m => m.perguntas);
  const perguntaAtual = todasPerguntas[indicePergunta];
  const totalPerguntas = todasPerguntas.length;
  const progresso = ((indicePergunta + 1) / totalPerguntas) * 100;

  const moduloAtual = modulos.find(m =>
    m.perguntas.some(p => p.id === perguntaAtual?.id)
  );

  const formValido = nome.trim() !== '' && dataNasc !== '' && whatsapp.replace(/\D/g, '').length >= 10 && consentimento;

  const iniciarQuestionario = () => {
    localStorage.setItem('dadosPacienteSelene', JSON.stringify({
      nome: nome.trim(),
      dataNascimento: dataNasc,
      idade,
      whatsapp,
      dataAvaliacao: new Date().toLocaleDateString('pt-BR')
    }));
    setEtapaLGPD(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResponder = (valor: number) => {
    setRespostas({ ...respostas, [perguntaAtual.id]: valor });
    if (indicePergunta < totalPerguntas - 1) {
      setTimeout(() => setIndicePergunta(indicePergunta + 1), 200);
    }
  };

  const voltar = () => {
    if (indicePergunta > 0) setIndicePergunta(indicePergunta - 1);
  };

  const calcularModulo = (moduloId: string) => {
    const modulo = modulos.find(m => m.id === moduloId)!;
    const soma = modulo.perguntas.reduce((acc, p) => acc + (respostas[p.id] || 0), 0);
    const max = modulo.perguntas.length * 5;
    const perc = Math.round((soma / max) * 100);
    return { soma, max, perc };
  };

  const interpretarImpostor = (perc: number) => {
    if (perc < 30) return { nivel: 'Baixo', cor: '#22c55e', desc: 'Padrões de impostor pouco presentes. Você consegue reconhecer e internalizar suas conquistas.' };
    if (perc < 60) return { nivel: 'Moderado', cor: '#eab308', desc: 'Algumas dúvidas internas sobre sua competência são percebidas. Vale explorar esses padrões.' };
    if (perc < 80) return { nivel: 'Alto', cor: '#f97316', desc: 'Tendência significativa a minimizar conquistas e temer ser "desmascarado(a)". Pode gerar burnout.' };
    return { nivel: 'Muito Alto', cor: '#ef4444', desc: 'Padrão intenso de Fenômeno do Impostor. Recomenda-se trabalho terapêutico focado em auto-reconhecimento.' };
  };

  const interpretarNarcisismo = (perc: number) => {
    if (perc < 30) return { nivel: 'Baixo', cor: '#22c55e', desc: 'Relacionamentos equilibrados com boa regulação emocional diante de críticas.' };
    if (perc < 60) return { nivel: 'Moderado', cor: '#eab308', desc: 'Alguma necessidade de validação externa e sensibilidade a críticas. Comum em contextos de alta performance.' };
    if (perc < 80) return { nivel: 'Alto', cor: '#f97316', desc: 'Traços narcísicos significativos — pode incluir vulnerabilidade, grandiosidade ou ambos. Impacta relacionamentos.' };
    return { nivel: 'Muito Alto', cor: '#ef4444', desc: 'Padrão narcísico acentuado. Recomenda-se avaliação clínica aprofundada e trabalho terapêutico focado.' };
  };

  const interpretarAHSD = (perc: number) => {
    if (perc < 30) return { nivel: 'Baixo', cor: '#22c55e', desc: 'Padrões de intensidade e sobreexcitabilidade pouco presentes.' };
    if (perc < 60) return { nivel: 'Moderado', cor: '#eab308', desc: 'Algumas características de intensidade intelectual/emocional. Pode beneficiar de ambientes que desafiem.' };
    if (perc < 80) return { nivel: 'Alto', cor: '#f97316', desc: 'Indicadores significativos de AH/SD ou sobreexcitabilidade. Pode ser confundido com TDAH ou ansiedade.' };
    return { nivel: 'Muito Alto', cor: '#ef4444', desc: 'Perfil intenso de AH/SD com sobreexcitabilidades marcantes. Recomenda-se avaliação de Altas Habilidades.' };
  };

  const cruzamento = () => {
    const imp = calcularModulo('impostor');
    const nar = calcularModulo('narcisismo');
    const ahsd = calcularModulo('ahsd');
    const alertas: string[] = [];

    if (imp.perc >= 60 && ahsd.perc >= 60) {
      alertas.push('🔴 AH/SD com Máscara de Impostor — O paciente aprendeu a esconder sua capacidade para se adequar ("masking"). Risco alto de burnout e depressão por exaustão.');
    }
    if (nar.perc >= 60 && imp.perc >= 60) {
      alertas.push('🟠 Narcisismo Vulnerável — A grandiosidade pode ser uma defesa contra vergonha profunda. Dificuldade de aliança terapêutica.');
    }
    if (nar.perc >= 60 && ahsd.perc < 40) {
      alertas.push('🟡 Traços Narcísicos Grandiosos — Foco na validação externa e baixa empatia afetiva. Possíveis comportamentos manipulativos.');
    }
    if (ahsd.perc >= 70) {
      alertas.push('🔵 Sobreexcitabilidade Emocional/Intelectual (Dabrowski) — Pode ser confundido com TDAH, Borderline ou TAG se não for olhado pela lente da AH/SD.');
    }
    return alertas;
  };

  const finalizar = () => {
    const imp = calcularModulo('impostor');
    const nar = calcularModulo('narcisismo');
    const ahsd = calcularModulo('ahsd');
    const alertas = cruzamento();
    const dadosPaciente = JSON.parse(localStorage.getItem('dadosPacienteSelene') || '{}');

    const textoResultado = `
PROTOCOLO DE RASTREIO CLÍNICO INTEGRATIVO
==========================================

DADOS DO PACIENTE:
- Nome: ${dadosPaciente.nome || 'Não informado'}
- Idade: ${dadosPaciente.idade || '?'} anos
- Data: ${dadosPaciente.dataAvaliacao || new Date().toLocaleDateString('pt-BR')}

MÓDULO 1 — FENÔMENO DO IMPOSTOR (Escala de Clance)
- Score: ${imp.soma}/${imp.max} (${imp.perc}%)
- Classificação: ${interpretarImpostor(imp.perc).nivel}
- ${interpretarImpostor(imp.perc).desc}

MÓDULO 2 — PADRÕES RELACIONAIS E ESPECTRO NARCÍSICO
- Score: ${nar.soma}/${nar.max} (${nar.perc}%)
- Classificação: ${interpretarNarcisismo(nar.perc).nivel}
- ${interpretarNarcisismo(nar.perc).desc}

MÓDULO 3 — ALTAS HABILIDADES / SOBREEXCITABILIDADES (Dabrowski/Renzulli)
- Score: ${ahsd.soma}/${ahsd.max} (${ahsd.perc}%)
- Classificação: ${interpretarAHSD(ahsd.perc).nivel}
- ${interpretarAHSD(ahsd.perc).desc}

CRUZAMENTO DE DADOS E ALERTAS CLÍNICOS:
${alertas.length > 0 ? alertas.join('\n') : 'Nenhum alerta de cruzamento identificado.'}

MARCADORES SOMÁTICOS PARA OBSERVAÇÃO NA SESSÃO:
- Impostor: Contrair postura ao falar de conquistas? Respiração superficial ao receber elogios?
- Narcisismo Vulnerável: Rigidez defensiva ou tensão mandíbula/pescoço quando o ego é questionado?
- AH/SD: Inquietação psicomotora ou hipersensibilidade tátil/auditiva no setting terapêutico?
    `.trim();

    localStorage.setItem('protocoloRastreio', JSON.stringify({
      impostor: imp,
      narcisismo: nar,
      ahsd,
      alertas,
      textoResultado,
      dataHora: new Date().toISOString()
    }));

    setEtapaResultado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const podeAvancar = respostas[perguntaAtual?.id] !== undefined;
  const ultimaPergunta = indicePergunta === totalPerguntas - 1;

  const imprimir = () => {
    const dados = JSON.parse(localStorage.getItem('dadosPacienteSelene') || '{}');
    const resultado = JSON.parse(localStorage.getItem('protocoloRastreio') || '{}');
    const janela = window.open('', '_blank');
    if (!janela) { alert('Permita pop-ups para imprimir.'); return; }
    const dataGeracao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    janela.document.write(`
      <html><head><title>Protocolo de Rastreio Clínico - ${dados.nome || ''}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap');
        body { font-family: 'Open Sans', Arial, sans-serif; padding: 40px; color: #1a1525; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        h1 { font-family: 'Playfair Display', serif; color: #2a153b; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; font-size: 1.5em; }
        h2 { font-family: 'Playfair Display', serif; color: #2a153b; margin-top: 25px; font-size: 1.2em; }
        h3 { font-family: 'Playfair Display', serif; color: #2a153b; font-size: 1.1em; }
        .header { text-align: center; margin-bottom: 30px; }
        .header small { color: #666; }
        .paciente { margin-bottom: 2rem; padding: 1rem; background: #f0ecf5; border-radius: 6px; border: 1px solid #D4AF37; }
        .paciente p { margin: 0.3rem 0; font-size: 0.95em; }
        .modulo { margin-bottom: 2rem; padding: 1.2rem; background: #fafafa; border-left: 4px solid #D4AF37; border-radius: 4px; }
        .modulo h3 { margin-top: 0; }
        .pergunta { margin: 0.5rem 0; font-size: 0.95em; }
        .pergunta .resp { font-weight: bold; color: #2a153b; }
        .score-box { margin: 1rem 0; padding: 0.8rem; background: #f0ecf5; border-radius: 6px; text-align: center; }
        .score-box .valor { font-size: 1.8em; font-weight: bold; color: #D4AF37; }
        .alerta { margin: 0.5rem 0; padding: 0.8rem; background: #fef3c7; border-left: 3px solid #f97316; font-size: 0.9em; border-radius: 4px; }
        .pdf-lgpd-footer { margin-top: 3rem; padding: 1.5rem; background-color: #f8f9fa; border-left: 4px solid #D4AF37; border-radius: 4px; font-size: 10pt; color: #333; line-height: 1.5; page-break-inside: avoid; }
        .pdf-lgpd-footer h3 { font-size: 12pt; color: #2a153b; margin-top: 0; margin-bottom: 1rem; }
        .pdf-lgpd-footer p { margin-bottom: 0.8rem; text-align: justify; }
        .pdf-signature { margin-top: 1.5rem; text-align: right; font-size: 9pt; color: #555; border-top: 1px solid #ddd; padding-top: 0.8rem; }
        .disclaimer { margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #D4AF37; font-size: 0.9em; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 0.8em; border-top: 1px solid #ddd; padding-top: 20px; }
      </style></head><body>
      <div class="header">
        <h1>Protocolo de Rastreio Clínico Integrativo</h1>
        <small>Clínica Selene • ${dataGeracao}</small>
      </div>
      <div class="paciente">
        <p><strong>Paciente:</strong> ${dados.nome || '—'}</p>
        <p><strong>Idade:</strong> ${dados.idade || '—'} anos | <strong>Nascimento:</strong> ${dados.dataNascimento || '—'}</p>
      </div>
      ${modulos.map(m => {
        const r = resultado[m.id] || {};
        const interp = m.id === 'impostor' ? interpretarImpostor(r.perc || 0) : m.id === 'narcisismo' ? interpretarNarcisismo(r.perc || 0) : interpretarAHSD(r.perc || 0);
        return `
        <div class="modulo">
          <h3>${m.titulo}</h3>
          <p style="font-size:0.85em;color:#666;margin-top:0">${m.descricao}</p>
          ${m.perguntas.map(p => `<p class="pergunta">${p.texto} <span class="resp">[ ${respostas[p.id] || '—'} ]</span></p>`).join('')}
          <div class="score-box">
            <div class="valor">${r.soma || 0}/${r.max || 25} (${r.perc || 0}%)</div>
            <div><strong>${interp.nivel}</strong></div>
          </div>
          <p style="font-size:0.9em;margin-top:0.5rem">${interp.desc}</p>
        </div>`;
      }).join('')}
      ${(resultado.alertas || []).length > 0 ? `
      <h2>Cruzamento de Dados e Alertas Clínicos</h2>
      ${resultado.alertas.map((a: string) => `<div class="alerta">${a}</div>`).join('')}` : ''}
      <div class="disclaimer">
        <strong>Aviso:</strong> Este protocolo é de psicoeducação e triagem integrativa.
        Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional.
      </div>
      <div class="pdf-lgpd-footer">
        <h3>Termo de Confidencialidade e Proteção de Dados (LGPD)</h3>
        <p><strong>1. Finalidade do Tratamento:</strong> Este relatório foi gerado com base nas respostas fornecidas pelo(a) avaliando(a) e possui finalidade estritamente informativa, orientativa e de triagem integrativa, não substituindo diagnóstico médico, neurológico ou psicológico formal.</p>
        <p><strong>2. Conformidade Legal:</strong> Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), os dados pessoais coletados são utilizados exclusivamente para a emissão deste documento e para eventual contato profissional.</p>
        <p><strong>3. Segurança Técnica e Sigilo:</strong> O processamento das respostas é realizado de forma <em>local</em> (no dispositivo do usuário). <strong>Não há envio de dados para servidores externos ou IA de terceiros.</strong></p>
        <p><strong>4. Direitos do Titular:</strong> É possível exercer os direitos de acesso, correção ou exclusão a qualquer momento via canais oficiais da Clínica Selene.</p>
        <p class="pdf-signature">
          <strong>Clínica Selene de Terapias</strong><br>
          Terapia Integrativa do Movimento | Psicanálise | Neurociência Aplicada<br>
          <em>Documento gerado em: ${dataGeracao}</em>
        </p>
      </div>
      <div class="footer">
        Clínica Selene • Mentoria Integrativa<br>
        WhatsApp: (11) 91590-9002
      </div>
      </body></html>
    `);
    janela.document.close();
    setTimeout(() => janela.print(), 300);
  };

  const enviarWhatsApp = () => {
    const dados = JSON.parse(localStorage.getItem('dadosPacienteSelene') || '{}');
    const resultado = JSON.parse(localStorage.getItem('protocoloRastreio') || '{}');
    const texto = resultado.textoResultado || '';
    const nome = dados.nome || 'Não informado';
    const idade = dados.idade || '?';
    const msg = `*Protocolo de Rastreio Clínico Integrativo*\n_Clínica Selene_\n\n👤 *Paciente:* ${nome} (${idade} anos)\n\n${texto}\n\nMaterial de psicoeducação. Não substitui avaliação clínica.`;
    window.open(`https://wa.me/5511915909002?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── TELA DE RESULTADO ──
  if (etapaResultado) {
    const imp = calcularModulo('impostor');
    const nar = calcularModulo('narcisismo');
    const ahsd = calcularModulo('ahsd');
    const alertas = cruzamento();

    return (
      <SiteShell>
        <div className="min-h-[calc(100vh-400px)] bg-[#0a0e27] py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold text-center"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>
              Resultado do Protocolo
            </h1>

            {[{ modulo: modulos[0], resultado: imp, interp: interpretarImpostor(imp.perc) },
              { modulo: modulos[1], resultado: nar, interp: interpretarNarcisismo(nar.perc) },
              { modulo: modulos[2], resultado: ahsd, interp: interpretarAHSD(ahsd.perc) }
            ].map(({ modulo: m, resultado: r, interp }) => (
              <div key={m.id} className="rounded-2xl p-8 shadow-2xl border-l-4"
                   style={{ backgroundColor: '#2a153b', borderLeftColor: '#D4AF37', boxShadow: '0 10px 40px rgba(74,26,107,0.3)' }}>
                <h2 className="text-xl font-bold mb-2" style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                  {m.titulo}
                </h2>
                <p className="text-xs mb-4" style={{ color: '#6B4C9A' }}>{m.descricao}</p>
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold" style={{ color: interp.cor }}>{r.perc}%</span>
                  <p className="text-lg font-semibold mt-1" style={{ color: interp.cor }}>{interp.nivel}</p>
                </div>
                <p className="text-sm" style={{ color: '#E8E0F0' }}>{interp.desc}</p>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {m.perguntas.map(p => (
                    <div key={p.id} className="text-center">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold mx-auto"
                           style={{ backgroundColor: '#0a0e27', color: '#D4AF37', border: '1px solid #6B4C9A' }}>
                        {respostas[p.id] || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {alertas.length > 0 && (
              <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                   style={{ backgroundColor: '#2a153b', borderLeftColor: '#f97316' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: '#f97316', fontFamily: 'Playfair Display, serif' }}>
                  Alertas de Cruzamento
                </h2>
                {alertas.map((a, i) => (
                  <p key={i} className="text-sm mb-2" style={{ color: '#E8E0F0' }}>{a}</p>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={imprimir}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#D4AF37', color: '#0a0e27', fontFamily: 'Open Sans, sans-serif' }}>
                🖨️ Imprimir Relatório
              </button>
              <button onClick={enviarWhatsApp}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: '#25D366', color: '#ffffff', fontFamily: 'Open Sans, sans-serif' }}>
                📱 Enviar via WhatsApp
              </button>
              <button onClick={() => router.push('/neuroeval')}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                style={{ backgroundColor: 'transparent', borderColor: '#6B4C9A', color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                🔄 Avaliação Integrativa (32 perguntas)
              </button>
            </div>
          </div>
        </div>
      </SiteShell>
    );
  }

  // ── FLUXO NORMAL ──
  return (
    <SiteShell>
      <div className="page-dark py-16 px-6">
        <div className="max-w-2xl mx-auto">

          {/* LGPD */}
          {!etapaLGPD && (
            <div>
              <h1 className="text-4xl font-bold mb-3 text-center"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>
                Protocolo de Rastreio Clínico
              </h1>
              <p className="text-center text-sm mb-2"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Fenômeno do Impostor • Traços Narcísicos • Altas Habilidades
              </p>
              <p className="text-center text-xs mb-8"
                 style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                Antes de começarmos, precisamos de alguns dados
              </p>

              <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                   style={{ backgroundColor: '#2a153b', borderLeftColor: '#D4AF37', boxShadow: '0 10px 40px rgba(74,26,107,0.3)' }}>
                <p className="text-sm mb-6 text-center"
                   style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                  Suas respostas são processadas <strong style={{ color: '#D4AF37' }}>localmente no seu dispositivo</strong>.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                      Nome Completo *
                    </label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                      placeholder="Digite seu nome completo" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                        Data de Nascimento *
                      </label>
                      <input type="date" value={dataNasc} onChange={e => setDataNasc(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                        Idade
                      </label>
                      <input type="text" value={idade} readOnly placeholder="Auto"
                        className={`${inputCls} opacity-60 cursor-not-allowed`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                      WhatsApp (com DDD) *
                    </label>
                    <input type="tel" value={whatsapp} onChange={e => setWhatsapp(formatarWhatsApp(e.target.value))}
                      placeholder="(XX) XXXXX-XXXX" maxLength={16} className={inputCls} />
                  </div>
                  <label className="flex items-start gap-3 mt-6 cursor-pointer">
                    <input type="checkbox" checked={consentimento} onChange={e => setConsentimento(e.target.checked)}
                      className="mt-1 w-5 h-5" style={{ accentColor: '#D4AF37' }} />
                    <span className="text-xs leading-relaxed" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                      Autorizo o tratamento dos meus dados pessoais pela <strong style={{ color: '#D4AF37' }}>Clínica Selene</strong>, conforme a{' '}
                      <a href="/politica-de-privacidade" target="_blank" className="underline" style={{ color: '#D4AF37' }}>Política de Privacidade</a>,
                      exclusivamente para geração deste relatório e contato para agendamento. *
                    </span>
                  </label>
                  <p className="text-xs" style={{ color: '#6B4C9A' }}>
                    🔒 Seus dados são processados localmente no seu dispositivo.
                  </p>
                  <button onClick={iniciarQuestionario} disabled={!formValido}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4"
                    style={{
                      backgroundColor: formValido ? '#D4AF37' : '#6B4C9A',
                      color: '#0a0e27', fontFamily: 'Open Sans, sans-serif',
                      boxShadow: formValido ? '0 4px 20px rgba(212,175,55,0.4)' : 'none'
                    }}>
                    Iniciar Protocolo ✨
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* QUESTIONÁRIO */}
          {etapaLGPD && (
            <div>
              <h1 className="text-4xl font-bold mb-2 text-center"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>
                Protocolo de Rastreio Clínico
              </h1>

              {moduloAtual && (
                <div className="text-center mb-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#D4AF37', color: '#0a0e27', fontFamily: 'Open Sans, sans-serif' }}>
                    {moduloAtual.titulo}
                  </span>
                </div>
              )}

              <p className="text-center text-sm mb-10"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Pergunta {indicePergunta + 1} de {totalPerguntas}
              </p>

              <div className="w-full rounded-full h-2 mb-10 overflow-hidden" style={{ backgroundColor: '#2a153b' }}>
                <div className="h-2 rounded-full transition-all duration-500"
                     style={{ width: `${progresso}%`, background: 'linear-gradient(90deg, #D4AF37 0%, #6B4C9A 100%)' }} />
              </div>

              <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                   style={{ backgroundColor: '#2a153b', borderLeftColor: '#D4AF37', boxShadow: '0 10px 40px rgba(74,26,107,0.3)' }}>
                <h2 className="text-xl mb-8 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {perguntaAtual.texto}
                </h2>

                <div className="flex gap-3 justify-center flex-wrap">
                  {opcoesEscala.map(op => {
                    const selecionado = respostas[perguntaAtual.id] === op.valor;
                    return (
                      <button key={op.valor} onClick={() => handleResponder(op.valor)}
                        className="w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-110"
                        style={{
                          backgroundColor: selecionado ? '#D4AF37' : '#0a0e27',
                          borderColor: selecionado ? '#D4AF37' : '#6B4C9A',
                          color: selecionado ? '#0a0e27' : '#E8E0F0',
                          fontWeight: selecionado ? '700' : '400',
                          boxShadow: selecionado ? '0 4px 15px rgba(212,175,55,0.4)' : 'none'
                        }}>
                        <span className="text-xl font-bold">{op.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs mt-3 px-2"
                     style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                  <span>Discordo Totalmente</span>
                  <span>Concordo Totalmente</span>
                </div>

                <div className="mt-10 flex justify-between items-center">
                  {indicePergunta > 0 && (
                    <button onClick={voltar}
                      className="px-6 py-3 rounded-lg border-2 transition-all hover:scale-105"
                      style={{ borderColor: '#6B4C9A', color: '#E8E0F0', backgroundColor: 'transparent', fontFamily: 'Open Sans, sans-serif' }}>
                      ← Voltar
                    </button>
                  )}
                  {ultimaPergunta ? (
                    <button disabled={!podeAvancar} onClick={finalizar}
                      className="ml-auto px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      style={{ backgroundColor: '#D4AF37', color: '#0a0e27', fontFamily: 'Open Sans, sans-serif', boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>
                      Gerar Resultado ✨
                    </button>
                  ) : (
                    <span className="ml-auto text-sm italic" style={{ color: '#6B4C9A' }}>Avanço automático</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-center mt-8 italic" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                ⚠️ Este protocolo é de psicoeducação e triagem. Não substitui avaliação clínica profissional.
              </p>
            </div>
          )}

        </div>
      </div>
    </SiteShell>
  );
}
