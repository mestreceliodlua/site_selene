import type { Metadata } from 'next'
import './globals.css'
import NeuroAvalModule from '@/components/NeuroAvalModule'

export const metadata: Metadata = {
  title: 'NeuroEval | Avaliação Neurológica Selene Terapias',
  description: 'Questionário de 6 etapas para mapeamento de perfil neurológico e definição de tratamento personalizado.',
}

export default function NeuroEvalPage() {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0a0e27] text-gray-100 font-sans">
        <NeuroAvalModule />
      </body>
    </html>
  )
}