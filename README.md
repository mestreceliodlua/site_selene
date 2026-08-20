# 🧠 NeuroEval v2.0 - Sistema de Avaliação Neuropsicológica

![Status](https://img.shields.io/badge/status-stable-brightgreen)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-18%2B-green)
![PostgreSQL](https://img.shields.io/badge/postgresql-15%2B-blue)

## ✨ Novo na v2.0

- ✅ **Backend Seguro**: Node.js/Express com autenticação JWT
- ✅ **Banco de Dados**: PostgreSQL com criptografia AES-256
- ✅ **Conformidade**: Implementação completa LGPD/GDPR
- ✅ **Acessibilidade**: ARIA labels e navegação por teclado
- ✅ **Next.js**: Frontend React com SSR/SSG
- ✅ **Deploy Render**: Blueprint `render.yaml` incluído

---

## 📦 Estrutura do Projeto

```
anamnese-adulto/
├── app/                    # Next.js App Router (frontend)
│   ├── api/avaliacao/      # API Route Next.js
│   ├── neuroeval/          # Página da avaliação
│   └── layout.tsx
├── backend/                # API Express.js (backend separado)
│   ├── config/
│   │   ├── database.js     # Pool PostgreSQL
│   │   └── database.sql    # Schema do banco
│   ├── controllers/        # Lógica de negócio
│   ├── middleware/         # Auth JWT, error handler
│   ├── routes/             # Rotas da API
│   ├── utils/              # Crypto, audit LGPD
│   ├── server.js           # Ponto de entrada Express
│   ├── package.json        # Dependências do backend
│   └── .env.example        # Exemplo de variáveis de ambiente
├── components/             # Componentes React compartilhados
├── render.yaml             # Deploy automático no Render
├── next.config.js          # Configuração Next.js
├── Dockerfile              # Build Docker multi-stage
└── docker-compose.yml      # Orquestração local
```

---

## 🚀 Deploy no Render (Recomendado)

### Método 1: Blueprint Automático (mais fácil)

O arquivo [`render.yaml`](render.yaml) configura tudo automaticamente:

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. O Render vai criar automaticamente:
   - 🌐 Web Service **neuroeval-frontend** (Next.js)
   - 🔧 Web Service **neuroeval-backend** (Express)
   - 🗄️ PostgreSQL Database **neuroeval-db**
5. Configure as variáveis de ambiente secretas (veja abaixo)
6. Clique **"Apply"**

### Variáveis de Ambiente no Render

Após o blueprint criar os serviços, configure no dashboard do **neuroeval-backend**:

| Variável | Descrição | Como gerar |
|----------|-----------|------------|
| `DATABASE_URL` | Gerado automaticamente pelo Render | — |
| `JWT_SECRET` | Gerado automaticamente pelo Render | — |
| `ENCRYPTION_KEY` | Mínimo 32 chars | `openssl rand -base64 32` |
| `FRONTEND_URL` | URL do seu frontend no Render | Copiar do painel |
| `CORS_ORIGIN` | Mesma URL do frontend | Copiar do painel |

### Método 2: Deploy Manual

**1. Backend (Web Service)**
- **Build Command**: `cd backend && npm ci`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: `backend`
- **Environment**: Node
- Adicionar variáveis do `.env.example`

**2. Banco de Dados (PostgreSQL)**
- Criar um serviço PostgreSQL 15
- Copiar a `Internal Database URL` para `DATABASE_URL` do backend
- Executar o schema: `psql $DATABASE_URL -f backend/config/database.sql`

**3. Frontend (Web Service)**
- **Build Command**: `npm ci --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node
- Adicionar `NEXT_PUBLIC_API_URL` com a URL do backend

---

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### 1️⃣ Clonar e Instalar

```bash
git clone https://github.com/seu-usuario/anamnese-adulto.git
cd anamnese-adulto

# Frontend (Next.js)
npm install --legacy-peer-deps

# Backend
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações locais
cd ..
```

### 2️⃣ Configurar Banco de Dados

```bash
# Criar banco
createdb neuroeval

# Aplicar schema
psql -U postgres -d neuroeval -f backend/config/database.sql
```

### 3️⃣ Iniciar Servidores

```bash
# Terminal 1 - Backend (porta 3000)
cd backend
npm run dev

# Terminal 2 - Frontend Next.js (porta 3001)
npm run dev
```

### 4️⃣ Acessar

```
Frontend: http://localhost:3001
Backend API: http://localhost:3000
Health check: http://localhost:3000/health
```

---

## 🐳 Docker (Produção Local)

```bash
# Copiar variáveis de ambiente
cp backend/.env.example .env
# Editar .env com senha real

# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar
docker-compose down
```

---

## 🔌 API Reference

### Base URL
- Local: `http://localhost:3000`
- Render: `https://neuroeval-backend.onrender.com`

### Autenticação

```
POST /api/auth/register    # Registrar profissional
POST /api/auth/login       # Login
POST /api/auth/refresh     # Renovar token
POST /api/auth/logout      # Logout
```

### Avaliações

```
POST   /api/evaluations          # Criar avaliação
GET    /api/evaluations          # Listar avaliações
GET    /api/evaluations/:id      # Obter avaliação
PUT    /api/evaluations/:id      # Atualizar
DELETE /api/evaluations/:id      # Deletar (LGPD)
```

### Integração Clínica Selene

```
POST /api/selene/send/:id        # Enviar com consentimento LGPD
GET  /api/selene/history         # Histórico de transferências
POST /api/selene/revoke/:id      # Revogar consentimento
```

### Usuários

```
GET    /api/users/profile        # Perfil
PUT    /api/users/profile        # Atualizar perfil
DELETE /api/users/account        # Deletar conta (LGPD)
```

---

## 🔐 Segurança

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
| **SSL** | Render/Docker configurados | ✅ |

---

## 🛡️ LGPD Compliance

- ✅ Dados criptografados (AES-256): nomes, CPF, contatos
- ✅ Consentimento informado registrado
- ✅ Auditoria com IP, User Agent e timestamp
- ✅ Direito ao esquecimento (DELETE em cascata)
- ✅ Direito de acesso (GET endpoints)
- ✅ Revogação de consentimento (Art. 8º §5º)

---

## 🧪 Testes

```bash
# Frontend (Jest)
npm test
npm run test:coverage

# E2E (Cypress)
npm run test:e2e
```

---

## 📊 Banco de Dados

```sql
users           -- Profissionais (psicólogos, neuropsicólogos)
evaluations     -- Avaliações neuropsicológicas (dados sensíveis criptografados)
audit_log       -- Logs de auditoria LGPD
consent         -- Consentimentos informados
data_transfers  -- Transferências para Clínica Selene
```

---

## 🐛 Solução de Problemas

| Problema | Solução |
|----------|---------|
| `Cannot find module '../config/database'` | Certifique-se que `backend/config/database.js` existe |
| `ENCRYPTION_KEY deve ter mínimo 32 caracteres` | Verifique a variável `ENCRYPTION_KEY` no `.env` |
| `Build failed: Cannot find next` | Execute `npm ci --legacy-peer-deps` antes do build |
| Backend não conecta ao DB no Render | Use a `Internal Database URL` do serviço PostgreSQL |
| CORS error no frontend | Ajuste `CORS_ORIGIN` para a URL exata do frontend |

---

## 📄 Licença

MIT — veja [LICENSE](LICENSE)

---

**⭐ Se este projeto foi útil, deixe uma star! ⭐**
