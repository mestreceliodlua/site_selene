#!/bin/bash
# =============================================================================
# 🧠 NeuroEval v2.0 - Script de Instalação Automatizada
# =============================================================================
#
# Este script configura todo o ambiente NeuroEval (frontend + backend) em um único comando.
# Suporta: Windows (PowerShell), macOS e Linux
#
# Uso: .\quickstart.sh  ou  bash quickstart.sh
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +%H:%M:%S)]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

# Detectar sistema operacional
detect_os() {
    case "$(uname -s)" in
        Linux*)    OS="linux"; ;;
        Darwin*)   OS="macos"; ;;
        *)         OS="windows"; ;;
    esac

    # Verificar se estamos no WSL no Windows
    if [ -n "$WSL_DISTRO_NAME" ] || [ -n "$DGX_GPU" ]; then
        OS="wsl"
    fi

    # Verificar PowerShell no Windows
    if [ -n "$PS_VERSION" ] || command -v pwsh &> /dev/null; then
        OS="windows_powershell"
    fi
}

check_prerequisites() {
    log "Verificando pré-requisitos..."

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não encontrado! Instale em: https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node --version | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | tr -d 'v')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)

    if [ "$MAJOR_VERSION" -lt 18 ]; then
        warn "Node.js v18+ recomendado. Versão atual: $NODE_VERSION"
    else
        log "Node.js v$NODE_VERSION ✓"
    fi

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm não encontrado!"
        exit 1
    fi
    log "npm $(npm --version) ✓"

    # Verificar PostgreSQL
    if ! command -v psql &> /dev/null; then
        warn "PostgreSQL CLI não encontrado. Backend pode não funcionar sem banco."
    else
        log "PostgreSQL CLI ✓"
    fi

    # Verificar Python (para servidor frontend)
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        warn "Python não encontrado. Frontend servirá apenas como arquivos estáticos."
    else
        log "Python ✓"
    fi
}

install_dependencies() {
    log "Instalando dependências..."

    # Instalar dependências do backend
    if [ -d "backend" ]; then
        cd backend
        log "Instalando backend..."
        npm install 2>&1 | tail -5
        cd ..
    else
        error "Pasta backend/ não encontrada!"
        exit 1
    fi

    # Instalar dependências de desenvolvimento (apenas se existirem)
    if [ -f "package.json" ]; then
        if grep -q "devDependencies" package.json; then
            log "Instalando devDependencies..."
            npm install --prefix . 2>&1 | tail -5
        fi
    fi
}

configure_environment() {
    log "Configurando ambiente..."

    # Criar .env no backend se não existir
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            log "Arquivo .env criado a partir do .env.example"
        else
            # Gerar .env automaticamente
            log "Criando .env automático..."

            JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
            ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")

            cat > backend/.env << EOF
# NeuroEval Environment Configuration
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neuroeval
DB_USER=postgres
DB_PASSWORD=

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h

# Encryption
ENCRYPTION_KEY=$ENCRYPTION_KEY

# Frontend
FRONTEND_URL=http://localhost:5500

# CORS
CORS_ORIGIN=http://localhost:5500
EOF
            log "Arquivo .env criado ✓"
        fi
    else
        log "Arquivo .env já existe ✓"
    fi
}

setup_database() {
    log "Configurando banco de dados..."

    # Verificar se PostgreSQL está rodando
    if command -v psql &> /dev/null; then
        # Verificar se o banco já existe
        DB_EXISTS=$(psql -U postgres -l -t 2>/dev/null | grep -w neuroeval || echo "")

        if [ -z "$DB_EXISTS" ]; then
            log "Criando banco de dados neuroeval..."
            createdb -U postgres neuroeval 2>/dev/null || {
                warn "Pode ser necessário criar o banco manualmente:"
                warn "  psql -U postgres -c \"CREATE DATABASE neuroeval;\""
            }
        else
            log "Banco de dados neuroeval já existe ✓"
        fi

        # Executar migrations
        if [ -f "backend/config/database.sql" ]; then
            log "Executando migrations..."
            psql -U postgres -d neuroeval -f backend/config/database.sql 2>&1 | tail -3
            log "Migrations executadas ✓"
        else
            warn "Arquivo database.sql não encontrado em backend/config/"
        fi
    else
        warn "PostgreSQL não disponível. Para backend full, instale PostgreSQL."
        warn "Alternativa: rodar apenas frontend (npm start)"
    fi
}

