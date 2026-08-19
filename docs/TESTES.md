# 📖 Documentação de Testes - NeuroEval

## Índice

1. [Testes Unitários (Jest)](#-testes-unitários-jest)
2. [Testes E2E (Cypress)](#-testes-e2e-cypress)
3. [Executar Testes](#-executar-testes)
4. [Cobertura de Código](#-cobertura-de-código)
5. [Boas Práticas](#-boas-práticas)

## 🧪 Testes Unitários (Jest)

### Configuração

Arquivo: `tests/setup.js`
- Mock do localStorage
- Mock do Chart.js
- Mock de window.print
- Helper createTestDOM()

Arquivo: `jest.config` (package.json)
- Environment: jsdom
- Cobertura mínima: 75%
- Padrão de testes: `**/*.test.js`

### Suites de Teste

#### 1. Inicialização
```javascript
describe('Inicialização', () => {
    test('deve inicializar com etapa 1')
    test('deve ter 6 etapas no total')
    test('deve iniciar com tema light')
})
```

#### 2. Cálculo de Idade
```javascript
describe('Cálculo de Idade', () => {
    test('deve calcular idade corretamente')
    test('não deve calcular idade se data estiver vazia')
    test('deve considerar mês e dia no cálculo')
})
```

#### 3. Navegação entre Etapas
```javascript
describe('Navegação entre Etapas', () => {
    test('deve avançar para próxima etapa com validação')
    test('não deve avançar se campos obrigatórios estiverem vazios')
    test('deve voltar para etapa anterior')
    test('não deve voltar se estiver na etapa 1')
    test('não deve avançar além da última etapa')
})
```

#### 4. Validação de Campos
```javascript
describe('Validação de Campos', () => {
    test('deve validar campo obrigatório preenchido')
    test('deve invalidar campo obrigatório vazio')
    test('deve setar aria-invalid quando inválido')
    test('deve remover aria-invalid quando válido')
})
```

#### 5. Tema
```javascript
describe('Tema', () => {
    test('deve alternar entre light e dark')
    test('deve aplicar tema ao document')
    test('deve atualizar ícone do tema')
    test('deve salvar tema no localStorage')
})
```

#### 6. Toast Notifications
```javascript
describe('Toast Notifications', () => {
    test('deve exibir toast com mensagem')
    test('deve esconder toast após 3 segundos')
    test('deve usar tipo padrão "info" se não especificado')
})
```

#### 7. Acessibilidade
```javascript
describe('Cobertura de Acessibilidade', () => {
    test('deve ter elementos ARIA')
    test('deve ter stepper com role navigation')
    test('deve ter form com legend')
    test('deve ter labels para inputs')
})
```

### Executar Testes Unitários

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Modo watch (desenvolvimento)
npm run test:watch

# Arquivo específico
npm test tests/neuroeval.test.js

# Padrão específico
npm test -- --testNamePattern="Cálculo de Idade"
```

## 🎯 Testes E2E (Cypress)

### Configuração

Arquivo: `cypress.config.js`
- Base URL: http://localhost:5500
- Viewport: 1280x720
- Timeout: 10 segundos

Arquivo: `cypress/support/e2e.js`
- Comandos customizados
- beforeEach hooks

### Suites de Teste

#### Fluxo Completo
```javascript
it('deve completar avaliação do início ao fim', () => {
    // Etapa 1: Dados Pessoais
    // Etapa 2: Queixa Principal
    // Etapa 3: Histórico
    // Etapa 4: Avaliação
    // Etapa 5: Resultados
    // Etapa 6: Conclusão
    // Verificar sucesso
})
```

#### Validação
```javascript
it('deve validar campos obrigatórios', () => {
    // Tentar avançar sem preencher
    // Verificar que não avançou
})
```

#### Navegação
```javascript
it('deve navegar entre etapas', () => {
    // Preencher etapa 1
    // Avançar para etapa 2
    // Voltar para etapa 1
})
```

#### Tema
```javascript
it('deve alternar tema claro/escuro', () => {
    // Click no botão de tema
    // Verificar mudança
})
```

#### Idade
```javascript
it('deve calcular idade automaticamente', () => {
    // Preencher data de nascimento
    // Verificar idade calculada
})
```

#### Persistência
```javascript
it('deve persistir dados no localStorage', () => {
    // Preencher dados
    // Verificar localStorage
})
```

#### UI/UX
```javascript
it('deve exibir barra de progresso', () => {
    // Verificar visibilidade
})

it('deve ter stepper visível', () => {
    // Verificar stepper com 6 etapas
})

it('deve marcar etapa como completa', () => {
    // Completar etapa
    // Verificar classe 'completed'
})
```

#### Navegação Keyboard
```javascript
it('deve desabilitar botão anterior na primeira etapa', () => {
    // Verificar display: none
})

it('deve mostrar submit apenas na última etapa', () => {
    // Avançar até última
    // Verificar visibilidade
})
```

#### Acessibilidade
```javascript
it('deve ter acessibilidade básica', () => {
    // Verificar roles ARIA
    // Verificar labels
    // Verificar aria-required
})
```

### Comandos Customizados

```javascript
// Preencher formulário
cy.fillEvaluationForm({
    nome: 'Teste',
    nascimento: '1990-01-01'
})

// Avançar X etapas
cy.advanceToStep(3)

// Ir para etapa específica
cy.goToStep(2)

// Limpar storage
cy.clearAllStorage()

// Verificar ARIA
cy.checkAria('input', 'aria-required', 'true')
```

### Executar Testes E2E

```bash
# Interface interativa
npm run test:e2e

# Headless (CI)
npm run test:e2e:ci

# Arquivo específico
npx cypress run --spec cypress/e2e/avaliacao.cy.js

# Modo debug
npx cypress run --debug

# Com video
npx cypress run --record
```

## 🔧 Executar Testes

### Antes de Executar

```bash
# 1. Instalar dependências
npm install

# 2. Para E2E, servidor deve estar rodando
npm run dev  # em outro terminal

# 3. Ou usar:
npm start
```

### Todos os Testes

```bash
# Unitários + Cobertura
npm test

# E2E
npm run test:e2e:ci

# Ambos
npm test && npm run test:e2e:ci
```

### Por Tipo

```bash
# Apenas unitários
npm test

# Apenas E2E
npm run test:e2e

# Com cobertura
npm run test:coverage
```

### Modo Desenvolvimento

```bash
# Unitários em watch
npm run test:watch

# E2E interativo
npm run test:e2e
# Selecionar teste e clicar em "Run"
```

## 📊 Cobertura de Código

### Verificar Cobertura

```bash
npm run test:coverage
```

Gera pasta `coverage/` com:
- `index.html` - Relatório visual
- `lcov-report/` - Detalhes por arquivo

### Limiares Mínimos

```javascript
// package.json
"coverageThreshold": {
  "global": {
    "branches": 75,
    "functions": 75,
    "lines": 75,
    "statements": 75
  }
}
```

### Arquivos Inclusos

- `script.js` - Classe NeuroEval (todos os métodos públicos)

### Cobertura Esperada

```
Statements   : 75% ( 60 / 80 )
Branches     : 75% ( 45 / 60 )
Functions    : 75% ( 20 / 27 )
Lines        : 75% ( 55 / 73 )
```

## ✅ Boas Práticas

### Escrevendo Testes

#### 1. Nomeação Clara
```javascript
// ✅ Bom
test('deve calcular idade corretamente')

// ❌ Ruim
test('age calc')
```

#### 2. Arrange-Act-Assert
```javascript
test('deve validar campo obrigatório', () => {
    // ARRANGE
    const field = document.getElementById('nomeCompleto');
    field.value = '';
    
    // ACT
    const isValid = neuroEval.validateField(field);
    
    // ASSERT
    expect(isValid).toBe(false);
})
```

#### 3. Um conceito por teste
```javascript
// ✅ Bom
test('deve validar campo preenchido')
test('deve invalidar campo vazio')

// ❌ Ruim
test('deve validar campos')
```

#### 4. Setup/Teardown
```javascript
beforeEach(() => {
    createTestDOM();
});

afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
});
```

#### 5. Mocks Apropriados
```javascript
// Mock localStorage
localStorage.getItem.mockReturnValueOnce('{"key":"value"}');

// Mock Chart.js
global.Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn()
}));
```

### Testes E2E

#### 1. Delays Apropriados
```javascript
// ✅ Com delay
cy.get('#nomeCompleto').type('Maria Silva', { delay: 10 });

