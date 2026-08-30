'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';

export default function MentoriaPage() {
  const router = useRouter();
  const [mapeamento, setMapeamento] = useState<any>(null);
  const [analiseIA, setAnaliseIA] = useState<string>('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState<string>('');

  useEffect(() => {
    const dados = localStorage.getItem('neuroAvaliacao');
    if (dados) setMapeamento(JSON.parse(dados));
  }, []);

  const solicitarAnaliseIA = async () => {
    if (!mapeamento?.mapeamentoTexto) return;
    setCarregandoIA(true);
    setAnaliseIA('');
    setErroIA('');

    try {
      const response = await fetch('/api/analise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapeamento: mapeamento.mapeamentoTexto })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErroIA(data.error || 'Erro desconhecido ao gerar análise.');
        return;
      }
      
      if (data.analise) {
        setAnaliseIA(data.analise);
      } else {
        setErroIA('Resposta vazia da IA. Tente novamente.');
      }
    } catch (err) {
      setErroIA('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setCarregandoIA(false);
    }
  };

  const limparResultado = () => {
    if (confirm('Tem certeza que deseja limpar o mapeamento?')) {
      localStorage.removeItem('neuroAvaliacao');
      setMapeamento(null);
      setAnaliseIA('');
      setErroIA('');
    }
  };

  const imprimir = (conteudo: string, titulo: string) => {
    const janela = window.open('', '_blank');
    if (!janela) {
      alert('Permita pop-ups para imprimir.');
      return;
    }
    janela.document.write(`
      <html><head><title>${titulo}</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1525; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        h1 { color: #7c3aed; border-bottom: 2px solid #E5C158; padding-bottom: 10px; }
        h2 { color: #7c3aed; margin-top: 30px; }
        pre { white-space: pre-wrap; font-family: inherit; }
        .header { text-align: center; margin-bottom: 30px; }
        .header small { color: #666; }
        .disclaimer { margin-top: 40px; padding: 15px; background: #fef3c7; border-left: 4px solid #E5C158; font-size: 0.9em; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.8em; border-top: 1px solid #ddd; padding-top: 20px; }
      </style></head><body>
      <div class="header">
        <h1>${titulo}</h1>
        <small>Clínica Selene • ${new Date().toLocaleDateString('pt-BR')}</small>
      </div>
      <pre>${conteudo}</pre>
      <div class="disclaimer">
        <strong>Aviso:</strong> Este material é de psicoeducação e triagem, gerado com apoio de IA. 
        Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional.
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

  const enviarWhatsApp = (texto: string, titulo: string) => {
    const mensagem = `*${titulo}*\n_Clinica Selene_\n\n${texto}\n\nMaterial de psicoeducação. Não substitui avaliação clínica.`;
    window.open(`https://wa.me/5511915909002?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (!mapeamento) {
    return (
      <SiteShell>
        <div className="page-dark flex flex-col items-center justify-center text-center py-12 px-6">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-[#D8B4F8]">Nenhum mapeamento encontrado</h2>
            <p className="mb-6 text-gray-400">
              Para gerar seu mapeamento comportamental completo, inicie a avaliação integrativa.
            </p>
            <button
              onClick={() => router.push('/neuroeval')}
              className="px-6 py-3 bg-[#E5C158] text-[#040208] font-bold rounded-lg hover:bg-[#d4b045] transition-colors"
            >
              Iniciar Avaliação Integrativa
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="page-dark py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex justify-between items-center border-b border-[#D8B4F8]/30 pb-4">
            <h1 className="text-3xl font-bold text-[#D8B4F8]">Seu Mapeamento</h1>
            <button
              onClick={limparResultado}
              className="text-sm text-red-400 hover:text-red-300 underline transition-colors"
            >
              Limpar
            </button>
          </div>

          <div className="bg-[#1a1525] p-6 rounded-lg border border-[#D8B4F8]/30 shadow-xl">
            <h2 className="text-xl font-semibold mb-3 text-white">Mapeamento Completo</h2>
            <pre className="text-[#D8B4F8] whitespace-pre-line leading-relaxed text-sm font-sans">
              {mapeamento.mapeamentoTexto}
            </pre>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => imprimir(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
                className="px-4 py-2 bg-[#E5C158] text-[#040208] font-bold rounded hover:bg-[#d4b045] transition-colors"
              >
                Imprimir Mapeamento
              </button>
              <button
                onClick={() => enviarWhatsApp(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
                className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
              >
                Enviar via WhatsApp
              </button>
            </div>
          </div>

          {!analiseIA && !carregandoIA && !erroIA && (
            <button
              onClick={solicitarAnaliseIA}
              className="w-full py-4 bg-gradient-to-r from-[#D8B4F8] to-[#E5C158] text-[#040208] font-bold text-lg rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              Gerar Análise Terapêutica com IA
            </button>
          )}

          {carregandoIA && (
            <div className="bg-[#1a1525] p-8 rounded-lg border border-[#D8B4F8]/30 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E5C158] mx-auto mb-4"></div>
              <p className="text-[#D8B4F8] font-semibold">Analisando perfil com IA...</p>
              <p className="text-sm text-gray-400 mt-2">Isso pode levar até 30 segundos</p>
            </div>
          )}

          {erroIA && (
            <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-lg">
              <h3 className="text-red-300 font-bold mb-2">Não foi possível gerar a análise</h3>
              <p className="text-red-200 text-sm mb-4">{erroIA}</p>
              <div className="flex gap-3">
                <button
                  onClick={solicitarAnaliseIA}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={() => enviarWhatsApp(mapeamento.mapeamentoTexto, 'Mapeamento para Análise')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Enviar Mapeamento ao Mestre Célio
                </button>
              </div>
            </div>
          )}

          {analiseIA && (
            <div className="bg-[#0f0c16] p-6 rounded-lg border border-[#E5C158]/50 shadow-xl shadow-[#E5C158]/10">
              <h2 className="text-xl font-semibold mb-3 text-[#E5C158]">Análise Terapêutica</h2>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm font-sans">
                {analiseIA}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => imprimir(analiseIA, 'Análise Terapêutica')}
                  className="px-4 py-2 bg-[#E5C158] text-[#040208] font-bold rounded hover:bg-[#d4b045] transition-colors"
                >
                  Imprimir Análise
                </button>
                <button
                  onClick={() => enviarWhatsApp(analiseIA, 'Análise Terapêutica')}
                  className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
                >
                  Enviar via WhatsApp
                </button>
                <button
                  onClick={() => router.push('/neuroeval')}
                  className="px-4 py-2 border border-[#D8B4F8] text-[#D8B4F8] rounded hover:bg-[#D8B4F8]/10 transition-colors"
                >
                  Refazer Avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
