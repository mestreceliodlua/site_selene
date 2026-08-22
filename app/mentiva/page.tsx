import type { Metadata } from 'next';
import MentivaClient from './MentivaClient';

export const metadata: Metadata = {
  title: 'Mentiva | Sua Nova Perspectiva - Clínica Selene',
  description: 'Ressignificação e nova perspectiva baseada no seu mapeamento neurocomportamental pela Terapia Integrativa do Movimento.',
};

export default function MentivaPage() {
  return <MentivaClient />;
}