// Para ações rápidas
cy.wait(100);
```

#### 2. Seletores Robustos
```javascript
// ✅ Bom
cy.get('#nomeCompleto')
cy.get('button[type="submit"]')

// ❌ Ruim
cy.get('input:first')
cy.get('.btn')
```

#### 3. Verificações Explícitas
```javascript
// ✅ Bom
cy.get('.success-message').should('be.visible');
cy.get('.step').should('have.class', 'active');

// ❌ Ruim
cy.get('.success-message');
```

#### 4. Cleanup
```javascript
beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
});
```

## 🚨 Troubleshooting

### Jest

| Erro | Solução |
|------|---------|
| `SyntaxError: Unexpected token` | Verificar babel/jest config |
| `Cannot find module` | Rodar `npm install` |
| `localStorage is not defined` | Setup.js não carregado |
| `Chart is not a function` | Mock do Chart.js faltando |

### Cypress

| Erro | Solução |
|------|---------|
| `Timed out` | Aumentar timeout em cypress.config.js |
| `Element not found` | Verificar seletor CSS |
| `Cannot read property` | Elemento ainda não renderizado (cy.wait) |
| `Port 5500 in use` | Matar processo: `lsof -i :5500` |

---

**Cobertura Mínima**: 75%  
**Testes Unitários**: 25+  
**Testes E2E**: 10+  
**Tempo Total**: ~30-60 segundos  

Última atualização: Agosto 2026
