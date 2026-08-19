<# =============================================================================
# 🧠 NeuroEval v2.0 - PowerShell Automatized Installation Script
# =============================================================================
#
# Este script configura todo o ambiente NeuroEval (frontend + backend) em um único comando.
# Windows PowerShell compatible.
#
# Execução: .\quickstart.ps1 ou powershell -ExecutionPolicy Bypass -File quickstart.ps1
# =============================================================================

Write-Host "🧠 NeuroEval v2.0 - Installer" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Verificar se estamos sendo executados corretamente
if (-not $PSVersionTable) {
    Write-Error "Este script precisa ser executado no PowerShell"
    exit 1
}

function Log-Green {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Green
}

function Log-Yellow {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Yellow
}

function Log-Red {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Red
}

function Log-Blue {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor Blue
}

# Detectar sistema
Write-Host "Detectando sistema operacional..." -ForegroundColor Cyan

$os = "windows"
if (Test-Path /proc/sys/kernel/ostype) { $os = "linux" }
elseif (Test-Path /System/Library/CoreServices/SystemVersion) { $os = "macos" }

Write-Host "Sistema operacional: $os" -ForegroundColor Cyan

# Verificar pré-requisitos
Write-Host "Verificando pré-requisitos..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js não encontrado! Instale em: https://nodejs.org/"
    exit 1
} else {
    $nodeVersion = (node --version).Replace('v', '')
    Write-Host "Node.js $nodeVersion ✓" -ForegroundColor Green
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm não encontrado!"
    exit 1
} else {
    Write-Host "npm $(npm --version) ✓" -ForegroundColor Green
}

if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "PostgreSQL CLI ✓" -ForegroundColor Green
} else {
    Write-Host "Aviso: PostgreSQL CLI não encontrado" -ForegroundColor Yellow
}

if (-not (Get-Command python -ErrorAction SilentlyContinue) -and -not (Get-Command python3 -ErrorAction SilentlyContinue)) {
    Write-Host "Aviso: Python não encontrado. Frontend servirá apenas arquivos estáticos." -ForegroundColor Yellow
}

# Diretórios
Write-Host "Criando diretórios..." -ForegroundColor Cyan

$dirs = @("backend/config", "backend/controllers", "backend/middleware", "backend/routes", "backend/utils",
          "backend/__tests__", "logs", "cypress/e2e", "cypress/support")

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir -PathType Container)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✓ $dir criado" -ForegroundColor Green
    }
}

# Instalar dependências do backend
Write-Host "Instalando dependências do backend..." -ForegroundColor Cyan

Set-Location .\backend
try {
    npm install | Out-Null
    Write-Host "Dependências do backend instaladas ✓" -ForegroundColor Green
} catch {
    Write-Erro "Falha ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Configurar .env
Write-Host "Configurando ambiente..." -ForegroundColor Cyan

$envFile = ".\backend\.env"
if (-not (Test-Path $envFile)) {
    if (Test-Path .\backend\.env.example) {
        Copy-Item .\backend\.env.example .\backend\.env
        Write-Host "Arquivo .env criado a partir do .env.example" -ForegroundColor Green
    } else {
        # Gerar .env automaticamente
        $jwtSecret = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumber]::GetBytes(32)) -replace '[+/]=$', ''
        $encryptionKey = [BitConverter]::ToString([System.Security.Cryptography.RandomNumber]::GetBytes(16)) -replace '-', '').ToLower()

        $envContent = @"
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
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h

# Encryption
ENCRYPTION_KEY=$encryptionKey

# Frontend
FRONTEND_URL=http://localhost:5500

# CORS
CORS_ORIGIN=http://localhost:5500
"@

        $envContent | Out-File -Encoding UTF8 $envFile
        Write-Host "Arquivo .env criado automaticamente ✓" -ForegroundColor Green
    }
} else {
    Write-Host "Arquivo .env já existe ✓" -ForegroundColor Green
}

# Configurar banco de dados
Write-Host "Configurando banco de dados..." -ForegroundColor Cyan

