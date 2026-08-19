# 🧠 NeuroEval v2.1 - Sistema de Avaliação Neuropsicológica

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
[![Coverage](https://img.shields.io/badge/coverage-75%25-brightgreen.svg)]()
[![LGPD](https://img.shields.io/badge/LGPD-compliant-blue.svg)]()
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG2.1%20AA-green.svg)]()

## 🎯 Sobre NeuroEval

Sistema completo e seguro para avaliação neuropsicológica, desenvolvido com foco em:

- ✅ **Acessibilidade**: WCAG 2.1 Level AA compliant
- ✅ **Usabilidade**: Interface intuitiva e responsiva
- ✅ **Segurança**: Criptografia LGPD-compliant
- ✅ **Qualidade**: Testes unitários >75% cobertura + E2E
- ✅ **Documentação**: Completa e profissional
- ✅ **Integração**: Envio seguro para Clínica Selene

## 📋 Índice

- [Características](#-características)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Testes](#-testes)
- [Documentação](#-documentação)
- [Conformidade LGPD](#-conformidade-lgpd)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Características

### Interface
- 📱 **Responsiva**: Mobile, tablet e desktop
- 🎨 **Temas**: Modo claro e escuro
- ♿ **Acessível**: ARIA labels, navegação por teclado
- 📊 **Gráficos**: Visualização de perfil cognitivo (Chart.js)
- 🎯 **6 Etapas**: Formulário guiado com validação em tempo real

### Funcionalidades
- 💾 **Persistência**: Salvamento automático no localStorage
- 📤 **Exportação**: JSON, PDF, impressão
- 🔄 **Navegação**: Voltar e avançar entre etapas
- 📈 **Idade**: Cálculo automático
- 📝 **Campos**: Validação por campo obrigatório

### Integração Clínica Selene
- 🏥 **Envio Seguro**: Criptografia AES-256
- 📋 **Consentimento**: LGPD obrigatório
- 🔐 **Auditoria**: Logs completos
- 📊 **Histórico**: Rastreamento de transferências

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm 8+
- Navegador moderno (Chrome, Firefox, Safari)

### Frontend Standalone

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/neuroeval.git
cd neuroeval

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

Acesse: `http://localhost:5500`

### Backend Completo

```bash
cd backend

# Instalar e configurar
npm install
cp .env.example .env
nano .env

# Setup banco de dados
createdb neuroeval
psql -U postgres -d neuroeval -f config/database.sql

# Iniciar
npm run dev
```

API em: `http://localhost:3000`

## 📖 Uso

### Como Profissional

1. **Abra o sistema**: `http://localhost:5500`
2. **Preencha o formulário**: 6 etapas intuitivas
3. **Visualize resultados**: Gráfico e análise automática
4. **Exporte ou envie**: JSON, PDF ou Clínica Selene

### Exemplo de Fluxo

```
Etapa 1: Dados Pessoais
  ↓ (validar)
Etapa 2: Queixa Principal
  ↓ (validar)
Etapa 3: Histórico Clínico
  ↓ (validar)
Etapa 4: Avaliação Neuropsicológica
  ↓ (validar + calcular)
Etapa 5: Resultados e Análise
  ↓ (visualizar gráfico)
Etapa 6: Conclusão e Encaminhamentos
  ↓ (enviar/salvar)
Sucesso!
```

## 🧪 Testes

### Testes Unitários (Jest)

```bash
# Executar testes
npm test

# Modo watch
npm run test:watch

# Cobertura
npm run test:coverage
```

**Cobertura**: Mínimo 75%  
**Arquivos**: `tests/neuroeval.test.js` (25+ testes)

**Testes cobrem:**
- ✅ Inicialização
- ✅ Navegação entre etapas
- ✅ Validação de campos
- ✅ Cálculo de idade
- ✅ Alternância de temas
- ✅ Toast notifications
- ✅ Acessibilidade ARIA

### Testes E2E (Cypress)

```bash
# Interface interativa
npm run test:e2e

# Modo CI (headless)
npm run test:e2e:ci
```

**Cenários testados:**
- ✅ Fluxo completo de avaliação
- ✅ Validação de campos obrigatórios
- ✅ Navegação entre etapas
- ✅ Cálculo de idade
- ✅ Alternância de temas
- ✅ Persistência localStorage
- ✅ Barra de progresso
- ✅ Stepper visual
- ✅ Acessibilidade básica

### Executar Todos os Testes

```bash
# Unit + Coverage
npm test

# E2E
npm run test:e2e:ci

# Tudo
npm test && npm run test:e2e:ci
```

## 📚 Documentação

### Arquivos de Documentação

| Arquivo | Descrição |
|---------|-----------|
| [README.md](README.md) | Este arquivo |
| [docs/API.md](docs/API.md) | Documentação da API |
| [docs/GUIA_INSTALACAO.md](docs/GUIA_INSTALACAO.md) | Guia passo a passo |
| [docs/TESTES.md](docs/TESTES.md) | Guia de testes |
| [docs/LGPD.md](docs/LGPD.md) | Conformidade LGPD |
| [PARECER_PROJETO.md](PARECER_PROJETO.md) | Análise técnica |

### Exemplos de Código

#### Inicializar Aplicação

```javascript
// Automático ao carregar página
window.neuroEval = new NeuroEval();
```

#### Acessar Dados

```javascript
// Dados do formulário
console.log(window.neuroEval.formData);

// Tema atual
console.log(window.neuroEval.theme);

// Etapa atual
console.log(window.neuroEval.currentStep);
```

#### Fazer API Call (Backend)

```javascript
const token = 'seu_jwt_token';

const response = await fetch('http://localhost:3000/api/evaluations', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        nomeCompleto: 'João Silva',
        dataNascimento: '1990-01-01',
        queixaPrincipal: 'Dificuldade de concentração'
        // ... outros campos
    })
});

const data = await response.json();
console.log(data);
```

## 🔒 Conformidade LGPD

### Implementações

✅ **Dados Criptografados**
- AES-256 para informações sensíveis
- Bcrypt para senhas

✅ **Consentimento Informado**
- Campo obrigatório antes de envio
- Registro de data e hora

✅ **Auditoria Completa**
- Log de todas as ações
- IP, User Agent, timestamp
- Direito de acesso aos logs

✅ **Direito ao Esquecimento**
- DELETE endpoints implementados
- Exclusão em cascata no banco

✅ **Portabilidade**
- Exportação JSON de dados
- Formato estruturado e legível

### Segurança

| Recurso | Status |
|---------|--------|
| **Helmet.js** | ✅ Headers HTTP |
| **CORS** | ✅ Controle de origem |
| **Rate Limiting** | ✅ 100 req/15min |
| **JWT** | ✅ 24h expiração |
| **AES-256** | ✅ Dados sensíveis |
| **Bcrypt** | ✅ 12 salt rounds |
| **Validação** | ✅ Inputs e outputs |
| **HTTPS** | 🔲 Produção |

## 🤝 Contribuição

Contribuições bem-vindas! Por favor:

1. Fork o projeto
2. Crie branch: `git checkout -b feature/Nova`
3. Commit: `git commit -m 'Add Nova'`
4. Push: `git push origin feature/Nova`
5. Pull Request

### Padrões

- ESLint para linting
- Prettier para formatação
- JSDoc para documentação
- Testes para funcionalidades

## 📄 Licença

MIT © 2026 NeuroEval Team

## 📞 Contato

- **Email**: contato@neuroeval.com
- **Documentação**: https://docs.neuroeval.com
- **Issues**: https://github.com/seu-usuario/neuroeval/issues

---

**NeuroEval**: Avaliação neuropsicológica segura, acessível e compliant com LGPD. 🧠✨
