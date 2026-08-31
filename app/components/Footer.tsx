import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t-2 py-10" 
            style={{ backgroundColor: '#0a0e27', borderColor: '#D4AF37' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-3" 
                style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
              Clínica Selene
            </h3>
            <p className="text-sm mb-2" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
              Terapias Integrativas
            </p>
            <p className="text-sm" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
              Cuidando de quem você é, de dentro para fora.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3" 
                style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
              Contato
            </h3>
            <p className="text-sm mb-2" style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
              📍 Jardim Maia — Guarulhos-SP — Brasil
            </p>
            <a href="https://wa.me/5511915909002" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-sm hover:underline"
               style={{ color: '#D4AF37', fontFamily: 'Open Sans, sans-serif' }}>
              📱 WhatsApp: (11) 91590-9002
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3" 
                style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
              Links Rápidos
            </h3>
            <div className="space-y-2">
              <Link href="/neuroeval"
                    className="block text-sm hover:underline"
                    style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Avaliação Integrativa
              </Link>
              <Link href="/protocolo"
                    className="block text-sm hover:underline"
                    style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Protocolo Clínico
              </Link>
              <Link href="/contato"
                    className="block text-sm hover:underline"
                    style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Agendar Sessão
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t text-center" 
             style={{ borderColor: '#6B4C9A' }}>
          <p className="text-sm" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
            © 2026 Clínica Selene Terapias. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
