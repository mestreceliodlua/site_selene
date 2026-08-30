import type { Metadata } from 'next'
import SiteShell from '../components/SiteShell'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Clínica Selene',
  description:
    'Conheça como a Clínica Selene coleta, utiliza e protege seus dados pessoais conforme a LGPD.',
}

export default function PoliticaPrivacidadePage() {
  return (
    <SiteShell>
      <div className="page-dark py-16 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-4xl font-bold mb-2 text-center"
              style={{
                fontFamily: 'Playfair Display, serif',
                background: 'linear-gradient(135deg, #fcf6ba 0%, #D4AF37 50%, #F4E8C1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Política de Privacidade
          </h1>
          <p className="text-center text-sm mb-10"
             style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
            Última atualização: 30 de agosto de 2026
          </p>

          <div className="rounded-2xl p-8 md:p-10 shadow-2xl border-l-4 space-y-8"
               style={{
                 backgroundColor: '#2a153b',
                 borderLeftColor: '#D4AF37',
                 boxShadow: '0 10px 40px rgba(74,26,107,0.3)'
               }}>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                1. Controlador dos Dados
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                A <strong style={{ color: '#D4AF37' }}>Clínica Selene Terapias</strong>, inscrita no CNPJ sob gestão de Roscelio P. Silva (Mestre Célio D&apos;Lua), é a responsável pelo tratamento dos dados pessoais coletados por meio deste site.
              </p>
              <p className="text-sm mt-2"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Contato: <a href="mailto:contato@clinicaselene.pt" className="underline" style={{ color: '#D4AF37' }}>contato@clinicaselene.pt</a> | WhatsApp: <a href="https://wa.me/5511915909002" className="underline" style={{ color: '#D4AF37' }}>(11) 91590-9002</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                2. Dados Coletados
              </h2>
              <p className="text-sm leading-relaxed mb-2"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Coletamos apenas os dados estritamente necessários para a prestação dos nossos serviços:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc"
                  style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                <li><strong style={{ color: '#D4AF37' }}>Nome completo</strong> — para identificação e personalização do atendimento</li>
                <li><strong style={{ color: '#D4AF37' }}>Data de nascimento / Idade</strong> — para contextualização clínica</li>
                <li><strong style={{ color: '#D4AF37' }}>Número de WhatsApp</strong> — para contato e agendamento</li>
                <li><strong style={{ color: '#D4AF37' }}>Respostas da avaliação</strong> — para geração do relatório de mapeamento comportamental</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                3. Finalidade do Tratamento
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Os dados são utilizados exclusivamente para:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc mt-2"
                  style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                <li>Geração do relatório de avaliação integrativa comportamental</li>
                <li>Contato via WhatsApp para agendamento de sessões e mentoria</li>
                <li>Envio de comunicações relacionadas aos serviços contratados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                4. Base Legal
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                O tratamento é realizado com base no <strong style={{ color: '#D4AF37' }}>consentimento livre e informado</strong> do titular (Art. 7º, I da LGPD), fornecido de forma explícita por meio do checkbox no formulário de avaliação.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                5. Segurança dos Dados
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                As respostas da avaliação são processadas <strong style={{ color: '#D4AF37' }}>localmente no dispositivo do usuário</strong>, sem envio para servidores externos. Os dados de cadastro (nome, WhatsApp, data de nascimento) são armazenados apenas no navegador do usuário (localStorage) e não são transmitidos para terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                6. Compartilhamento com Terceiros
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Não compartilhamos dados pessoais com terceiros, exceto quando necessário para o envio via WhatsApp (Meta Platforms), que possui sua própria política de privacidade. Não realizamos transferência internacional de dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                7. Direitos do Titular (Art. 18 da LGPD)
              </h2>
              <p className="text-sm leading-relaxed mb-2"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Você tem direito a:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc"
                  style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                <li>Confirmação da existência de tratamento de dados</li>
                <li>Acesso aos dados pessoais tratados</li>
                <li>Correção de dados incompletos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados pessoais tratados com consentimento</li>
                <li>Revogação do consentimento a qualquer momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                8. Retenção de Dados
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Os dados são mantidos apenas pelo tempo necessário para a finalidade para a qual foram coletados. Como os dados ficam armazenados no navegador do usuário, podem ser apagados a qualquer momento limpando os dados do navegador ou solicitando via WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                9. Contato para Assuntos de Privacidade
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc mt-2"
                  style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                <li>WhatsApp: <a href="https://wa.me/5511915909002" className="underline" style={{ color: '#D4AF37' }}>(11) 91590-9002</a></li>
                <li>E-mail: <a href="mailto:contato@clinicaselene.pt" className="underline" style={{ color: '#D4AF37' }}>contato@clinicaselene.pt</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3"
                  style={{ color: '#D4AF37', fontFamily: 'Playfair Display, serif' }}>
                10. Alterações nesta Política
              </h2>
              <p className="text-sm leading-relaxed"
                 style={{ color: '#E8E0F0', fontFamily: 'Open Sans, sans-serif' }}>
                Esta política pode ser atualizada periodicamente. Recomendamos a consulta regular desta página. O uso continuado do site após alterações constitui aceitação das mudanças.
              </p>
            </section>

          </div>

          <p className="text-xs text-center mt-8 italic"
             style={{ color: '#6B4C9A', fontFamily: 'Open Sans, sans-serif' }}>
            Clínica Selene Terapias • Guarulhos-SP, Brasil
          </p>
        </div>
      </div>
    </SiteShell>
  )
}
