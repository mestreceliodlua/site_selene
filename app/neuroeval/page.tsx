import type { Metadata } from 'next'
import NeuroAvalModule from '@/components/NeuroAvalModule'

export const metadata: Metadata = {
  title: 'NeuroEval | Avaliação Neurológica - Clínica Selene',
  description: 'Mapeamento neurológico e emocional para sua jornada de cura na Clínica Selene Terapias.',
}

export default function NeuroEvalPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-4">
          Avaliação Neurológica Integrativa
        </h1>
        <p className="text-gray-400 text-lg">
          Responda às etapas abaixo para mapearmos seu perfil e indicarmos as melhores terapias para você.
        </p>
      </div>

      <NeuroAvalModule />
    </div>
  )
}