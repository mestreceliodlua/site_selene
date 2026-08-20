export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]" />
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b7355] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-6">
            Clínica Selene Terapias
          </p>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-white leading-tight">
            Sua Jornada de{' '}
            <span className="text-[#D4AF37]">Cura</span>{' '}
            Começa Aqui
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Mapeamento neurológico preciso e terapias integrativas para reequilibrar
            corpo, mente e emoções.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/neuroeval"
              className="bg-[#D4AF37] text-[#0a0e27] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#e5c158] transition shadow-lg"
            >
              Iniciar Avaliação Neurológica
            </a>
            <a
              href="/contato"
              className="border border-[#D4AF37]/50 text-[#D4AF37] px-8 py-4 rounded-full text-lg font-semibold hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
            >
              Falar com a Clínica
            </a>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-[#D4AF37] mb-16">
          Como Podemos Ajudar
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Avaliação Neurológica',
              desc:  'Mapeamento completo do seu perfil cognitivo e emocional em 6 etapas guiadas.',
              href:  '/neuroeval',
              cta:   'Iniciar Avaliação',
            },
            {
              title: 'Terapias Integrativas',
              desc:  'Protocolos personalizados que unem neurociência, psicologia e práticas holísticas.',
              href:  '/contato',
              cta:   'Saiba Mais',
            },
            {
              title: 'Acompanhamento Contínuo',
              desc:  'Suporte profissional ao longo da sua jornada de transformação e bem-estar.',
              href:  '/contato',
              cta:   'Agendar Consulta',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white/5 border border-[#D4AF37]/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 hover:bg-white/8 transition group"
            >
              <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">{card.title}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">{card.desc}</p>
              <a
                href={card.href}
                className="text-sm font-semibold text-[#D4AF37] hover:text-[#e5c158] transition group-hover:underline"
              >
                {card.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
