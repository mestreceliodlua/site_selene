# 🧠 NeuroEval - Guia Completo de Instalação e Uso

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Requisitos](#requisitos)
3. [Instalação Frontend](#instalação-frontend)
4. [Instalação Backend](#instalação-backend)
5. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
6. [Executar a Aplicação](#executar-a-aplicação)
7. [Estrutura do Projeto](#estrutura-do-projeto)
8. [API Endpoints](#api-endpoints)
9. [Conformidade LGPD](#conformidade-lgpd)
10. [Segurança](#segurança)
11. [Testes](#testes)
12. [Deploy em Produção](#deploy-em-produção)

---

## 🎯 Visão Geral

**NeuroEval** é um sistema completo de avaliação neuropsicológica desenvolvido com:

- ✅ **Frontend**: HTML5 semântico, CSS moderno, JavaScript com classe NeuroEval
- ✅ **Backend**: Node.js/Express com autenticação JWT
- ✅ **Banco de Dados**: PostgreSQL com criptografia AES-256
- ✅ **Segurança**: Helmet, CORS, Rate Limiting, Validação
- ✅ **Conformidade**: LGPD, GDPR, auditoria completa
- ✅ **Acessibilidade**: WCAG 2.1 Level AA

---

## 💻 Requisitos

### Sistema
- **Node.js**: v18.0.0 ou superior
- **PostgreSQL**: v12.0 ou superior
- **npm**: v9.0.0 ou superior
- **Git**: v2.30.0 ou superior

### Recomendações
- **RAM**: Mínimo 2GB
- **Disco**: Mínimo 500MB
- **Navegador**: Chrome/Firefox/Safari (últimas 2 versões)

---

## 🎨 Instalação Frontend

### 1. Preparar Estrutura
```bash
cd anamnese-adulto
```

### 2. Arquivos Necessários
Certifique-se que você tem:
- `index.html` - Estrutura semântica com ARIA
- `styles.css` - CSS com temas claro/escuro
- `script.js` - JavaScript com classe NeuroEval

### 3. Servir Localmente
```bash
# Usando Python 3
python -m http.server 5500

# Ou usando Node.js
npx http-server -p 5500

# Ou usando VS Code Live Server (extensão)
# Abrir index.html e clicar em "Go Live"
```

### 4. Acessar Frontend
```
http://localhost:5500
```

---

## 🔧 Instalação Backend

### 1. Estrutura de Pastas
```bash
mkdir -p backend/{config,controllers,middleware,routes,utils}
cd backend
```

### 2. Inicializar npm
```bash
npm init -y
```

### 3. Instalar Dependências
```bash
npm install express cors helmet bcryptjs jsonwebtoken pg dotenv \
            express-validator express-rate-limit crypto-js morgan

npm install -D nodemon jest supertest
```

### 4. Configurar .env
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite `.env` com suas configurações:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neuroeval
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
JWT_SECRET=sua_chave_secreta_muito_forte_aqui
ENCRYPTION_KEY=sua_chave_de_criptografia_32chars
FRONTEND_URL=http://localhost:5500
```

### 5. Criar Arquivos
Copie os arquivos fornecidos para suas respectivas pastas:
- `config/database.js` → conexão com PostgreSQL
- `middleware/authMiddleware.js` → verificação JWT
- `middleware/errorHandler.js` → tratamento de erros
- `utils/crypto.js` → criptografia e senhas
- `controllers/authController.js` → lógica de autenticação
- `controllers/evaluationController.js` → CRUD de avaliações
- `routes/auth.js` → endpoints de auth
- `routes/evaluations.js` → endpoints de avaliações
- `routes/users.js` → endpoints de usuários
- `server.js` → servidor principal

---

## 🗄️ Configuração do Banco de Dados

### 1. Instalar PostgreSQL

**Windows:**
```bash
# Baixar de https://www.postgresql.org/download/windows/
# Ou usando Chocolatey
choco install postgresql
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Criar Banco de Dados
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE neuroeval;

# Sair
\q
```

### 3. Executar Script SQL
```bash
# Do diretório backend
psql -U postgres -d neuroeval -f config/database.sql
```

### 4. Verificar Criação
```bash
psql -U postgres -d neuroeval

# Listar tabelas
\dt

# Sair
\q
```

---

## 🚀 Executar a Aplicação

### Terminal 1 - Servidor Backend
```bash
cd backend
npm run dev
# ✅ Servidor rodando em http://localhost:3000
```

### Terminal 2 - Servidor Frontend
```bash
cd anamnese-adulto
python -m http.server 5500
# ✅ Frontend rodando em http://localhost:5500
```

### Verificar Saúde
```bash
# Testar backend
curl http://localhost:3000/health

# Testar frontend
curl http://localhost:5500/index.html
```

---

## 📁 Estrutura do Projeto

```
anamnese-adulto/
├── index.html                 # Frontend principal
├── styles.css                 # Estilos CSS
├── script.js                  # Lógica JavaScript
├── PARECER_PROJETO.md         # Parecer técnico
├── INSTALL_GUIDE.md          # Este arquivo
│
└── backend/
    ├── server.js             # Servidor principal
    ├── package.json          # Dependências npm
    ├── .env                  # Variáveis de ambiente
    ├── .env.example          # Template .env
    │
    ├── config/
    │   ├── database.js       # Configuração PostgreSQL
    │   └── database.sql      # Schema do banco
    │
    ├── middleware/
    │   ├── authMiddleware.js # Verificação JWT
    │   └── errorHandler.js   # Tratamento de erros
    │
    ├── controllers/
    │   ├── authController.js # Login/Register
    │   ├── evaluationController.js # CRUD avaliações
    │   └── userController.js # Perfil de usuário
    │
    ├── routes/
    │   ├── auth.js           # Rotas de auth
    │   ├── evaluations.js    # Rotas de avaliações
    │   └── users.js          # Rotas de usuários
    │
    └── utils/
        └── crypto.js         # Criptografia AES-256
```

---

## 🔌 API Endpoints

### Autenticação

#### POST `/api/auth/register`
Registra um novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "psicolog@example.com",
    "password": "SenhaForte123!",
    "nomeCompleto": "Dr. João Silva",
    "crp": "12/34567",
    "especialidade": "Neuropsicologia"
  }'
```

#### POST `/api/auth/login`
Faz login e retorna JWT
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "psicolog@example.com",
    "password": "SenhaForte123!"
  }'
```

Response:
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid-aqui",
    "email": "psicolog@example.com",
    "nomeCompleto": "Dr. João Silva"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Avaliações

#### POST `/api/evaluations`
Cria uma nova avaliação
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "Maria Silva",
    "dataNascimento": "1990-05-15",
    "queixaPrincipal": "Dificuldade de concentração",
    "atencao_score": 65,
    "memoria_score": 55,
    "funcoes_executivas_score": 70
  }'
```

#### GET `/api/evaluations`
Lista avaliações do usuário
```bash
curl http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### GET `/api/evaluations/:id`
Obtém uma avaliação específica
```bash
curl http://localhost:3000/api/evaluations/uuid-da-avaliacao \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### PUT `/api/evaluations/:id`
Atualiza uma avaliação
```bash
curl -X PUT http://localhost:3000/api/evaluations/uuid-da-avaliacao \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "diagnostico": "TDAH - Tipo Desatento"
  }'
```

#### DELETE `/api/evaluations/:id`
Deleta uma avaliação (LGPD)
```bash
curl -X DELETE http://localhost:3000/api/evaluations/uuid-da-avaliacao \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Perfil do Usuário

#### GET `/api/users/profile`
Obtém perfil do usuário autenticado
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### PUT `/api/users/profile`
Atualiza perfil do usuário
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "Dr. João Silva Atualizado",
    "especialidade": "Neuropsicologia Clínica"
  }'
```

#### DELETE `/api/users/account`
Deleta conta (LGPD - Direito ao Esquecimento)
```bash
curl -X DELETE http://localhost:3000/api/users/account \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "SenhaForte123!"
  }'
```

---

## 🔐 Conformidade LGPD

### Implementações

✅ **Consentimento Informado**
- Campos de consentimento no formulário
- Registro de consentimento no banco

✅ **Dados Criptografados**
- Nomes: AES-256
- Contatos: AES-256
- Senhas: Bcrypt com 12 salt rounds

✅ **Auditoria Completa**
- Logs de acesso em `audit_log`
- IP, User Agent, ação realizada

✅ **Direito ao Esquecimento**
- Endpoint DELETE para avaliações
- Endpoint DELETE para conta de usuário
- Cascata de deleção no banco

✅ **Direito de Acesso**
- GET endpoints retornam dados do usuário
- Export JSON disponível

---

## 🛡️ Segurança

### Implementações

| Feature | Status | Descrição |
|---------|--------|-----------|
| **Helmet.js** | ✅ | Headers HTTP de segurança |
| **CORS** | ✅ | Controle de origem |
| **Rate Limiting** | ✅ | Proteção contra brute force |
| **JWT** | ✅ | Autenticação stateless |
| **AES-256** | ✅ | Criptografia de dados sensíveis |
| **Bcrypt** | ✅ | Hash seguro de senhas |
| **HTTPS** | 🔲 | Configurar em produção |
| **2FA** | 🔲 | Adicionar em futuro |

### Boas Práticas

1. **Senhas Fortes**
   - Mínimo 8 caracteres
   - Letra maiúscula, minúscula, número e símbolo

2. **Tokens JWT**
   - Expiração: 24h
   - Refresh token: implementar em produção

3. **Variáveis de Ambiente**
   - Nunca fazer commit de `.env`
   - Usar `.env.example` como template

---

## 🧪 Testes

### Executar Testes
```bash
cd backend
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

### Estrutura de Testes
```bash
backend/
└── __tests__/
    ├── auth.test.js
    ├── evaluations.test.js
    └── utils.test.js
```

---

## 🚀 Deploy em Produção

### Checklist

- [ ] Configurar variáveis de ambiente em produção
- [ ] Usar HTTPS/SSL
- [ ] Configurar firewall
- [ ] Fazer backup do banco de dados
- [ ] Monitorar logs
- [ ] Implementar 2FA
- [ ] Certificar conformidade LGPD
- [ ] Testes de carga

### Opções de Hosting

**Node.js Backend:**
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

**PostgreSQL Database:**
- AWS RDS
- Azure Database
- DigitalOcean Managed DB
- Heroku Postgres

**Frontend Estático:**
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

---

## 📞 Suporte

### Documentação
- Frontend: `index.html` comentado
- Backend: JSDoc em todos os arquivos
- Banco: `database.sql` comentado

### Troubleshooting

**Erro: "Cannot find module..."**
```bash
npm install
```

**Erro: "Port 3000 already in use"**
```bash
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
kill -9 PID  # Matar processo
```

**Erro: "ECONNREFUSED" (PostgreSQL)**
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres
```

---

## 📄 Licença

MIT - Use livremente

---

**Última atualização:** 18 de agosto de 2026

Para suporte, abra uma issue no repositório ou entre em contato com suporte@neuroeval.com
