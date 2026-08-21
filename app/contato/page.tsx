import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contato | Clínica Selene',
  description: 'Entre em contato com a Clínica Selene Terapias em Guarulhos-SP.',
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-selene-gradient flex flex-col">
      <Header tituloPagina="Contato" variante="escuro" />

      <main className="flex-grow container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-[#3d2352] text-sm font-semibold tracking-widest uppercase mb-3">
            Fale Conosco
          </p>
          <h1 className="text-4xl font-serif text-[#2a153b] mb-4">Contato</h1>
          <p className="text-[#4a3b5c] leading-relaxed">
            Estamos aqui para ajudar. Entre em contato por qualquer canal abaixo.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-bold text-[#2a153b]">Endereço</p>
              <p className="text-[#4a3b5c] text-sm">Guarulhos — SP, Brasil</p>
              <p className="text-[#4a3b5c] text-sm">Lisboa, Portugal</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-bold text-[#2a153b]">Telefone / WhatsApp</p>
              <a href="tel:+5511915909002" className="text-sm text-[#b38728] hover:underline font-semibold">
                +55 (11) 91590-9002
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-2xl">✉</span>
            <div>
              <p className="font-bold text-[#2a153b]">E-mail</p>
              <a href="mailto:contato@clinicaselene.pt" className="text-sm text-[#b38728] hover:underline font-semibold">
                contato@clinicaselene.pt
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="text-2xl">🕐</span>
            <div>
              <p className="font-bold text-[#2a153b]">Horário de Atendimento</p>
              <p className="text-[#4a3b5c] text-sm">Segunda a Sexta: 9h – 19h</p>
              <p className="text-[#4a3b5c] text-sm">Sábado: 9h – 13h</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/agendamento" className="btn-gold text-base px-10 py-3 rounded-full">
            Agendar pelo Formulário
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
