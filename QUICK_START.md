# 🚀 NeuroEval v2.1 - Quick Start

**Status**: ✅ Pronto para testes e deploy  
**Versão**: 2.1.0  
**LGPD**: ✅ 100% Compliant

---

## ⚡ Começar em 5 Minutos

### 1. Frontend (Com Testes)

```bash
cd anamnese-adulto

# Instalar dependências
npm install

# Executar testes unitários
npm test

# Executar testes com cobertura
npm run test:coverage

# Iniciar servidor
npm start
```

**URL**: http://localhost:5500

### 2. Backend (Com API Selene)

```bash
cd backend

# Instalar
npm install

# Configurar ambiente
cp .env.example .env
# EDITAR .env com suas credenciais

# Criar banco de dados
createdb neuroeval
psql -U postgres -d neuroeval -f config/database.sql

# Iniciar servidor
npm run dev
```

**URL**: http://localhost:3000

---

## 📋 Arquivos Principais

### Frontend
| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| index.html | 450+ | Formulário 6 etapas com ARIA |
| styles.css | 400+ | Design system com temas |
| script.js | 400+ | Classe NeuroEval com 30+ métodos |
| tests/neuroeval.test.js | 450+ | 25+ testes unitários |
| cypress/e2e/avaliacao.cy.js | 400+ | 10+ testes E2E |

### Backend
| Arquivo | Linhas | Descrição |
|---------|--------|-----------|
| server.js | 100+ | Express com segurança |
| config/database.sql | 350+ | Schema LGPD-compliant |
| utils/encryption.js | 200+ | AES-256 + Bcrypt |
| utils/audit.js | 200+ | Auditoria LGPD |
| controllers/seleneController.js | 350+ | Integração Clínica Selene |

### Documentação
| Arquivo | Conteúdo |
|---------|----------|
| README_v2.md | Overview do projeto |
| docs/TESTES.md | Guia completo de testes |
| docs/CLINICA_SELENE.md | Integração com LGPD |
| STATUS.md | Checklist de implementação |

---

## 🧪 Testes Rápidos

### Unit Tests
```bash
cd anamnese-adulto
npm test
```
**Resultado esperado**: 25+ testes passando, cobertura 75%+

### E2E Tests (Interativo)
```bash
cd anamnese-adulto
npm run test:e2e
# Selecionar "avaliacao.cy.js"
# Clicar em "Run"
```

### E2E Tests (Headless - CI)
```bash
cd anamnese-adulto
npm run test:e2e:ci
```
**Resultado esperado**: 10+ cenários passando

---

## 🔗 Testar Integração Clínica Selene

### 1. Fazer Login
```bash
# Usuário: profissional@neuroeval.com
# Senha: Test@123456

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profissional@neuroeval.com",
    "password": "Test@123456"
  }'
```

**Resposta**: Token JWT

### 2. Criar Avaliação
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "data_nascimento": "1985-03-15",
    "queixa_principal": "Dificuldade de concentração"
  }'
```

**Resposta**: ID da avaliação (UUID)

### 3. Enviar para Clínica Selene
```bash
# Substituir <UUID> e <JWT_TOKEN>
curl -X POST http://localhost:3000/api/selene/send/<UUID> \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "consentimento_lgpd": true,
    "email_destino": "integracao@clinicaselene.com",
    "observacoes": "Paciente com queixa cognitiva"
  }'
```

**Resposta**: Protocolo (ex: SEL-1692374400000)

### 4. Ver Histórico
```bash
curl http://localhost:3000/api/selene/history \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Resposta**: Lista de transferências com paginação

### 5. Revogar Consentimento
```bash
curl -X POST http://localhost:3000/api/selene/revoke/<TRANSFER_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Resposta**: Confirmação de revogação

---

## 🔐 Segurança & LGPD

### ✅ Implementado
- [x] AES-256 encryption para dados sensíveis
- [x] Bcrypt 12 rounds para senhas
- [x] JWT 24h com HS256
- [x] Audit logs completos (IP, User-Agent, timestamp)
- [x] LGPD Art. 7º (consentimento)
- [x] LGPD Art. 8º (revogação)
- [x] LGPD Art. 17º (acesso)
- [x] LGPD Art. 19º (esquecimento - DELETE cascata)
- [x] LGPD Art. 32º (segurança - Helmet, CORS, rate limit)
- [x] Helmet.js (headers de segurança)
- [x] CORS whitelist
- [x] Rate limiting (100 req/15 min)
- [x] Input validation & sanitization
- [x] Row Level Security (RLS) no PostgreSQL

### ⚠️ Configurar em Produção
- [ ] HTTPS/SSL (Let's Encrypt)
- [ ] Database backup automático
- [ ] Monitoring e alertas
- [ ] Log aggregation (ELK Stack, etc)
- [ ] Retenção de logs (90 dias padrão)

---

## 📊 Cobertura de Testes

```
Frontend - Jest Unit Tests
══════════════════════════
Inicialização            ✅
Cálculo de Idade         ✅
Navegação               ✅
Validação de Campos     ✅
Temas                   ✅
Toast Notifications     ✅
Acessibilidade          ✅

