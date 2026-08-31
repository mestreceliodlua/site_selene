'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '../components/SiteShell';

export default function MentoriaPage() {
  const router = useRouter();
  const [mapeamento, setMapeamento] = useState<any>(null);
  const [dadosPaciente, setDadosPaciente] = useState<any>(null);
  const [analiseIA, setAnaliseIA] = useState<string>('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState<string>('');

  useEffect(() => {
    const dados = localStorage.getItem('neuroAvaliacao');
    if (dados) setMapeamento(JSON.parse(dados));
    const paciente = localStorage.getItem('dadosPacienteSelene');
    if (paciente) setDadosPaciente(JSON.parse(paciente));
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
    const dados = dadosPaciente || {};
    const nomePaciente = dados.nome || 'Não informado';
    const idadePaciente = dados.idade || '?';
    const dataNascPaciente = dados.dataNascimento || '?';
    const dataGeracao = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    janela.document.write(`
      <html><head><title>${titulo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap');
        body { font-family: 'Open Sans', Arial, sans-serif; padding: 40px; color: #1a1525; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        h1 { font-family: 'Playfair Display', Georgia, serif; color: #2a153b; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
        h2 { font-family: 'Playfair Display', Georgia, serif; color: #2a153b; margin-top: 30px; }
        h3 { font-family: 'Playfair Display', Georgia, serif; color: #2a153b; }
        pre { white-space: pre-wrap; font-family: 'Open Sans', Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .header small { color: #666; }
        .disclaimer { margin-top: 40px; padding: 15px; background: #fef3c7; border-left: 4px solid #D4AF37; font-size: 0.9em; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.8em; border-top: 1px solid #ddd; padding-top: 20px; }
        .pdf-lgpd-footer { margin-top: 3rem; padding: 1.5rem; background-color: #f8f9fa; border-left: 4px solid #D4AF37; border-radius: 4px; font-size: 10pt; color: #333; line-height: 1.5; page-break-inside: avoid; }
        .pdf-lgpd-footer h3 { font-size: 12pt; color: #2a153b; margin-top: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
        .pdf-lgpd-footer p { margin-bottom: 0.8rem; text-align: justify; }
        .pdf-lgpd-footer strong { color: #1a1a1a; }
        .pdf-signature { margin-top: 1.5rem; text-align: right; font-size: 9pt; color: #555; border-top: 1px solid #ddd; padding-top: 0.8rem; }
        .paciente-info { margin-bottom: 2rem; padding: 1rem; background: #f0ecf5; border-radius: 6px; border: 1px solid #D4AF37; }
        .paciente-info p { margin: 0.3rem 0; font-size: 0.95em; }
      </style></head><body>
      <div class="header">
        <h1>${titulo}</h1>
        <small>Clínica Selene • ${dataGeracao}</small>
      </div>
      <div class="paciente-info">
        <p><strong>Paciente:</strong> ${nomePaciente}</p>
        <p><strong>Idade:</strong> ${idadePaciente} anos | <strong>Nascimento:</strong> ${dataNascPaciente}</p>
      </div>
      <pre>${conteudo}</pre>
      <div class="disclaimer">
        <strong>Aviso:</strong> Este material é de psicoeducação e triagem integrativa.
        Não substitui avaliação clínica, diagnóstico ou acompanhamento profissional.
      </div>
      <div style="margin-top:2rem;padding:1rem;background:#f0ecf5;border-left:4px solid #D4AF37;border-radius:4px;font-size:9pt;line-height:1.5;">
        <h3 style="font-family:'Playfair Display',serif;color:#2a153b;margin-top:0;margin-bottom:0.8rem;font-size:11pt;">O que esses resultados significam?</h3>
        <p style="margin-bottom:0.6rem"><strong style="color:#2a153b">Fenômeno do Impostor:</strong> Incapacidade de internalizar conquistas. A pessoa sente que não merece o que conquistou e tem medo constante de ser "desmascarada". Quando associado a Altas Habilidades, indica masking — esconder a capacidade para se adequar, gerando exaustão e risco de burnout.</p>
        <p style="margin-bottom:0.6rem"><strong style="color:#2a153b">Espectro Narcísico:</strong> Traços de necessidade de validação externa, sensibilidade a críticas e dificuldade empática. Pode se manifestar como grandiosidade ou vulnerabilidade (a pessoa se vê como incompreendida). Impacta a aliança terapêutica.</p>
        <p style="margin-bottom:0"><strong style="color:#2a153b">Altas Habilidades / Sobreexcitabilidades:</strong> Intensidade emocional, intelectual e sensorial acima da média (Dabrowski). Pode ser confundido com TDAH, Borderline ou ansiedade se não for olhado pela lente da AH/SD. A pessoa aprende rápido mas pode ter dificuldade em concluir projetos.</p>
      </div>
      <div style="margin-top:1.5rem;padding:1rem;background:#f0faf4;border-left:4px solid #22c55e;border-radius:4px;font-size:9pt;line-height:1.5;">
        <h3 style="font-family:'Playfair Display',serif;color:#2a153b;margin-top:0;margin-bottom:0.8rem;font-size:11pt;">Recomendações Iniciais por Perfil</h3>
        <p style="margin-bottom:0.6rem"><strong style="color:#2a153b">Fenômeno do Impostor (Alto):</strong> Trabalhar reconhecimento de competências internas. Reduzir comparação externa. Exercícios de validação de conquistas e desconstrução do masking. Atenção a sinais de burnout.</p>
        <p style="margin-bottom:0.6rem"><strong style="color:#2a153b">Espectro Narcísico (Alto):</strong> Explorar necessidades de validação externa. Desenvolver empatia cognitiva e afetiva. Trabalhar regulação emocional diante a críticas. Atenção à aliança terapêutica.</p>
        <p style="margin-bottom:0"><strong style="color:#2a153b">Altas Habilidades (Alto):</strong> Psicoeducação sobre neurodivergência e sobreexcitabilidades de Dabrowski. Estratégias de grounding e regulação sensorial. Canalizar intensidade em atividades produtivas.</p>
      </div>
      <div class="pdf-lgpd-footer">
        <h3>Termo de Confidencialidade e Proteção de Dados (LGPD)</h3>
        <p><strong>1. Finalidade do Tratamento:</strong> Este relatório foi gerado com base nas respostas fornecidas pelo(a) avaliando(a) e possui finalidade estritamente informativa, orientativa e de triagem integrativa, não substituindo diagnóstico médico, neurológico ou psicológico formal.</p>
        <p><strong>2. Conformidade Legal:</strong> Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), os dados pessoais coletados (nome, data de nascimento e contato) são utilizados exclusivamente para a emissão deste documento e para eventual contato profissional para agendamento de mentoria na <strong>Clínica Selene</strong>.</p>
        <p><strong>3. Segurança Técnica e Sigilo:</strong> O processamento das respostas e a lógica de análise são realizados de forma <em>local</em> (no dispositivo do usuário). <strong>Não há envio, armazenamento ou processamento de dados sensíveis de saúde em servidores externos, nuvem ou modelos de Inteligência Artificial de terceiros</strong>, garantindo o máximo nível de sigilo, privacidade e integridade das informações.</p>
        <p><strong>4. Direitos do Titular:</strong> O(a) avaliando(a) autoriza o tratamento dos dados para as finalidades aqui descritas. A qualquer momento, é possível exercer os direitos de acesso, correção ou solicitação de exclusão dos dados cadastrais, bastando entrar em contato pelos canais oficiais da Clínica Selene.</p>
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

  const enviarWhatsApp = (texto: string, titulo: string) => {
    const dados = dadosPaciente || {};
    const nome = dados.nome || 'Não informado';
    const idade = dados.idade || '?';
    const mensagem = `*${titulo}*\n_Clinica Selene_\n\n👤 *Paciente:* ${nome} (${idade} anos)\n\n${texto}\n\nMaterial de psicoeducação. Não substitui avaliação clínica.`;
    window.open(`https://wa.me/5511915909002?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (!mapeamento) {
    return (
      <SiteShell>
        <div className="min-h-[calc(100vh-400px)] bg-[#0a0e27] flex flex-col items-center justify-center text-center py-16 px-6">
          <div className="max-w-md">
            <div className="text-7xl mb-6">📋</div>
            <h2 className="text-4xl font-bold mb-4" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              Mapeamento não encontrado
            </h2>
            <p className="mb-8 text-lg" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
              Para gerar seu mapeamento comportamental completo, inicie a avaliação integrativa.
            </p>
            <button
              onClick={() => router.push('/neuroeval')}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0a0e27',
                fontFamily: 'Open Sans, sans-serif',
                boxShadow: '0 4px 20px rgba(212,175,55,0.4)'
              }}
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
      <div className="min-h-[calc(100vh-400px)] bg-[#0a0e27] py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="flex justify-between items-center pb-4 border-b-2" style={{ borderColor: '#6B4C9A' }}>
            <h1 className="text-4xl font-bold" 
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              Seu Mapeamento
            </h1>
            <button
              onClick={limparResultado}
              className="text-sm underline transition-colors hover:opacity-80"
              style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}
            >
              Limpar
            </button>
          </div>

          {dadosPaciente && (
            <div className="rounded-xl p-5 flex flex-wrap gap-6 items-center"
                 style={{ backgroundColor: '#2a153b', border: '1px solid #D4AF37' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                     style={{ backgroundColor: '#D4AF37', color: '#0a0e27' }}>
                  {dadosPaciente.nome?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-base" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                    {dadosPaciente.nome}
                  </p>
                  <p className="text-xs" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                    {dadosPaciente.idade} anos • Avaliação em {dadosPaciente.dataAvaliacao}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl p-8 shadow-2xl border-l-4"
               style={{ 
                 backgroundColor: '#2a153b',
                 borderLeftColor: '#D4AF37',
                 boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
               }}>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3" 
                style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="text-3xl">📋</span> Mapeamento Completo
            </h2>
            <pre className="whitespace-pre-line leading-relaxed text-base font-sans mb-8"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
              {mapeamento.mapeamentoTexto}
            </pre>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => imprimir(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: '#D4AF37',
                  color: '#0a0e27',
                  fontFamily: 'Open Sans, sans-serif',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                }}
              >
                🖨️ Imprimir Mapeamento
              </button>
              <button
                onClick={() => enviarWhatsApp(mapeamento.mapeamentoTexto, 'Mapeamento Comportamental')}
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontFamily: 'Open Sans, sans-serif',
                  boxShadow: '0 4px 15px rgba(37,211,102,0.3)'
                }}
              >
                📱 Enviar via WhatsApp
              </button>
            </div>
          </div>

          {mapeamento.protocolo && (
            <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                 style={{ backgroundColor: '#2a153b', borderLeftColor: '#D4AF37', boxShadow: '0 10px 40px rgba(74,26,107,0.3)' }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                <span className="text-3xl">🧠</span> Protocolo de Rastreio Clínico
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Fenômeno do Impostor', data: mapeamento.protocolo.impostor },
                  { label: 'Espectro Narcísico', data: mapeamento.protocolo.narcisismoRel },
                  { label: 'Altas Habilidades', data: mapeamento.protocolo.ahsd },
                ].map(({ label, data }) => {
                  const cor = data.perc < 30 ? '#22c55e' : data.perc < 60 ? '#eab308' : data.perc < 80 ? '#f97316' : '#ef4444';
                  const nivel = data.perc < 30 ? 'Baixo' : data.perc < 60 ? 'Moderado' : data.perc < 80 ? 'Alto' : 'Muito Alto';
                  return (
                    <div key={label} className="text-center p-4 rounded-xl" style={{ backgroundColor: '#0a0e27', border: '1px solid #6B4C9A' }}>
                      <p className="text-xs mb-2" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>{label}</p>
                      <p className="text-3xl font-bold" style={{ color: cor }}>{data.perc}%</p>
                      <p className="text-sm font-semibold" style={{ color: cor }}>{nivel}</p>
                      <p className="text-xs mt-1" style={{ color: '#E8E0F0' }}>{data.soma}/{data.max}</p>
                    </div>
                  );
                })}
              </div>
              {mapeamento.protocolo.cruzamento && mapeamento.protocolo.cruzamento.length > 0 && (
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#0a0e27', border: '1px solid #f97316' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: '#f97316', fontFamily: 'Open Sans, sans-serif' }}>
                    Alertas de Cruzamento
                  </p>
                  {mapeamento.protocolo.cruzamento.map((a: string, i: number) => (
                    <p key={i} className="text-xs mb-1" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>• {a}</p>
                  ))}
                </div>
              )}

              <div className="p-5 rounded-xl" style={{ backgroundColor: '#0a0e27', border: '1px solid #6B4C9A' }}>
                <p className="text-sm font-bold mb-3" style={{ color: '#D4AF37', fontFamily: 'Open Sans, sans-serif' }}>
                  O que esses resultados significam?
                </p>
                <div className="space-y-3 text-xs" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                  <div>
                    <p className="font-semibold" style={{ color: '#D4AF37' }}>Fenômeno do Impostor</p>
                    <p className="mt-1">Incapacidade de internalizar conquistas. A pessoa sente que não merece o que conquistou e tem medo constante de ser "desmascarada". Quando associado a Altas Habilidades, indica masking — o paciente esconde sua capacidade para se adequar, gerando exaustão e risco de burnout.</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#D4AF37' }}>Espectro Narcísico</p>
                    <p className="mt-1">Traços de necessidade de validação externa, sensibilidade a críticas e dificuldade empática. Pode se manifestar como grandiosidade (narcisismo grandioso) ou como vulnerabilidade (a pessoa se vê como incompreendida ou vitimizada). Impacta diretamente a aliança terapêutica.</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#D4AF37' }}>Altas Habilidades / Sobreexcitabilidades</p>
                    <p className="mt-1">Intensidade emocional, intelectual e sensorial acima da média (Dabrowski). Pode ser confundido com TDAH, Borderline ou ansiedade se não for olhado pela lente da AH/SD. A pessoa aprende rápido mas pode ter dificuldade em concluir projetos por busca de perfeição ou tédio.</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl mt-4" style={{ backgroundColor: '#0a0e27', border: '1px solid #22c55e' }}>
                <p className="text-sm font-bold mb-3" style={{ color: '#22c55e', fontFamily: 'Open Sans, sans-serif' }}>
                  Recomendações Iniciais por Perfil
                </p>
                <div className="space-y-3 text-xs" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                  {mapeamento.protocolo.impostor.perc >= 60 && (
                    <div>
                      <p className="font-semibold" style={{ color: '#22c55e' }}>Fenômeno do Impostor (Alto)</p>
                      <p className="mt-1">Trabalhar reconhecimento de competências internas. Reduzir comparação externa. Exercícios de validação de conquistas e desconstrução do masking. Atenção a sinais de burnout e exaustão por "provar" valor.</p>
                    </div>
                  )}
                  {mapeamento.protocolo.narcisismoRel.perc >= 60 && (
                    <div>
                      <p className="font-semibold" style={{ color: '#22c55e' }}>Espectro Narcísico (Alto)</p>
                      <p className="mt-1">Explorar necessidades de validação externa. Desenvolver empatia cognitiva e afetiva. Trabalhar regulação emocional diante a críticas e frustrações. Atenção à aliança terapêutica.</p>
                    </div>
                  )}
                  {mapeamento.protocolo.ahsd.perc >= 60 && (
                    <div>
                      <p className="font-semibold" style={{ color: '#22c55e' }}>Altas Habilidades / Sobreexcitabilidades (Alto)</p>
                      <p className="mt-1">Psicoeducação sobre neurodivergência e sobreexcitabilidades de Dabrowski. Estratégias de grounding e regulação sensorial. Canalizar intensidade em atividades produtivas. Evitar diagnósticos equivocados (TDAH, Borderline).</p>
                    </div>
                  )}
                  {mapeamento.protocolo.impostor.perc < 60 && mapeamento.protocolo.narcisismoRel.perc < 60 && mapeamento.protocolo.ahsd.perc < 60 && (
                    <div>
                      <p className="font-semibold" style={{ color: '#22c55e' }}>Perfil Equilibrado</p>
                      <p className="mt-1">Nenhum construto apresentou nível de alerta. Manter trabalho de autoconhecimento e prevenção. Foco em fortalecimento de recursos pessoais e manutenção do equilíbrio emocional.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!analiseIA && !carregandoIA && !erroIA && (
            <button
              onClick={solicitarAnaliseIA}
              title="Análise baseada no Método Selene: Neuropsicologia, Psicanálise e Terapia Integrativa do Movimento"
              className="w-full py-5 rounded-xl font-bold text-xl transition-all hover:scale-[1.01] shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #6B4C9A 0%, #D4AF37 100%)',
                color: '#ffffff',
                fontFamily: 'Playfair Display, serif',
                boxShadow: '0 10px 30px rgba(107,76,154,0.4)'
              }}
            >
              ✨ Gerar Análise Terapêutica Personalizada
            </button>
          )}

          {carregandoIA && (
            <div className="rounded-2xl p-10 shadow-2xl text-center border-l-4"
                 style={{ 
                   backgroundColor: '#2a153b',
                   borderLeftColor: '#D4AF37',
                   boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
                 }}>
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 mx-auto mb-6"
                   style={{ borderColor: '#D4AF37' }}></div>
              <p className="text-xl font-semibold mb-2" 
                 style={{ color: '#E8E0F0', fontFamily: 'Playfair Display, serif' }}>
                Análise personalizada em andamento...
              </p>
              <p className="text-sm" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                Isso pode levar até 30 segundos
              </p>
            </div>
          )}

          {erroIA && (
            <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                 style={{ 
                   backgroundColor: '#2a153b',
                   borderLeftColor: '#ef4444',
                   boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
                 }}>
              <h3 className="text-2xl font-bold mb-3" 
                  style={{ color: '#ef4444', fontFamily: 'Playfair Display, serif' }}>
                ⚠️ Não foi possível gerar a análise
              </h3>
              <p className="text-base mb-6" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                {erroIA}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={solicitarAnaliseIA}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  🔄 Tentar Novamente
                </button>
                <button
                  onClick={() => enviarWhatsApp(mapeamento.mapeamentoTexto, 'Mapeamento para Análise')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                   Enviar Mapeamento ao Mestre Célio
                </button>
              </div>
            </div>
          )}

          {analiseIA && (
            <div className="rounded-2xl p-8 shadow-2xl border-l-4"
                 style={{ 
                   backgroundColor: '#2a153b',
                   borderLeftColor: '#D4AF37',
                   boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
                 }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3" 
                  style={{ 
                    color: '#D4AF37', 
                    fontFamily: 'Playfair Display, serif' 
                  }}>
                <span className="text-3xl">🧠</span> Análise Terapêutica
              </h2>
              <div className="whitespace-pre-line leading-relaxed text-base font-sans mb-8"
                   style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                {analiseIA}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => imprimir(analiseIA, 'Análise Terapêutica')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0a0e27',
                    fontFamily: 'Open Sans, sans-serif',
                    boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
                  }}
                >
                  🖨️ Imprimir Análise
                </button>
                <button
                  onClick={() => enviarWhatsApp(analiseIA, 'Análise Terapêutica')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    fontFamily: 'Open Sans, sans-serif',
                    boxShadow: '0 4px 15px rgba(37,211,102,0.3)'
                  }}
                >
                  📱 Enviar via WhatsApp
                </button>
                <button
                  onClick={() => router.push('/neuroeval')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: '#6B4C9A',
                    color: '#E8E0F0',
                    fontFamily: 'Open Sans, sans-serif'
                  }}
                >
                  🔄 Refazer Avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
