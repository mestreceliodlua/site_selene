'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const blocos = [
  {
    id: 'temperamentos',
    titulo: 'Perfil Temperamental',
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
    titulo: 'Traços Narcisistas (autoavaliação)',
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
    titulo: 'Sinais de TDAH',
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
    titulo: 'Sinais de TEA (Espectro Autista)',
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
    titulo: 'Sinais de TAG (Ansiedade Generalizada)',
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
    titulo: 'Traços Borderline (regulação emocional)',
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
    titulo: 'Traços de Psicopatia (autoavaliação)',
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

  const todasPerguntas = blocos.flatMap(b => b.perguntas.map(p => ({ ...p, blocoId: b.id, blocoTitulo: b.titulo })));
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
      nome: 'Paciente',
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
    <div className="min-h-screen bg-[#040208] text-[#E5C158] p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#D8B4F8]">Mapeamento Integrativo</h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          Pergunta {indicePergunta + 1} de {totalPerguntas} • {perguntaAtual.blocoTitulo}
        </p>

        <div className="w-full bg-[#1a1525] rounded-full h-2 mb-8">
          <div className="bg-gradient-to-r from-[#D8B4F8] to-[#E5C158] h-2 rounded-full transition-all" style={{ width: `${progresso}%` }}></div>
        </div>

        <div className="bg-[#1a1525] p-6 rounded-lg border border-[#D8B4F8]/30">
          <h2 className="text-xl mb-6 text-white">{perguntaAtual.texto}</h2>

          <div className="space-y-3">
            {perguntaAtual.opcoes.map((opcao: any, idx: number) => {
              const valor = 'perfil' in opcao ? opcao.perfil : opcao.valor;
              return (
              <button
                key={idx}
                onClick={() => handleResponder(valor)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  respostas[perguntaAtual.id] === valor
                    ? 'bg-[#E5C158] text-[#040208] border-[#E5C158] font-bold'
                    : 'bg-[#040208] text-[#D8B4F8] border-[#D8B4F8]/50 hover:border-[#E5C158]'
                }`}
              >
                {opcao.texto}
              </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            {indicePergunta > 0 && (
              <button onClick={voltar} className="px-6 py-2 border border-[#D8B4F8] rounded text-[#D8B4F8] hover:bg-[#D8B4F8]/10">
                Voltar
              </button>
            )}
            {ultimaPergunta ? (
              <button
                disabled={!podeAvancar}
                onClick={finalizar}
                className="ml-auto px-6 py-2 bg-[#D8B4F8] text-[#040208] font-bold rounded disabled:opacity-50 hover:bg-[#c49fe8]"
              >
                Gerar Mapeamento
              </button>
            ) : (
              <span className="ml-auto text-sm text-gray-500">Avanço automático</span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Esta ferramenta é de psicoeducação e triagem. Não substitui avaliação clínica profissional.
        </p>
      </div>
    </div>
  );
}
