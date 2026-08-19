/**
 * @fileoverview Testes E2E - Fluxo completo de avaliação
 * @description Testes de ponta a ponta do formulário
 */

describe('Fluxo Completo de Avaliação Neuropsicológica', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.clearLocalStorage();
    });

    it('deve completar avaliação do início ao fim', () => {
        // Etapa 1: Dados Pessoais
        cy.get('#nomeCompleto').type('Maria Silva Santos', { delay: 10 });
        cy.get('#dataNascimento').type('1985-03-15');
        cy.get('#idade').should('not.have.value', '');
        cy.get('#genero').select('feminino');
        cy.get('#escolaridade').select('superior_completo');
        
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '2');

        // Etapa 2: Queixa Principal
        cy.get('#queixaPrincipal').type('Dificuldades de concentração e memória recente', { delay: 10 });
        cy.get('#duracaoSintomas').select('6_12_meses');
        
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '3');

        // Etapa 3: Histórico
        cy.get('#historicoFamiliar').type('Avó com Alzheimer', { delay: 10 });
        
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '4');

        // Etapa 4: Avaliação
        cy.get('#testesAplicados').type('WAIS-IV', { delay: 10 });
        cy.get('#atencao_score').type('65');
        cy.get('#memoria_score').type('50');
        
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '5');

        // Etapa 5: Resultados
        cy.get('#pontosFortes').type('Linguagem preservada', { delay: 10 });
        
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '6');

        // Etapa 6: Conclusão
        cy.get('#conclusao').type('Déficit cognitivo leve', { delay: 10 });
        
        cy.get('#submitBtn').click();
        cy.get('.success-message').should('be.visible');
    });

    it('deve validar campos obrigatórios', () => {
        // Tentar avançar sem preencher
        cy.get('#nextBtn').click();
        
        // Deve permanecer na etapa 1
        cy.get('.step.active').should('have.attr', 'data-step', '1');
    });

    it('deve navegar entre etapas', () => {
        // Preencher etapa 1
        cy.get('#nomeCompleto').type('Teste');
        cy.get('#dataNascimento').type('1990-01-01');
        cy.get('#genero').select('masculino');
        cy.get('#escolaridade').select('medio_completo');
        
        // Avançar
        cy.get('#nextBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '2');
        
        // Voltar
        cy.get('#prevBtn').click();
        cy.get('.step.active').should('have.attr', 'data-step', '1');
    });

    it('deve alternar tema claro/escuro', () => {
        cy.get('html').should('have.attr', 'data-theme');
        
        cy.get('#themeToggle').click();
        cy.get('html').invoke('attr', 'data-theme').then(theme => {
            expect(['light', 'dark']).toContain(theme);
        });
    });

    it('deve calcular idade automaticamente', () => {
        const today = new Date();
        const birthYear = today.getFullYear() - 30;
        const birthDate = `${birthYear}-01-01`;
        
        cy.get('#dataNascimento').type(birthDate);
        cy.get('#idade').should('not.be.empty');
    });

    it('deve persistir dados no localStorage', () => {
        cy.get('#nomeCompleto').type('Persistência Test');
        cy.get('#dataNascimento').type('1985-05-10');
        
        // Verificar que localStorage foi atualizado
        cy.window().then(win => {
            expect(win.localStorage.length).toBeGreaterThan(0);
        });
    });

    it('deve exibir barra de progresso', () => {
        cy.get('.progress-bar').should('be.visible');
        cy.get('.progress-fill').should('be.visible');
    });

    it('deve ter stepper visível', () => {
        cy.get('.stepper').should('be.visible');
        cy.get('.step').should('have.length', 6);
    });

    it('deve marcar etapa como completa', () => {
        // Preencher etapa 1
        cy.get('#nomeCompleto').type('Teste');
        cy.get('#dataNascimento').type('1990-01-01');
        cy.get('#genero').select('masculino');
        cy.get('#escolaridade').select('medio_completo');
        
        // Avançar
        cy.get('#nextBtn').click();
        
        // Primeira etapa deve estar completa
        cy.get('.step').eq(0).should('have.class', 'completed');
        cy.get('.step').eq(1).should('have.class', 'active');
    });

    it('deve desabilitar botão anterior na primeira etapa', () => {
        cy.get('#prevBtn').should('have.css', 'display', 'none');
    });

    it('deve mostrar submit apenas na última etapa', () => {
        // Início - submit oculto
        cy.get('#submitBtn').should('have.css', 'display', 'none');
        
        // Avançar até última etapa
        cy.get('#nomeCompleto').type('Teste');
        cy.get('#dataNascimento').type('1990-01-01');
        cy.get('#genero').select('masculino');
        cy.get('#escolaridade').select('medio_completo');
        cy.get('#nextBtn').click();
        
        cy.get('#queixaPrincipal').type('Queixa teste');
        cy.get('#nextBtn').click();
        cy.get('#nextBtn').click();
        cy.get('#testesAplicados').type('Testes');
        cy.get('#nextBtn').click();
        cy.get('#nextBtn').click();
        
        // Última etapa - submit visível
        cy.get('#submitBtn').should('have.css', 'display', 'inline-flex');
    });

    it('deve ter acessibilidade básica', () => {
        // Verificar roles ARIA
        cy.get('[role="main"]').should('exist');
        cy.get('[role="navigation"]').should('exist');
        
        // Verificar labels
        cy.get('label').should('have.length.greaterThan', 0);
        
        // Verificar inputs com required
        cy.get('[required]').should('have.attr', 'aria-required', 'true');
    });
});
