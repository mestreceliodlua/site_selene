import Header from '../components/Header'
import Footer from '../components/Footer'
import { PromocoesSection } from '../components/PromocoesSection'

/* ── Dados de terapias ─────────────────────────────────────── */
const MOBILIDADE = [
  { titulo: 'Shiatsu',          desc: 'Pressão nos pontos de energia para alívio de tensões e equilíbrio dos meridianos.', icon: ShiatsuIcon },
  { titulo: 'Quiropraxia',      desc: 'Ajuste e alinhamento articular da coluna para liberdade de movimento.',             icon: QuiroIcon },
  { titulo: 'Lib. Miofascial',  desc: 'Descompressão dos tecidos musculares profundos e libertação de tensões.',           icon: MioIcon },
  { titulo: 'Drenagem Linfática',desc:'Estímulo do sistema linfático e eliminação de toxinas e edemas.',                  icon: DrenagemIcon },
]
const MENTE = [
  { titulo: 'Mentoria / Psicanálise', desc: 'Reestruturação e suporte emocional profundo para autoconhecimento.', icon: MentoriaIcon },
  { titulo: 'Reiki',                  desc: 'Canalização de energia universal para equilíbrio e cura integral.',   icon: ReikiIcon },
  { titulo: 'Terapia Cognitiva',      desc: 'Reorganização de padrões comportamentais baseada em evidências.',    icon: TerapiaIcon },
  { titulo: 'Hipnoterapia',           desc: 'Acesso ao subconsciente para ressignificação e reprogramação.',       icon: HipnoIcon },
]

