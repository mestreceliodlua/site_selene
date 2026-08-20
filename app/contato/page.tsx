import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato | Clínica Selene',
  description: 'Entre em contato com a Clínica Selene Terapias em Guarulhos-SP.',
}

export default function ContatoPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <p className="text-[#9B7ED9] text-sm font-semibold tracking-widest uppercase mb-3">Fale Conosco</p>
        <h1 className="text-4xl font-serif text-[#6B4C9A] mb-4">Contato</h1>
        <p className="text-[#4A4A4A] leading-relaxed">
          Estamos aqui para ajudar. Entre em contato por qualquer canal abaixo.
        </p>
      </div>

      <div className="card-selene space-y-6">
        <div className="flex items-start gap-4">
          <span className="text-2xl">📍</span>
          <div>
            <p className="font-semibold text-[#6B4C9A]">Endereço</p>
            <p className="text-[#4A4A4A] text-sm">Guarulhos — SP, Brasil</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-2xl">📞</span>
          <div>
            <p className="font-semibold text-[#6B4C9A]">Telefone / WhatsApp</p>
            <a href="tel:+5511915909002" className="text-sm text-[#D4AF37] hover:underline">
              (11) 91590-9002
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-2xl">✉</span>
          <div>
            <p className="font-semibold text-[#6B4C9A]">E-mail</p>
            <a href="mailto:contato@clinicaselene.com.br" className="text-sm text-[#D4AF37] hover:underline">
              contato@clinicaselene.com.br
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-2xl">🕐</span>
          <div>
            <p className="font-semibold text-[#6B4C9A]">Horário de Atendimento</p>
            <p className="text-[#4A4A4A] text-sm">Segunda a Sexta: 9h – 19h</p>
            <p className="text-[#4A4A4A] text-sm">Sábado: 9h – 13h</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <a href="/agendamento" className="btn-gold text-base">Agendar pelo Formulário</a>
      </div>
    </div>
  )
}
