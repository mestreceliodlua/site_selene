'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MentivaClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [textoIA, setTextoIA] = useState('');
  const [nomeCliente, setNomeCliente] = useState('Cliente');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const dadosSalvos = sessionStorage.getItem('mentiva_data');
    if (!dadosSalvos) {
      setErro('Nenhum dado de mapeamento encontrado. Por favor, realize a avaliação na página Neuroeval primeiro.');
      setLoading(false);
      return;
    }
    const dados = JSON.parse(dadosSalvos);
    setNomeCliente(dados.nome || 'Cliente');
    fetch('/api/mentiva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: dadosSalvos,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha na comunicação com o servidor');
        return res.json();
      })
      .then((data) => {
        setTextoIA(data.texto);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErro('Ocorreu um erro ao processar sua nova perspectiva. Tente novamente.');
        setLoading(false);
      });
  }, []);

  const gerarPDF = async () => {
    const elemento = document.getElementById('relatorio-mentiva');
    if (!elemento) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 15,
      filename: `Mentiva_Clinica_Selene_${nomeCliente.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(elemento).save();
  };

  const enviarWhatsApp = () => {
    const telefoneClinica = "5511915909002";
    const resumo = textoIA.substring(0, 250).replace(/\n/g, ' ') + "...";
    const mensagem = `Olá, Mestre Celio! Meu nome é ${nomeCliente}. Acabei de finalizar minha análise Mentiva no site e gostaria de agendar uma sessão para transformarmos essa nova perspectiva em prática.\n\nResumo: ${resumo}`;
    window.open(`https://wa.me/${telefoneClinica}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E0F0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B4C9A] text-xl font-serif animate-pulse">
            Processando sua nova perspectiva...
          </p>
          <p className="text-[#2D2D2D] text-sm mt-2">Isso leva apenas alguns segundos.</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-[#E8E0F0] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-red-600 mb-4">{erro}</p>
          <button 
            onClick={() => router.push('/neuroeval')}
            className="bg-[#6B4C9A] text-white px-6 py-2 rounded hover:bg-[#9B7ED9] transition"
          >
            Voltar ao Mapeamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E0F0] py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Mentiva</h1>
          <p className="text-[#6B4C9A] text-lg">Transformando padrões em potencial. Sua nova perspectiva.</p>
        </div>
        <div id="relatorio-mentiva" className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#D4AF37]">
          <div className="flex justify-center mb-6">
            <img src="/logo-selene-metallic.png" alt="Clínica Selene" className="h-20 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <h2 className="text-2xl font-serif text-[#6B4C9A] mb-4 text-center">Olá, {nomeCliente}.</h2>
          <div className="text-[#2D2D2D] leading-relaxed whitespace-pre-wrap text-lg px-4">
            {textoIA}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic text-center">
              Disclaimer: Este é um material de psicoeducação e ressignificação gerado por inteligência artificial com base no seu mapeamento. Não substitui a avaliação clínica, diagnóstico ou acompanhamento profissional personalizado na Clínica Selene.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button onClick={gerarPDF} className="bg-[#6B4C9A] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#9B7ED9] transition flex items-center justify-center gap-2">
            📄 Baixar Relatório em PDF
          </button>
          <button onClick={enviarWhatsApp} className="bg-[#25D366] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#128C7E] transition flex items-center justify-center gap-2">
            📱 Falar com o Mestre Celio
          </button>
        </div>
      </div>
    </div>
  );
}