if (Get-Command psql -ErrorAction SilentlyContinue) {
    try {
        $dbCheck = psql -U postgres -l -t 2>$null | Select-String "neuroeval"
        if (-not $dbCheck) {
            Write-Host "Criando banco de dados neuroeval..." -ForegroundColor Yellow
            psql -U postgres -c "CREATE DATABASE neuroeval;" 2>$null | Out-Null
        } else {
            Write-Host "Banco de dados neuroeval já existe ✓" -ForegroundColor Green
        }

        Write-Host "Executando migrations..." -ForegroundColor Yellow
        if (Test-Path .\backend\config\database.sql) {
            psql -U postgres -d neuroeval -f .\backend\config\database.sql 2>$null | Out-Null
            Write-Host "Migrations executadas ✓" -ForegroundColor Green
        } else {
            Write-Host "Aviso: Arquivo database.sql não encontrado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Aviso: Configure o banco de dados manualmente" -ForegroundColor Yellow
        Write-Host "  Execute: psql -U postgres -c "CREATE DATABASE neuroeval;"`n"  -ForegroundColor Cyan
    }
} else {
    Write-Host "Aviso: PostgreSQL não disponível. Para backend full, instale PostgreSQL." -ForegroundColor Yellow
    Write-Host "Alternativa: rodar apenas frontend" -ForegroundColor Cyan
}

# Iniciar servidores
Write-Host "Iniciando servidores..." -ForegroundColor Cyan

# Iniciar backend
$backendRunning = $false
if (Test-Path .\backend\server.js) {
    Write-Host "Iniciando backend Node.js em http://localhost:3000..." -ForegroundColor Cyan
    $backendProcess = Start-Job -ScriptBlock { cd .\backend; npm run dev } -Name "NeuroEval_Backend"
    Start-Sleep -Seconds 3

    # Health check
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Backend saudável ✓" -ForegroundColor Green
        $backendRunning = $true
    } catch {
        Write-Host "Backend em inicialização... Acesse http://localhost:3000 manualmente" -ForegroundColor Yellow
    }
} else {
    Write-Host "Aviso: backend\server.js não encontrado" -ForegroundColor Yellow
}

# Iniciar frontend
Write-Host "Iniciando frontend em http://localhost:5500..." -ForegroundColor Cyan

$frontendProcess = Start-Job -ScriptBlock {
    cd .\anamnese-adulto
    if (Get-Command python3 -ErrorAction SilentlyContinue) {
        python3 -m http.server 5500
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        python -m http.server 5500
    } else {
        Write-Host "Iniciando http-server..." -ForegroundColor Cyan
        # Try to use npx if available
        if (Get-Command npx -ErrorAction SilentlyContinue) {
            npx http-server -p 5500
        }
    }
} -Name "NeuroEval_Frontend"

Start-Sleep -Seconds 2

# Health check do frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5500" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Frontend saudável ✓" -ForegroundColor Green
} catch {
    Write-Host "Frontend em inicialização. Abra http://localhost:5500 manualmente" -ForegroundColor Yellow
}

# Resultado final
Write-Host "" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "🧠 NeuroEval v2.0 está rodando!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Log-Blue "Frontend:    http://localhost:5500"
Log-Blue "Backend API: http://localhost:3000"
Log-Blue "Health:      curl http://localhost:3000/health"
Write-Host "" -ForegroundColor Green
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. Acesse http://localhost:5500" -ForegroundColor White
Write-Host "  2. Registre um novo usuário" -ForegroundColor White
Write-Host "  3. Complete uma avaliação" -ForegroundColor White
Write-Host "  4. Teste os endpoints da API em http://localhost:3000/api" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "🔑 Credenciais de teste:" -ForegroundColor Yellow
Write-Host "  Email: admin@neuroeval.com" -ForegroundColor White
Write-Host "  Senha: admin123" -ForegroundColor White
Write-Host "" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Pressione Ctrl+C para parar os servidores" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Green

# Manter rodando
Write-Host "" -ForegroundColor Cyan
Write-Host "Servidores em execução... (Para sair, pressione Ctrl+C)" -ForegroundColor Cyan

# Loop para manter o script rodando
do {
    Start-Sleep -Seconds 30
} while ($true)