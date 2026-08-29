type HeaderProps = { tituloPagina?: string; variante?: string };

export default function Header({ tituloPagina = "Clínica Selene", variante = "padrao" }: HeaderProps) {
  // variante can be used to adjust styling; default uses opaque background
  const headerClass = variante === "transparente"
    ? "fixed top-0 w-full bg-transparent border-b border-[#D4AF37]/20 z-50"
    : "fixed top-0 w-full bg-[#0a0e27]/90 backdrop-blur-sm border-b border-[#D4AF37]/20 z-50";

  return (
    <header className={headerClass}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-serif text-[#D4AF37]">
          ✦ Selene Terapias
        </div>
        <div className="hidden md:flex gap-8 text-sm">
          <a href="/" className="hover:text-[#D4AF37] transition">Início</a>
          <a href="/neuroeval" className="hover:text-[#D4AF37] transition">Avaliação</a>
          <a href="/contato" className="hover:text-[#D4AF37] transition">Contato</a>
        </div>
        <a
          href="/neuroeval"
          className="bg-[#D4AF37] text-[#0a0e27] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e5c158] transition"
        >
          Agendar
        </a>
      </nav>
    </header>
  );
}