/* ── Depoimentos ────────────────────────────────────────────── */
const DEPOIMENTOS = [
  { nome: 'Maria S.',       estrelas: 5, texto: 'A Clínica Selene transformou minha vida! O Shiatsu me ajudou a aliviar dores crônicas que tinha há anos. Atendimento impecável!' },
  { nome: 'João P.',        estrelas: 5, texto: 'Fiz a Avaliação Neurológica e foi incrível como conseguiram entender minhas necessidades. A Quiropraxia mudou minha postura!' },
  { nome: 'Ana Carolina M.',estrelas: 5, texto: 'Ambiente acolhedor e profissionais extremamente qualificados. A Hipnoterapia me ajudou a superar a ansiedade. Recomendo!' },
  { nome: 'Roberto L.',     estrelas: 5, texto: 'Experimentei a Drenagem Linfática e foi revigorante. Já saí me sentindo mais leve. Com certeza voltarei!' },
  { nome: 'Fernanda K.',    estrelas: 5, texto: 'A Mentoria/Psicanálise na Clínica Selene me deu clareza em momentos difíceis. Sou grata pelo cuidado e dedicação!' },
  { nome: 'Carlos Eduardo', estrelas: 5, texto: 'Profissionais atenciosos e técnicas eficazes. O Reiki me trouxe uma paz interior que eu nem sabia que era possível!' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header variante="escuro" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #3d2352 0%, #6B4C9A 50%, #2a153b 100%)' }}>
        {/* Orquídeas no hero */}
        <div className="absolute top-0 left-0 w-48 h-48 opacity-20 pointer-events-none">
          <HeroOrchid />
        </div>
        <div className="absolute bottom-0 right-0 w-56 h-56 opacity-20 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
          <HeroOrchid />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <p className="text-[#fcf6ba] text-xs font-bold tracking-widest uppercase mb-4">
            Jardim Maia — Guarulhos-SP — Brasil
          </p>
          <h1 className="text-5xl md:text-7xl font-serif mb-6"
            style={{ background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 40%, #F4E8C1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Clínica Selene
          </h1>
          <p className="text-xl md:text-2xl text-[#E8E0F0] mb-3 font-serif italic">
            Bem-vindo à sua jornada de equilíbrio e renovação
          </p>
          <p className="text-[#c8b6d6] mb-10 max-w-xl mx-auto text-sm">
            Terapias integrativas para corpo e mente — cuidando de quem você é, de dentro para fora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contato"
              className="btn-gold px-8 py-4 rounded-full text-base font-bold">
              Agendar Sessão
            </a>
            <a href="/neuroeval"
              className="px-8 py-4 rounded-full text-base font-semibold border-2 border-[#D4AF37]/60 text-[#f0e8ff] hover:bg-white/10 transition-all">
              Avaliação Neurológica
            </a>
            <a href="/protocolo"
              className="px-8 py-4 rounded-full text-base font-semibold border-2 border-[#D4AF37]/60 text-[#f0e8ff] hover:bg-white/10 transition-all">
              Protocolo Clínico
            </a>
          </div>
        </div>
      </section>

      <main className="flex-grow relative overflow-hidden">

        {/* ── Orquídeas decorativas SVG ───────────────────────── */}
        <OrchidDecor side="right" className="absolute top-6 right-0 w-40 h-64 opacity-60 pointer-events-none" />
        <OrchidDecor side="left"  className="absolute bottom-10 left-0 w-36 h-52 opacity-50 pointer-events-none" />

        {/* ── Grade de serviços ─────────────────────────────── */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-14">

            {/* Mobilidade e Cura */}
            <section>
              <h2 className="text-2xl font-serif text-[#2a153b] font-bold mb-6 pb-2 border-b-2 border-[#d4af37] inline-block">
                Cuidados de Mobilidade e Cura
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {MOBILIDADE.map(({ titulo, desc, icon: Icon }) => (
                  <a key={titulo} href="/mobilidade"
                    className="glass-card rounded-2xl p-5 shadow-xl group hover:scale-[1.025] transition-transform flex flex-col gap-3 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-xl bg-[#6B4C9A]/15 flex items-center justify-center border border-[#d4af37]/30">
                      <Icon className="w-8 h-8 text-[#6B4C9A]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-[#2a153b] font-bold">{titulo}</h3>
                      <p className="text-xs text-[#4a3b5c] mt-1 leading-relaxed">{desc}</p>
                    </div>
                    <span className="absolute -bottom-1 -right-1 opacity-30 select-none pointer-events-none" aria-hidden="true">
                      <SmallOrchid />
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* Cuidados com a Mente */}
            <section>
              <h2 className="text-2xl font-serif text-[#2a153b] font-bold mb-6 pb-2 border-b-2 border-[#d4af37] inline-block">
                Cuidados com a Mente
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {MENTE.map(({ titulo, desc, icon: Icon }) => (
                  <a key={titulo} href="/mente"
                    className="glass-card rounded-2xl p-5 shadow-xl group hover:scale-[1.025] transition-transform flex flex-col gap-3 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-xl bg-[#6B4C9A]/15 flex items-center justify-center border border-[#d4af37]/30">
                      <Icon className="w-8 h-8 text-[#6B4C9A]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-[#2a153b] font-bold">{titulo}</h3>
                      <p className="text-xs text-[#4a3b5c] mt-1 leading-relaxed">{desc}</p>
                    </div>
                    <span className="absolute -bottom-1 -right-1 opacity-30 select-none pointer-events-none" aria-hidden="true">
                      <SmallOrchid />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* ── CTA central ─────────────────────────────────── */}
          <div className="mt-14 text-center">
            <a href="/contato" className="btn-gold px-10 py-3.5 rounded-full text-base border-2 border-white/60">
              Agendar Minha Sessão
            </a>
            <p className="mt-3 text-xs text-[#4a3b5c]/80">
              Jardim Maia — Guarulhos-SP — (11) 91590-9002
            </p>
          </div>
        </div>

        {/* ── Depoimentos ──────────────────────────────────── */}
        <section className="mt-4 py-16 px-6"
          style={{ background: 'linear-gradient(135deg, rgba(61,35,82,0.06) 0%, rgba(107,76,154,0.08) 100%)' }}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-[#2a153b] font-bold mb-2">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-[#6B4C9A] text-sm">
                Avaliações reais de quem já transformou sua saúde conosco
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DEPOIMENTOS.map((dep, idx) => (
                <div key={idx}
                  className="glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  {/* Estrelas */}
                  <div className="flex gap-0.5 mb-3" aria-label={`${dep.estrelas} estrelas`}>
                    {Array.from({ length: dep.estrelas }).map((_, i) => (
                      <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" aria-hidden="true"
                        style={{ fill: 'url(#starGold)' }}>
                        <defs>
                          <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#bf953f" />
                            <stop offset="100%" stopColor="#fcf6ba" />
                          </linearGradient>
                        </defs>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#2D2D2D] text-sm leading-relaxed mb-4 italic">
                    &ldquo;{dep.texto}&rdquo;
                  </p>
                  <p className="text-[#3d2352] font-bold text-sm">— {dep.nome}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a href="https://share.google/J4X8fDTV13EUymuaC"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#6B4C9A] hover:text-[#3d2352] text-sm font-semibold transition-colors underline underline-offset-2">
                Ver mais avaliações no Google
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <PromocoesSection />

      </main>

      
    </div>
  )
}

/* ── Ícones SVG inline ─────────────────────────────────────── */
function ShiatsuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v5l-2 3h4l-2-3V7" />
      <path d="M9 11l-3 4M15 11l3 4" />
      <path d="M9 22l3-5 3 5" />
    </svg>
  )
}
function QuiroIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2v20M8 4c0 2 2 3 4 3s4-1 4-3" />
      <path d="M7 8h10M7 12h10M7 16h10" />
    </svg>
  )
}
function MioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 12c2-4 6-6 8-4s4 6 8 4" />
      <path d="M4 16c2-3 5-4 8-3s5 1 8-1" />
    </svg>
  )
}
function DrenagemIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2c-4 4-6 8-2 11s9 1 9-4-4-9-7-7z" />
      <path d="M12 13v9" />
    </svg>
  )
}
function MentoriaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
      <path d="M19 8l2 2-2 2M22 10h-5" />
    </svg>
  )
}
function ReikiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  )
}
function TerapiaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
    </svg>
  )
}
function HipnoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M3 12h3M18 12h3" />
    </svg>
  )
}

