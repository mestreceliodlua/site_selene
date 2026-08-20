import type { Metadata } from 'next'
import NeuroAvalModule from '@/components/NeuroAvalModule'

export const metadata: Metadata = {
  title: 'Avaliação Neurológica | Clínica Selene',
  description: 'Mapeamento neurológico e emocional para sua jornada de cura na Clínica Selene Terapias.',
}

export default function NeuroEvalPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">
          Avaliação Neurológica Integrativa
        </h1>
        <p className="text-gray-300 text-lg">
          Responda às etapas abaixo para mapearmos seu perfil e indicarmos as melhores terapias para você.
        </p>
      </div>

      <NeuroAvalModule />
    </div>
  )
}
