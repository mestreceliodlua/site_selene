import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog | Clínica Selene',
  description: 'Conteúdos exclusivos sobre bem-estar, terapias integrativas e qualidade de vida.',
}

const BLOG_URL = 'https://seleneterapeutica.blogspot.com/'

const TEMAS = [
  { icon: '🌿', title: 'Bem-estar',    desc: 'Dicas para uma vida mais saudável e equilibrada' },
  { icon: '🧘', title: 'Terapias',     desc: 'Conheça nossas abordagens integrativas' },
  { icon: '💆', title: 'Autocuidado',  desc: 'Técnicas de relaxamento e cuidado pessoal' },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header tituloPagina="Blog" variante="escuro" />

      <main className="flex-grow px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[#3d2352] text-xs font-bold tracking-widest uppercase mb-2">Clínica Selene</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#2a153b] font-bold mb-3">
              Blog
            </h1>
            <p className="text-[#6B4C9A]">
              Conteúdos exclusivos sobre bem-estar, terapias e qualidade de vida
            </p>
          </div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-white/85 via-[#faf6fd]/85 to-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 p-8 md:p-12 text-center overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-[#6B4C9A]/5 rounded-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">
              <div className="text-7xl mb-6">📖</div>
              <h2 className="text-2xl font-serif text-[#3d2352] font-bold mb-3">
                Descubra Mais Sobre Nossas Terapias
              </h2>
              <p className="text-[#6B4C9A] mb-8 max-w-xl mx-auto text-sm leading-relaxed">
                No nosso blog você encontra artigos, dicas de saúde, depoimentos e muito mais sobre
                terapias integrativas, autocuidado e equilíbrio emocional.
              </p>

              {/* Theme cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 text-left">
                {TEMAS.map(({ icon, title, desc }) => (
                  <div key={title}
                    className="bg-gradient-to-br from-[#E8E0F0]/60 to-[#F5F0FA]/60 border-2 border-[#D4AF37]/40 rounded-xl p-5">
                    <div className="text-3xl mb-2">{icon}</div>
                    <h3 className="text-base font-bold text-[#3d2352] mb-1">{title}</h3>
                    <p className="text-[#6B4C9A] text-xs">{desc}</p>
                  </div>
                ))}
              </div>

              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer"
                className="btn-gold px-10 py-4 rounded-full text-base font-bold inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 17.477 5.754 17 7.5 17s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 17.477 18.247 17 16.5 17c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Visitar Blog Completo
              </a>
              <p className="text-[#6B4C9A] mt-4 text-xs">seleneterapeutica.blogspot.com</p>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-[#3d2352] font-bold text-base mb-3">✨ Por que ler nosso blog?</h3>
              <ul className="space-y-2 text-sm text-[#4a3b5c]">
                {['Conteúdo atualizado semanalmente', 'Dicas práticas de saúde', 'Explicações sobre terapias', 'Depoimentos reais'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-[#D4AF37] font-bold text-base">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-[#3d2352] font-bold text-base mb-3">📱 Siga-nos também</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#4a3b5c]">
                  <span>📷</span>
                  <span>Instagram: <strong className="text-[#3d2352]">@ClinicaSelene</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#4a3b5c]">
                  <span>💬</span>
                  <a href="https://wa.me/5511915909002" className="hover:text-[#3d2352] transition">
                    WhatsApp: <strong className="text-[#3d2352]">(11) 91590-9002</strong>
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#4a3b5c]">
                  <span>✉️</span>
                  <a href="mailto:contato@clinicaselene.pt" className="hover:text-[#3d2352] transition">
                    contato@clinicaselene.pt
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
