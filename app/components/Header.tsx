'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type HeaderProps = { tituloPagina?: string; variante?: string };

export default function Header({ tituloPagina = "Clínica Selene", variante = "padrao" }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Início' },
    { href: '/corpo-mente', label: 'Corpo & Mente' },
    { href: '/neuroeval', label: 'Avaliação Neurológica' },
    { href: '/contato', label: 'Contato & Agendamento' },
  ];

  return (
    <header className="fixed top-0 w-full border-b-2 z-50"
      style={{ backgroundColor: '#0a0e27', borderColor: '#D4AF37' }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: '#2a153b', border: '2px solid #D4AF37' }}>
              <span className="text-xl">🌙</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" 
                  style={{ fontFamily: 'Playfair Display, serif', color: '#D4AF37' }}>
                Clínica Selene
              </h1>
              <p className="text-[10px]" style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
                TERAPIAS INTEGRATIVAS
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    color: isActive ? '#D4AF37' : '#E8E0F0',
                    borderBottom: isActive ? '2px solid #D4AF37' : '2px solid transparent',
                    paddingBottom: '4px'
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a
            href="https://wa.me/5511915909002"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0a0e27',
              fontFamily: 'Open Sans, sans-serif'
            }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