/* ── Orquídeas decorativas ──────────────────────────────────── */
function HeroOrchid() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="w-full h-full">
      <defs>
        <linearGradient id="heroOG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bf953f" />
          <stop offset="50%" stopColor="#fcf6ba" />
          <stop offset="100%" stopColor="#aa771c" />
        </linearGradient>
      </defs>
      <path fill="url(#heroOG)" d="M50 10 C60 20, 65 30, 60 40 C55 50, 45 45, 40 40 C35 35, 40 20, 50 10 Z" />
      <path fill="url(#heroOG)" d="M50 40 C60 50, 70 55, 75 50 C80 45, 70 35, 60 30 C50 25, 45 35, 50 40 Z" />
      <path fill="url(#heroOG)" d="M50 40 C40 50, 30 55, 25 50 C20 45, 30 35, 40 30 C50 25, 55 35, 50 40 Z" />
      <circle cx="50" cy="40" r="5" fill="#fff8dc" />
    </svg>
  )
}

function OrchidDecor({ side, className }: { side: 'left' | 'right'; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" aria-hidden="true"
      style={{ transform: side === 'left' ? 'scaleX(-1)' : undefined }}>
      <path d="M50 155 Q55 120 52 90 Q50 60 55 20" stroke="#d4af37" strokeWidth="2" fill="none" />
      {[20, 55, 90].map((y, i) => (
        <g key={i} transform={`translate(55,${y})`}>
          <ellipse rx="14" ry="8"  fill="#c8a8d0" opacity="0.85" />
          <ellipse rx="8"  ry="14" fill="#b890c8" opacity="0.75" />
          <ellipse rx="14" ry="8"  transform="rotate(60)"  fill="#d4af37" opacity="0.55" />
          <ellipse rx="14" ry="8"  transform="rotate(-60)" fill="#c8a8d0" opacity="0.55" />
          <circle  r="4" fill="#ffe885" opacity="0.9" />
        </g>
      ))}
      <path d="M52 80 Q30 70 20 85 Q35 75 52 80Z" fill="#7c5cd8" opacity="0.25" />
      <path d="M54 110 Q75 100 82 115 Q68 105 54 110Z" fill="#7c5cd8" opacity="0.25" />
    </svg>
  )
}

function SmallOrchid() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="10" rx="8" ry="5" fill="#d4af37" opacity="0.7" />
      <ellipse cx="12" cy="12" rx="5" ry="8" fill="#c8a8d0" opacity="0.7" />
      <circle  cx="12" cy="10" r="2.5" fill="#fff8dc" opacity="0.9" />
    </svg>
  )
}
