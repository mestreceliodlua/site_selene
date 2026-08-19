# 🆘 Guia de Troubleshooting - NeuroEval v2.0

## ❓ Problema: Erro ao instalar dependências

### Sintoma
```
npm ERR! code E404
npm ERR! 404 Not Found
```

### Solução
```bash
# 1. Limpar cache npm
npm cache clean --force

# 2. Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# 3. Reinstalar
npm install

# 4. Se persistir, usar yarn
npm install -g yarn
yarn install
```

---

## ❓ Problema: Porta 3000 já em uso

### Sintoma
```
Error: listen EADDRINUSE: address already in use :::3000
```

### Solução

**Windows:**
```bash
# Encontrar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID 1234 /F

# Ou usar porta diferente
set PORT=3001
npm run dev
```

**macOS/Linux:**
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 npm run dev
```

---

## ❓ Problema: Banco de dados não conecta

### Sintoma
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

### Verificação

```bash
# 1. PostgreSQL está rodando?
psql -U postgres

# 2. Se não funcionar, iniciar PostgreSQL
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\data" start

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# 3. Verificar credenciais em .env
cat backend/.env | grep DB_

# 4. Testar conexão
psql -h localhost -U postgres -d neuroeval
```

---

## ❓ Problema: JWT token inválido

### Sintoma
```json
{
  "error": "Token inválido",
  "message": "Token expirado ou inválido"
}
```

### Solução

```bash
# 1. Verificar token foi enviado corretamente
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:3000/api/users/profile

# 2. Renovar token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer SEU_TOKEN_ANTIGO"

# 3. Fazer novo login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"SuaSenha123!"}'
```

---

## ❓ Problema: Senha fraca recusada

### Sintoma
```json
{
  "error": "Senha fraca",
  "details": ["Senha deve ter..."]
}
```

### Requisitos de Senha

✅ Mínimo 8 caracteres  
✅ Letra maiúscula (A-Z)  
✅ Letra minúscula (a-z)  
✅ Número (0-9)  
✅ Símbolo especial (!@#$%^&*)  

### Exemplo Válido
```
SenhaForte123!
```

---

## ❓ Problema: CORS error

### Sintoma
```
Access to XMLHttpRequest at 'http://localhost:3000/api/evaluations' 
from origin 'http://localhost:5500' has been blocked by CORS policy
```

### Solução

Verificar `backend/.env`:
```env
FRONTEND_URL=http://localhost:5500
```

Se diferentes, atualizar:
```env
FRONTEND_URL=http://seu_frontend:porta
```

Reiniciar servidor backend.

---

## ❓ Problema: Dados não salvam

### Sintoma
```
Formulário salva localmente mas não no servidor
```

### Verificação

```bash
# 1. Verificar se backend está rodando
curl http://localhost:3000/health

# 2. Verificar se autenticado
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/evaluations

# 3. Verificar erros no console
# F12 > Console > Aba "Network"
# Ver response do POST

# 4. Verificar logs do servidor
# Deve aparecer no terminal onde rode "npm run dev"
```

---

## ❓ Problema: Tema não persiste

### Sintoma
```
Tema volta para claro ao recarregar
```

### Solução

```bash
# 1. Verificar localStorage no browser
# F12 > Application > LocalStorage > http://localhost:5500

# 2. Limpar dados
localStorage.clear()

# 3. Recarregar página
# Ctrl + Shift + Delete (limpar cookies/cache)

# 4. Fazer login novamente
```

---

## ❓ Problema: Gráfico não aparece

### Sintoma
```
Canvas vazio na etapa 5 de resultados
```

### Solução

```bash
# 1. Verificar se Chart.js foi carregado
# F12 > Console
typeof Chart  // Deve retorhing: function

# 2. Preencher scores dos testes
# Ida para Etapa 4 e preencher todos os campos numéricos

# 3. Verificar console de erros
# F12 > Console > Aba vermelha

