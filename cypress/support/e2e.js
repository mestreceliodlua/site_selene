/**
 * @fileoverview Configuração de suporte Cypress
 * @description Comandos customizados e helpers
 */

// Comando para preencher formulário rapidamente
Cypress.Commands.add('fillEvaluationForm', (data = {}) => {
    const defaultData = {
        nome: 'Paciente Teste',
        nascimento: '1990-01-01',
        genero: 'masculino',
        escolaridade: 'superior_completo',
        queixa: 'Queixa de teste'
    };

    const testData = { ...defaultData, ...data };

    cy.get('#nomeCompleto').type(testData.nome);
    cy.get('#dataNascimento').type(testData.nascimento);
    cy.get('#genero').select(testData.genero);
    cy.get('#escolaridade').select(testData.escolaridade);
    cy.get('#nextBtn').click();
    
    cy.get('#queixaPrincipal').type(testData.queixa);
});

// Comando para avançar múltiplas etapas
Cypress.Commands.add('advanceToStep', (stepNumber) => {
    for (let i = 1; i < stepNumber; i++) {
        cy.get('#nextBtn').click();
        cy.wait(100);
    }
});

// Comando para voltar múltiplas etapas
Cypress.Commands.add('goToStep', (stepNumber) => {
    const currentStep = cy.get('.step.active').invoke('attr', 'data-step');
    
    currentStep.then((step) => {
        const current = parseInt(step);
        const target = parseInt(stepNumber);
        
        for (let i = current; i > target; i--) {
            cy.get('#prevBtn').click();
            cy.wait(100);
        }
    });
});

// Comando para limpar localStorage
Cypress.Commands.add('clearAllStorage', () => {
    cy.clearLocalStorage();
    cy.window().then(win => {
        win.sessionStorage.clear();
    });
});

// Comando para verificar elemento com ARIA
Cypress.Commands.add('checkAria', (selector, attribute, value) => {
    cy.get(selector).should('have.attr', attribute, value);
});

// Limpar storage antes de cada teste
beforeEach(() => {
    cy.clearLocalStorage();
});

// Log de navegação
Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, 'log');
});
