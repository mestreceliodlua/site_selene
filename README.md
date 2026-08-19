# 🧠 NeuroEval v2.0 - Sistema de Avaliação Neuropsicológica

![Status](https://img.shields.io/badge/status-stable-brightgreen)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-18%2B-green)
![PostgreSQL](https://img.shields.io/badge/postgresql-12%2B-blue)

## ✨ Novo na v2.0

- ✅ **Backend Seguro**: Node.js/Express com autenticação JWT
- ✅ **Banco de Dados**: PostgreSQL com criptografia AES-256
- ✅ **Conformidade**: Implementação completa LGPD/GDPR
- ✅ **Acessibilidade**: ARIA labels e navegação por teclado
- ✅ **Documentação**: JSDoc e guias completos
- ✅ **Testes**: Preparado para testes automatizados

---

## 🎯 Características Principais

### Frontend
- 📱 **Responsivo**: Mobile, tablet e desktop
- 🎨 **Temas**: Modo claro e escuro
- ♿ **Acessível**: WCAG 2.1 Level AA
- 📊 **Gráficos**: Visualização de perfil cognitivo
- 💾 **Persistência**: Salvamento automático

### Backend
- 🔐 **Autenticação**: JWT com expiração configurável
- 🛡️ **Segurança**: Helmet, CORS, Rate Limiting
- 🔒 **Criptografia**: AES-256 para dados sensíveis
- 📝 **Auditoria**: Logs completos de ações
- ⚡ **Performance**: Pool de conexões PostgreSQL

### Banco de Dados
- 📋 **Tabelas**: users, evaluations, audit_log, consent
- 🔗 **Integridade**: Foreign keys e cascatas
- 📊 **Views**: Estatísticas por usuário
- 🔐 **RLS**: Row Level Security para dados

---

## 🚀 Quick Start

### 1️⃣ Clonar Repositório
```bash
git clone https://github.com/seu-usuario/neuroeval.git
cd neuroeval
```

### 2️⃣ Instalar Frontend
```bash
# Não há dependências npm para frontend
# Apenas abrir index.html no navegador
```

### 3️⃣ Instalar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
```

### 4️⃣ Configurar Banco de Dados
```bash
# Criar banco PostgreSQL
createdb neuroeval

# Executar migrations
psql -U postgres -d neuroeval -f config/database.sql
```

### 5️⃣ Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# 🚀 Servidor rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd anamnese-adulto
python -m http.server 5500
# 🎨 Frontend rodando em http://localhost:5500
```

### 6️⃣ Acessar Aplicação
```
http://localhost:5500
```

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────┐
│         Frontend (HTML/CSS/JS)          │
│    - Formulário multietapas             │
│    - Gráfico de perfil cognitivo        │
│    - Temas claro/escuro                 │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │
┌──────────────▼──────────────────────────┐
│      Backend (Node.js/Express)          │
│    - Rotas: /api/auth, evaluations      │
│    - Middleware: JWT, CORS, Rate Limit  │
│    - Controladores: lógica de negócio   │
└──────────────┬──────────────────────────┘
               │ TCP/IP
               │
┌──────────────▼──────────────────────────┐
│    Banco de Dados (PostgreSQL)          │
│    - Tabelas criptografadas             │
│    - Auditoria LGPD completa            │
│    - Índices otimizados                 │
└─────────────────────────────────────────┘
```

---

## 🔐 Segurança

### Implementações

| Recurso | Descrição | Status |
|---------|-----------|--------|
| **Helmet.js** | Headers HTTP de segurança | ✅ |
| **CORS** | Controle de origem | ✅ |
| **Rate Limiting** | Max 100 req / 15 min | ✅ |
| **JWT** | Tokens com expiração | ✅ |
| **Bcrypt** | Hash de senhas (12 rounds) | ✅ |
| **AES-256** | Criptografia de dados sensíveis | ✅ |
| **Auditoria** | Logs de todas as ações | ✅ |
| **LGPD** | Direito ao esquecimento | ✅ |

---

## 📚 Documentação

- [📘 Guia de Instalação](INSTALL_GUIDE.md) - Instruções detalhadas
- [📋 Parecer do Projeto](PARECER_PROJETO.md) - Análise técnica
- [🔌 API Reference](#api-reference) - Endpoints disponíveis
- [🛡️ LGPD Compliance](#lgpd-compliance) - Conformidade regulatória

---

## 🔌 API Reference

### Autenticação

```javascript
// Register
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nomeCompleto": "Dr. João"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
// Response: { token, user }

// Refresh Token
POST /api/auth/refresh
// Headers: Authorization: Bearer TOKEN
```

### Avaliações

```javascript
// Criar
POST /api/evaluations
Headers: Authorization: Bearer TOKEN
{ ...avaliationData }

// Listar
GET /api/evaluations?page=1&limit=10
Headers: Authorization: Bearer TOKEN

// Obter
GET /api/evaluations/:id
Headers: Authorization: Bearer TOKEN

// Atualizar
PUT /api/evaluations/:id
Headers: Authorization: Bearer TOKEN
{ ...updates }

// Deletar (LGPD)
DELETE /api/evaluations/:id
Headers: Authorization: Bearer TOKEN
```

### Usuários

```javascript
// Perfil
GET /api/users/profile
Headers: Authorization: Bearer TOKEN

// Atualizar Perfil
PUT /api/users/profile
Headers: Authorization: Bearer TOKEN
{ nomeCompleto, crp, especialidade }

// Deletar Conta (LGPD)
DELETE /api/users/account
Headers: Authorization: Bearer TOKEN
{ password }
```

---

## 🛡️ LGPD Compliance

### Implementações

✅ **Dados Criptografados**
- Nomes, CPF, contatos
- Algoritmo: AES-256

✅ **Consentimento**
- Campo de consentimento informado
- Registro de consentimento

✅ **Auditoria**
- Log de todas as ações
- IP, User Agent, timestamp

✅ **Direito ao Esquecimento**
- DELETE de avaliações
- DELETE de conta com cascata

✅ **Direito de Acesso**
- GET endpoints retornam dados
- Export JSON disponível

✅ **Integridade**
- Validações no backend
- Hash verificável

---

## 📊 Estrutura do Banco

```sql
-- Tabelas principais
users          -- Profissionais
evaluations    -- Avaliações
audit_log      -- Logs LGPD
consent        -- Consentimentos

-- Índices
idx_users_email
idx_evaluations_avaliador
idx_audit_log_created_at

-- Triggers
update_users_updated_at
update_evaluations_updated_at
```

---

## 🧪 Testes

```bash
cd backend

# Executar testes
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

---

## 📈 Performan

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Adicionar suporte a múltiplos idiomas (i18n)
- [ ] Criar dashboard de estatísticas
- [ ] Integração com API externa de psicólogos
- [ ] Relatórios em PDF automáticos
- [ ] Mobile app (React Native)
- [ ] Webhook para notificações

---

## 🐛 Reportar Bugs

Abra uma [Issue](https://github.com/seu-usuario/neuroeval/issues) com:
- Descrição clara do bug
- Passos para reproduzir
- Comportamento esperado vs real
- Prints/Videos

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE)

---

## 👨‍💼 Autores

- **NeuroEval Team** - Desenvolvimento
- **Contribuidores** - Melhorias e correções

---

## 📞 Contato

- Email: support@neuroeval.com
- Discord: [NeuroEval Community](https://discord.gg/neuroeval)
- Issues: [GitHub Issues](https://github.com/seu-usuario/neuroeval/issues)

---

## 🙏 Agradecimentos

- PostgreSQL Team
- Express.js Community
- Chart.js
- Todos os contribuidores

---

**⭐ Se este projeto foi útil, deixe uma star! ⭐**

```
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🧠 NeuroEval - Avaliação Neuropsicológica  ║
  ║                                               ║
  ║   v2.0.0 - Seguro, Acessível e Conformado   ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
```