# 4. Recarregar e tentar novamente
```

---

## ❓ Problema: Avaliação não deleta

### Sintoma
```
DELETE request retorna 403 Forbidden
```

### Solução

```bash
# 1. Verificar se é seu próprio registro
# GET /api/evaluations
# Comparar IDs

# 2. Renovar token (pode estar expirado)
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer TOKEN_ANTIGO"

# 3. Tentar novamente com novo token
curl -X DELETE http://localhost:3000/api/evaluations/ID \
  -H "Authorization: Bearer TOKEN_NOVO"
```

---

## 🔍 Debug Avançado

### Ativar Logs Detalhados

**Backend:**
```bash
# Terminal
NODE_ENV=development npm run dev

# Em outro terminal, monitorar logs
tail -f app.log
```

**Frontend (Console):**
```javascript
// F12 > Console
localStorage.setItem('DEBUG', 'true')
location.reload()

// Ver logs detalhados
console.log(window.neuroEval)
```

### Verificar Banco de Dados

```bash
psql -d neuroeval

# Listar usuários
SELECT email, created_at FROM users;

# Listar avaliações
SELECT id, queixa_principal, created_at FROM evaluations;

# Listar logs de auditoria
SELECT user_id, action, created_at FROM audit_log ORDER BY created_at DESC LIMIT 10;

# Ver estrutura de tabela
\d users
```

---

## 🚨 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `ENOENT: no such file` | Arquivo não encontrado | Verificar caminhos em require() |
| `EADDRINUSE` | Porta já em uso | Liberar porta ou usar outra |
| `ECONNREFUSED` | Servidor não responde | Iniciar servidor backend |
| `401 Unauthorized` | Token inválido | Fazer novo login |
| `403 Forbidden` | Sem permissão | Dados não pertencem ao usuário |
| `404 Not Found` | Rota não existe | Verificar endpoint em docs |
| `500 Internal Server Error` | Erro no servidor | Verificar logs do backend |

---

## 📞 Quando Pedir Ajuda

### Informações Necessárias

```bash
# 1. Versão Node.js
node -v

# 2. Versão PostgreSQL
psql --version

# 3. Sistema Operacional
uname -a  # macOS/Linux
ver       # Windows

# 4. Erro completo (incluir stack trace)
# Copiar saída de console/terminal

# 5. Passos para reproduzir
# Descrever ações que causaram erro

# 6. Logs relevantes
# cat backend/logs/* (se existir)
# F12 > Console output
```

### Onde Pedir Ajuda

1. **GitHub Issues**: https://github.com/seu-repo/issues
2. **Email**: support@neuroeval.com
3. **Discord**: https://discord.gg/neuroeval
4. **Stack Overflow**: Tag: `[neuroeval]`

---

## ✅ Checklist Pré-Deploy

- [ ] Node.js v18+ instalado
- [ ] PostgreSQL v12+ instalado e rodando
- [ ] Arquivo `.env` configurado
- [ ] Banco de dados criado (`createdb neuroeval`)
- [ ] Schema importado (`psql -f config/database.sql`)
- [ ] npm install executado
- [ ] Backend testado (`npm run dev`)
- [ ] Frontend acessível (`python -m http.server 5500`)
- [ ] Login funcionando
- [ ] Criar avaliação funcionando
- [ ] Gráfico exibindo
- [ ] Exportar JSON funcionando
- [ ] Tema escuro/claro funcionando
- [ ] Acessibilidade testada (Tab, F12)

---

## 🎯 Performance

### Otimizações Recomendadas

```javascript
// Frontend - Lazy load de scripts
<script defer src="script.js"></script>

// Backend - Use índices
CREATE INDEX idx_evaluations_avaliador_created 
ON evaluations(avaliador_id, created_at DESC);

// Banco - Paginate results
SELECT * FROM evaluations LIMIT 10 OFFSET 0;

// Cache - Redis (futuro)
npm install redis
```

---

## 📚 Recursos

- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [LGPD Guide](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

**Última atualização**: 18 de agosto de 2026  
**Versão**: 2.0.0  
**Compatibilidade**: Node 18+, PostgreSQL 12+, Chrome/Firefox/Safari últimas versões
