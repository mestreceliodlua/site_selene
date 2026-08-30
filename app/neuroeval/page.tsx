'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';

const blocos: { id: string; perguntas: { id: string; texto: string; opcoes: any[] }[] }[] = [
  {
    id: 'temperamentos',
    perguntas: [
      { id: 't1', texto: 'Diante de um imprevisto, você:', opcoes: [
        { texto: 'Ajo imediatamente', perfil: 'colerico' },
        { texto: 'Mantenho a calma e observo', perfil: 'fleumatico' },
        { texto: 'Busco conversar com alguém', perfil: 'sanguineo' },
        { texto: 'Analiso todos os detalhes', perfil: 'melancolico' }
      ]},
      { id: 't2', texto: 'Seu nível de energia no dia a dia é:', opcoes: [
        { texto: 'Alto e constante', perfil: 'colerico' },
        { texto: 'Estável e moderado', perfil: 'fleumatico' },
        { texto: 'Intenso com altos e baixos', perfil: 'sanguineo' },
        { texto: 'Reservado e reflexivo', perfil: 'melancolico' }
      ]},
      { id: 't3', texto: 'Em conflitos, você tende a:', opcoes: [
        { texto: 'Enfrentar diretamente', perfil: 'colerico' },
        { texto: 'Evitar o confronto', perfil: 'fleumatico' },
        { texto: 'Mediar e apaziguar', perfil: 'sanguineo' },
        { texto: 'Guardar mágoa internamente', perfil: 'melancolico' }
      ]},
      { id: 't4', texto: 'O que mais exige atenção na sua saúde hoje:', opcoes: [
        { texto: 'Estresse e tensão muscular', perfil: 'colerico' },
        { texto: 'Sono e digestão', perfil: 'fleumatico' },
        { texto: 'Ansiedade e dispersão', perfil: 'sanguineo' },
        { texto: 'Perfeccionismo e autocrítica', perfil: 'melancolico' }
      ]}
    ]
  },
  {
    id: 'narcisismo',
    perguntas: [
      { id: 'n1', texto: 'Com que frequência você sente que merece reconhecimento especial?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'n2', texto: 'Você sente dificuldade em se colocar no lugar do outro?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'n3', texto: 'Críticas costumam te deixar muito irritado ou magoado?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'n4', texto: 'Você tende a exagerar suas conquistas para impressionar?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'n5', texto: 'Sente que as pessoas deveriam te dar mais atenção?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  },
  {
    id: 'tdah',
    perguntas: [
      { id: 'd1', texto: 'Você tem dificuldade em manter foco em tarefas longas?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'd2', texto: 'Esquece compromissos ou perde objetos com frequência?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'd3', texto: 'Sente inquietação física ou mental constante?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'd4', texto: 'Interrompe pessoas ou fala antes da hora?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'd5', texto: 'Começa muitos projetos e termina poucos?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  },
  {
    id: 'tea',
    perguntas: [
      { id: 'a1', texto: 'Prefere rotinas fixas e fica irritado com mudanças?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'a2', texto: 'Luzes fortes, barulhos ou texturas te incomodam muito?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'a3', texto: 'Tem dificuldade em entender ironias ou indiretas?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'a4', texto: 'Tem interesses muito específicos e intensos?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'a5', texto: 'Prefere ficar sozinho(a) a estar em grupos?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  },
  {
    id: 'tag',
    perguntas: [
      { id: 'g1', texto: 'Sente preocupação excessiva com coisas do dia a dia?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'g2', texto: 'Tem dificuldade para relaxar ou "desligar" a mente?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'g3', texto: 'Sente tensão muscular (ombros, pescoço, mandíbula)?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'g4', texto: 'Tem dificuldade para dormir por causa da mente agitada?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'g5', texto: 'Sente palpitações, falta de ar ou tontura sem causa médica?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  },
  {
    id: 'borderline',
    perguntas: [
      { id: 'b1', texto: 'Suas emoções mudam muito rápido e intensamente?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'b2', texto: 'Tem medo intenso de ser abandonado(a)?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'b3', texto: 'Seus relacionamentos são muito intensos (amor/ódio)?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'b4', texto: 'Sente um vazio interno constante?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  },
  {
    id: 'psicopatia',
    perguntas: [
      { id: 'p1', texto: 'Sente culpa ou remorso com facilidade após magoar alguém?', opcoes: [
        { texto: 'Sempre', valor: 0 }, { texto: 'Frequentemente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Raramente', valor: 3 }, { texto: 'Nunca', valor: 4 }
      ]},
      { id: 'p2', texto: 'Manipula situações para conseguir o que quer?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'p3', texto: 'Sente tédio facilmente e busca emoções fortes?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]},
      { id: 'p4', texto: 'Assume riscos sem pensar nas consequências?', opcoes: [
        { texto: 'Nunca', valor: 0 }, { texto: 'Raramente', valor: 1 },
        { texto: 'Às vezes', valor: 2 }, { texto: 'Frequentemente', valor: 3 }, { texto: 'Sempre', valor: 4 }
      ]}
    ]
  }
];

export default function NeuroEvalPage() {
  const router = useRouter();
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [indicePergunta, setIndicePergunta] = useState(0);

  const todasPerguntas = blocos.flatMap(b => b.perguntas);
  const perguntaAtual = todasPerguntas[indicePergunta];
  const totalPerguntas = todasPerguntas.length;
  const progresso = ((indicePergunta + 1) / totalPerguntas) * 100;

  const handleResponder = (valor: any) => {
    setRespostas({ ...respostas, [perguntaAtual.id]: valor });
    if (indicePergunta < totalPerguntas - 1) {
      setTimeout(() => setIndicePergunta(indicePergunta + 1), 200);
    }
  };

  const voltar = () => {
    if (indicePergunta > 0) setIndicePergunta(indicePergunta - 1);
  };

  const finalizar = () => {
    const temp = { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 };
    blocos.find(b => b.id === 'temperamentos')!.perguntas.forEach(p => {
      const resp = respostas[p.id];
      if (resp && resp in temp) temp[resp as keyof typeof temp]++;
    });
    const totalTemp = Object.values(temp).reduce((a, b) => a + b, 0);
    const tempPerc = Object.fromEntries(
      Object.entries(temp).map(([k, v]) => [k, Math.round((v / totalTemp) * 100)])
    );
    const dominante = Object.entries(temp).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const calcularScore = (blocoId: string) => {
      const bloco = blocos.find(b => b.id === blocoId)!;
      return bloco.perguntas.reduce((acc, p) => acc + (respostas[p.id] || 0), 0);
    };

    const scores = {
      narcisismo: calcularScore('narcisismo'),
      tdah: calcularScore('tdah'),
      tea: calcularScore('tea'),
      tag: calcularScore('tag'),
      borderline: calcularScore('borderline'),
      psicopatia: calcularScore('psicopatia')
    };

    const classificar = (score: number, max: number) => {
      const perc = (score / max) * 100;
      if (perc < 33) return 'Baixo';
      if (perc < 66) return 'Moderado';
      return 'Alto';
    };

    const alertas = {
      narcisismo: classificar(scores.narcisismo, 20),
      tdah: classificar(scores.tdah, 20),
      tea: classificar(scores.tea, 20),
      tag: classificar(scores.tag, 20),
      borderline: classificar(scores.borderline, 16),
      psicopatia: classificar(scores.psicopatia, 16)
    };

    const tensaoMuscular = respostas['g3'] || 0;
    const estresseCorporal = respostas['t4'] === 'colerico' ? 3 : 0;
    const nivelDor = tensaoMuscular + estresseCorporal;

    const mapeamentoTexto = `
MAPEAMENTO COMPORTAMENTAL E EMOCIONAL
=====================================

PERFIL TEMPERAMENTAL:
- Predominante: ${dominante.toUpperCase()} (${tempPerc[dominante]}%)
- Distribuição: Sanguíneo ${tempPerc.sanguineo}% | Colérico ${tempPerc.colerico}% | Melancólico ${tempPerc.melancolico}% | Fleumático ${tempPerc.fleumatico}%

RASTREAMENTO DE CONDIÇÕES (níveis de alerta):
- TDAH: ${alertas.tdah} (score ${scores.tdah}/20)
- TEA (Espectro Autista): ${alertas.tea} (score ${scores.tea}/20)
- TAG (Ansiedade Generalizada): ${alertas.tag} (score ${scores.tag}/20)
- Borderline (regulação emocional): ${alertas.borderline} (score ${scores.borderline}/16)
- Traços Narcisistas: ${alertas.narcisismo} (score ${scores.narcisismo}/20)
- Traços de Psicopatia: ${alertas.psicopatia} (score ${scores.psicopatia}/16)

SINTOMAS PSICOSSOMÁTICOS:
- Nível de tensão muscular/estresse corporal: ${nivelDor >= 4 ? 'Alto' : nivelDor >= 2 ? 'Moderado' : 'Baixo'}
    `.trim();

    localStorage.setItem('neuroAvaliacao', JSON.stringify({
      temperamentos: temp,
      temperamentosPerc: tempPerc,
      dominante,
      scores,
      alertas,
      nivelDor,
      mapeamentoTexto,
      dataHora: new Date().toISOString()
    }));

    router.push('/mentoria');
  };

  const podeAvancar = respostas[perguntaAtual.id] !== undefined;
  const ultimaPergunta = indicePergunta === totalPerguntas - 1;

  return (
    <SiteShell>
      <div className="min-h-[calc(100vh-400px)] py-16 px-6" style={{ backgroundColor: '#0a0e27' }}>
        <div className="max-w-2xl mx-auto">
          
          <h1 className="text-5xl font-bold mb-3 text-center" 
              style={{ 
                fontFamily: 'Playfair Display, serif',
                background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Avaliação Integrativa
          </h1>
          
          <p className="text-center text-sm mb-10" 
             style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
            Pergunta {indicePergunta + 1} de {totalPerguntas}
          </p>

          <div className="w-full rounded-full h-2 mb-10 overflow-hidden" 
               style={{ backgroundColor: '#2a153b' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${progresso}%`,
                background: 'linear-gradient(90deg, #D4AF37 0%, #6B4C9A 100%)'
              }}
            ></div>
          </div>

          <div className="rounded-2xl p-8 shadow-2xl border-l-4"
               style={{ 
                 backgroundColor: '#2a153b',
                 borderLeftColor: '#D4AF37',
                 boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
               }}>
            
            <h2 className="text-2xl mb-8 text-white" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              {perguntaAtual.texto}
            </h2>

            <div className="space-y-3">
              {perguntaAtual.opcoes.map((opcao: any, idx: number) => {
                const valor = 'perfil' in opcao ? opcao.perfil : opcao.valor;
                const selecionado = respostas[perguntaAtual.id] === valor;
                return (
                <button
                  key={idx}
                  onClick={() => handleResponder(valor)}
                  className="w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    backgroundColor: selecionado ? '#D4AF37' : '#0a0e27',
                    borderColor: selecionado ? '#D4AF37' : '#6B4C9A',
                    color: selecionado ? '#0a0e27' : '#E8E0F0',
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: selecionado ? '700' : '400',
                    boxShadow: selecionado ? '0 4px 15px rgba(212,175,55,0.4)' : 'none'
                  }}
                >
                  {opcao.texto}
                </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between items-center">
              {indicePergunta > 0 && (
                <button
                  onClick={voltar}
                  className="px-6 py-3 rounded-lg border-2 transition-all hover:scale-105"
                  style={{
                    borderColor: '#6B4C9A',
                    color: '#E8E0F0',
                    backgroundColor: 'transparent',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  ← Voltar
                </button>
              )}
              
              {ultimaPergunta ? (
                <button
                  disabled={!podeAvancar}
                  onClick={finalizar}
                  className="ml-auto px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0a0e27',
                    fontFamily: 'Open Sans, sans-serif',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.4)'
                  }}
                >
                  Gerar Mapeamento ✨
                </button>
              ) : (
                <span className="ml-auto text-sm italic" style={{ color: '#6B4C9A' }}>
                  Avanço automático
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-center mt-8 italic" 
             style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
            ⚠️ Esta ferramenta é de psicoeducação e triagem. Não substitui avaliação clínica profissional.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
