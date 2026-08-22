import Link from 'next/link';

type HeaderProps = {
  tituloPagina?: string;
  variante?: 'escuro' | 'claro';
};

export default function Header({ tituloPagina, variante }: HeaderProps) {
  const bgClass = variante === 'claro' ? 'bg-white/90 text-[#0a0e27]' : 'bg-[#0a0e27]/90 text-[#D4AF37]';
  return (
    <header className={`fixed top-0 w-full ${bgClass} backdrop-blur-sm border-b border-[#D4AF37]/20 z-50`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-serif">
          <Link href="/">
            <a className="hover:opacity-80 transition">✦ Selene Terapias</a>
          </Link>
        </div>
        <div className="hidden md:flex gap-8 text-sm">
          <Link href="/"><a className="hover:text-[#D4AF37] transition">Início</a></Link>
          <Link href="/neuroeval"><a className="hover:text-[#D4AF37] transition">Avaliação</a></Link>
          <Link href="/contato"><a className="hover:text-[#D4AF37] transition">Contato</a></Link>
        </div>
        {tituloPagina && (
          <h1 className="text-xl font-serif ml-4">{tituloPagina}</h1>
        )}
        <Link href="/neuroeval">
          <a className="bg-[#D4AF37] text-[#0a0e27] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition">
            Agendar
          </a>
        </Link>
      </nav>
    </header>
  );
}