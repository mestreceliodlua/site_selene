'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MentoriaPage() {
  const router = useRouter();
  const [mapeamento, setMapeamento] = useState<any>(null);
  const [analiseIA, setAnaliseIA] = useState<string>('');
  const [carregandoIA, setCarregandoIA] = useState(false);

  useEffect(() => {
    const dados = localStorage.getItem('neuroAvaliacao');
    if (dados) setMapeamento(JSON.parse(dados));
  }, []);

  const solicitarAnaliseIA = async () => {
    if (!mapeamento?.mapeamentoTexto) return;
    setCarregandoIA(true);
    setAnaliseIA('');

    try {
      const response = await fetch('/api/analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapeamento: mapeamento.mapeamentoTexto })
      });
      const data = await response.json();
      setAnaliseIA(data.analise || 'Erro ao gerar análise.');
    } catch {
      setAnaliseIA('Erro de conexão com o servidor.');
    } finally {
      setCarregandoIA(false);
    }
  };

  const limparResultado = () => {
    localStorage.removeItem('neuroAvaliacao');
    setMapeamento(null);
    setAnaliseIA('');
  };

  const imprimir = (conteudo: string, titulo: string) => {
    const janela = window.open('', '_blank');
    if (!janela) return;
    janela.document.write(`
      <html><head><title>${titulo}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1525; line-height: 1.6; }
        h1 { color: #7c3aed; border-bottom: 2px solid #E5C158; padding-bottom: 10px; }
        h2 { color: #7c3aed; margin-top: 30px; }
        pre { white-space: pre-wrap; font-family: inherit; }
        .disclaimer { margin-top: 40px; padding: 15px; background: #fef3c7; border-left: 4px solid #E5C158; font-size: 0.9em; }
      </style></head><body>
      <h1>${titulo}</h1>
      <pre>${conteudo}</pre>
      <div class="disclaimer">
        <strong>Aviso:</strong> Este material é de psicoeducação e triagem, gerado com apoio de IA. 
        Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional.
      </div>
      </body></html>
    `);
    janela.document.close();
    janela.print();
  };

  const enviarWhatsApp = (texto: string, titulo: string) => {
    const mensagem = `*${titulo}*\n\n${texto}\n\nMaterial de psicoeducação. Não substitui avaliação clínica.`;
    window.open(`https://wa.me/5511915909002?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (!mapeamento) {
    return (
      <div className="min-h-screen bg-[#040208] text-[#E5C158] p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#D8B4F8]">Nenhum mapeamento encontrado</h2>
        <button onClick={() => router.push('/neuroeval')} className="px-6 py-3 bg-[#E5C158] text-[#040208] font-bold rounded-lg">
          Iniciar Avaliação
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040208] text-[#E5C158] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center border-b border-[#D8B4F8]/30 pb-4">
          <h1 className="text-3xl font-bold text-[#D8B4F8]">Seu Mapeamento</h1>
          <button onClick={limparResultado} className="text-sm text-red-400 hover:text-red-300 underline">
            Limpar
          </button>
        </div>

        <div className="bg-[#1a1525] p-6 rounded-lg border border-[#D8B4F8]/30">
          <h2 className="text-xl font-semibold mb-3 text-white">Mapeamento Completo</h2>
          <pre className="text-[#D8B4F8] whitespace-pre-line leading-relaxed text-sm">{mapeamento.mapeamentoTexto}</pre>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => imprimir(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
              className="px-4 py-2 bg-[#E5C158] text-[#040208] font-bold rounded hover:bg-[#d4b045]">
              Imprimir Mapeamento
            </button>
            <button onClick={() => enviarWhatsApp(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
              className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
              Enviar via WhatsApp
            </button>
          </div>
        </div>

        {!analiseIA && !carregandoIA && (
          <button onClick={solicitarAnaliseIA}
            className="w-full py-4 bg-gradient-to-r from-[#D8B4F8] to-[#E5C158] text-[#040208] font-bold text-lg rounded-lg hover:opacity-90">
            Gerar Analise Terapeutica com IA
          </button>
        )}

        {carregandoIA && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E5C158] mx-auto mb-4"></div>
            <p className="text-[#D8B4F8]">Analisando perfil com IA...</p>
          </div>
        )}

        {analiseIA && (
          <div className="bg-[#0f0c16] p-6 rounded-lg border border-[#E5C158]/50 shadow-lg shadow-[#E5C158]/10">
            <h2 className="text-xl font-semibold mb-3 text-[#E5C158]">Analise Terapeutica</h2>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">{analiseIA}</div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => imprimir(analiseIA, 'Analise Terapeutica')}
                className="px-4 py-2 bg-[#E5C158] text-[#040208] font-bold rounded hover:bg-[#d4b045]">
                Imprimir Analise
              </button>
              <button onClick={() => enviarWhatsApp(analiseIA, 'Analise Terapeutica')}
                className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                Enviar via WhatsApp
              </button>
              <button onClick={() => router.push('/neuroeval')}
                className="px-4 py-2 border border-[#D8B4F8] text-[#D8B4F8] rounded hover:bg-[#D8B4F8]/10">
                Refazer Avaliacao
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