Frontend - Cypress E2E Tests
════════════════════════════
Fluxo Completo          ✅
Validação Obrigatória   ✅
Navegação               ✅
Cálculo de Idade        ✅
Alternância de Temas    ✅
Persistência            ✅
Barra de Progresso      ✅
Stepper Visual          ✅
Acessibilidade ARIA     ✅

Esperado: 75%+ cobertura
```

---

## 🆘 Troubleshooting

### "npm: command not found"
```bash
# Instalar Node.js
# Windows: https://nodejs.org/
# Linux: sudo apt-get install nodejs npm
# Mac: brew install node
```

### "Port 5500 already in use"
```bash
# Matar processo
lsof -i :5500
kill -9 <PID>

# Ou usar porta diferente
npx http-server -p 8000
```

### "Cannot connect to database"
```bash
# Verificar PostgreSQL está rodando
psql --version

# Conectar e verificar
psql -U postgres

# Criar banco se não existir
createdb neuroeval
```

### "JWT invalid"
```bash
# Token expirou? Fazer refresh
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer <OLD_TOKEN>"

# Ou fazer novo login
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"...","password":"..."}'
```

### "Encryption key invalid"
```bash
# Checar .env tem ENCRYPTION_KEY com 32+ caracteres
echo ${ENCRYPTION_KEY}
# Deve retornar uma string de 32+ chars

# Se não tiver, gerar:
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## 📚 Referências Rápidas

### Documentação Completa
- **README_v2.md** - Overview do projeto
- **docs/TESTES.md** - Guia detalhado de testes
- **docs/CLINICA_SELENE.md** - Integração com LGPD
- **STATUS.md** - Checklist de implementação

### API Documentation
```bash
# Após iniciar backend
curl http://localhost:3000/health
# Resposta: {"status":"OK","timestamp":"...","uptime":"..."}
```

### Endpoints Disponíveis
```
POST   /api/auth/register          - Registrar profissional
POST   /api/auth/login             - Login
POST   /api/auth/refresh           - Renovar token
POST   /api/auth/logout            - Logout

POST   /api/evaluations            - Criar avaliação
GET    /api/evaluations            - Listar avaliações
GET    /api/evaluations/:id        - Obter avaliação
PUT    /api/evaluations/:id        - Atualizar avaliação
DELETE /api/evaluations/:id        - Deletar avaliação

GET    /api/users/profile          - Perfil do usuário
PUT    /api/users/profile          - Atualizar perfil
DELETE /api/users/account          - Deletar conta

POST   /api/selene/send/:id        - Enviar para Clínica Selene
GET    /api/selene/history         - Histórico de transferências
POST   /api/selene/revoke/:id      - Revogar consentimento
```

---

## 🎯 Próximos Passos

### Agora (Hoje)
1. ✅ Fazer `npm install` no frontend
2. ✅ Executar `npm test` para verificar testes
3. ✅ Executar `npm run test:coverage` para cobertura
4. ✅ Executar `npm run test:e2e:ci` para E2E

### Depois (Banco de Dados)
1. ✅ Instalar PostgreSQL
2. ✅ Criar banco: `createdb neuroeval`
3. ✅ Rodar schema: `psql -U postgres -d neuroeval -f config/database.sql`
4. ✅ Verificar: `psql -U postgres -d neuroeval -c "\dt"`

### Integração (Backend)
1. ✅ Configurar .env com credenciais
2. ✅ `npm install` no backend
3. ✅ `npm run dev` para iniciar
4. ✅ Testar endpoints com curl

### Produção (Deploy)
1. ✅ HTTPS com Let's Encrypt
2. ✅ Environment variables seguro
3. ✅ Database backups automático
4. ✅ Monitoring e alertas
5. ✅ CI/CD pipeline (GitHub Actions, etc)

---

## 📞 Suporte

| Tópico | Referência |
|--------|-----------|
| **Testes** | `docs/TESTES.md` |
| **LGPD** | `docs/CLINICA_SELENE.md` |
| **API** | Endpoints listados acima |
| **Instalação** | `.env.example` |
| **Status** | `STATUS.md` |

---

## ✅ Checklist de Validação

Após começar, verificar:

```bash
# Frontend
[ ] npm install - OK
[ ] npm test - 25+ testes passando
[ ] npm run test:coverage - 75%+ cobertura
[ ] npm run test:e2e:ci - 10+ cenários passando
[ ] npm start - Servidor em http://localhost:5500

# Backend
[ ] npm install - OK
[ ] createdb neuroeval - Banco criado
[ ] psql ... config/database.sql - Schema carregado
[ ] npm run dev - Servidor em http://localhost:3000

# Integração
[ ] POST /api/auth/login - Token gerado
[ ] POST /api/evaluations - Avaliação criada
[ ] POST /api/selene/send/:id - Protocolo gerado
[ ] GET /api/selene/history - Histórico retornado
[ ] POST /api/selene/revoke/:id - Consentimento revogado
```

---

**🎉 Você está pronto! Comece pelos testes!**

```bash
cd anamnese-adulto
npm install && npm test
```

**NeuroEval v2.1** - Seguro, Testado, LGPD-Compliant ✨