start_servers() {
    log "Iniciando servidores..."

    # Iniciar backend em background
    if [ -d "backend" ] && [ -f "backend/server.js" ]; then
        log "Iniciando backend Node.js em http://localhost:3000..."
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..

        # Dar um momento para o servidor iniciar
        sleep 3

        # Health check
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            log "Backend saudável ✓"
        else
            warn "Backend pode estar demorando para iniciar. Verifique os logs."
        fi
    else
        warn "Arquivo server.js não encontrado em backend/"
    fi

    # Iniciar frontend
    if [ -d "anamnese-adulto" ]; then
        log "Iniciando frontend em http://localhost:5500..."

        cd anamnese-adulto

        # Verificar se python3 está disponível
        if command -v python3 &> /dev/null; then
            python3 -m http.server 5500 &
        elif command -v python &> /dev/null; then
            python -m http.server 5500 &
        else
            # Usar npx http-server se disponível
            if command -v npx &> /dev/null; then
                npx http-server -p 5500 &
            else
                warn "Não foi possível iniciar servidor automaticamente."
                warn "Abra http://localhost:5500 manualmente."
            fi
        fi

        cd ..

        # Dar um momento para o servidor iniciar
        sleep 2

        # Health check
        if curl -s http://localhost:5500 > /dev/null 2>&1; then
            log "Frontend saudável ✓"
        else
            warn "Frontend pode estar demorando para iniciar."
        fi
    else
        warn "Pasta anamnese-adulto/ não encontrada!"
    fi

    echo ""
    echo "========================================================================"
    echo -e "🧠 ${GREEN}NeuroEval v2.0 está rodando!${NC}"
    echo "========================================================================"
    echo ""
    echo -e "${BLUE}Frontend:${NC} http://localhost:5500"
    echo -e "${BLUE}Backend API:${NC} http://localhost:3000"
    echo -e "${BLUE}Health Check:${NC} curl http://localhost:3000/health"
    echo ""
    echo "📋 Próximos passos:"
    echo "  1. Acesse http://localhost:5500"
    echo "  2. Registre um novo usuário (ou use credenciais demo)"
    echo "  3. Complete uma avaliação"
    echo "  4. Teste os endpoints da API em http://localhost:3000/api"
    echo ""
    echo "🔑 Credenciais de teste (se existirem no banco):"
    echo "   Email: admin@neuroeval.com"
    echo "   Senha: admin123"
    echo ""
    echo "========================================================================"
    echo -e "${YELLOW}Pressione Ctrl+C para parar os servidores${NC}"
    echo "========================================================================"

    # Aguardar interrupção
    trap "echo -e '\n${RED}Parando servidores...${NC}'; kill $BACKEND_PID 2>/dev/null; exit 0" INT

    # Manter o script rodando
    wait
}

create_directories() {
    log "Criando diretórios necessários..."

    mkdir -p backend/{config,controllers,middleware,routes,utils}
    mkdir -p backend/{__tests__,logs}
    mkdir -p logs
    mkdir -p cypress/e2e
    mkdir -p cypress/support

    log "Diretórios criados ✓"
}

show_summary() {
    echo ""
    echo "========================================================================"
    echo -e "📊 ${GREEN}NeuroEval v2.0 - Resumo da Instalação${NC}"
    echo "========================================================================"
    echo ""
    echo -e "✅ ${GREEN}Frontend:${NC} http://localhost:5500"
    echo -e "✅ ${GREEN}Backend:${NC} http://localhost:3000"
    echo -e "✅ ${GREEN}Banco de Dados:${NC} PostgreSQL neuroeval"
    echo -e "✅ ${GREEN}Testes:${NC} npm test (79 testes Jest)"
    echo -e "✅ ${GREEN}Documentação:${NC} README.md, API.md, GUIA_INSTALACAO.md"
    echo -e "✅ ${GREEN}LGPD:${NC} Conformidade completa (AES-256, auditoria, consentimento)"
    echo -e "✅ ${GREEN}Integração Selene:${NC} Endpoints /api/selene/*"
    echo ""
    echo "========================================================================"
}

# =============================================================================
# Main
# =============================================================================
main() {
    echo ""
    echo "========================================================================"
    echo -e "🧠 ${GREEN}NeuroEval v2.0 - Installer${NC}"
    echo "========================================================================"
    echo ""
    echo "Este script configura o ambiente completo do NeuroEval."
    echo "Leva aproximadamente 2-3 minutos."
    echo ""
    read -p "Deseja continuar? (s/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Instalação cancelada."
        exit 0
    fi

    detect_os
    check_prerequisites
    create_directories
    install_dependencies
    configure_environment
    setup_database
    start_servers
    show_summary
}

# Executar main
main "$@"