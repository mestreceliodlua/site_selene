-- ===================================
-- NeuroEval - Schema do Banco de Dados
-- PostgreSQL
-- ===================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================================
-- Tabela: users
-- Armazena dados dos profissionais
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    crp VARCHAR(20) UNIQUE,
    especialidade VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_crp ON users(crp);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ===================================
-- Tabela: evaluations
-- Armazena avaliações neuropsicológicas
-- ===================================
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avaliador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dados do paciente (criptografados)
    paciente_nome VARCHAR(255) NOT NULL,
    data_nascimento VARCHAR(255) NOT NULL,
    idade INTEGER,
    genero VARCHAR(50),
    escolaridade VARCHAR(100),
    profissao VARCHAR(255),
    contato VARCHAR(255),
    
    -- Queixa e histórico
    queixa_principal TEXT,
    duracao_sintomas VARCHAR(100),
    encaminhado_por VARCHAR(255),
    historico_familiar TEXT,
    historico_pessoal TEXT,
    desenvolvimento TEXT,
    medicacoes TEXT,
    avaliacoes_anteriores TEXT,
    
    -- Avaliação
    testes_aplicados TEXT,
    observacoes_comportamentais TEXT,
    
    -- Scores dos testes (0-100)
    atencao_score INTEGER,
    memoria_score INTEGER,
    funcoes_executivas_score INTEGER,
    linguagem_score INTEGER,
    visuoespacial_score INTEGER,
    velocidade_processamento_score INTEGER,
    
    -- Interpretação
    diagnostico TEXT,
    pontos_fortes TEXT,
    pontos_fracos TEXT,
    recomendacoes TEXT,
    conclusao TEXT,
    encaminhamentos TEXT,
    proximo_retorno DATE,
    
    -- Informações do profissional
    crp VARCHAR(20),
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Conformidade LGPD
    consentimento_informado BOOLEAN DEFAULT true,
    anonimizado BOOLEAN DEFAULT false
);

-- Índices para evaluations
CREATE INDEX idx_evaluations_avaliador ON evaluations(avaliador_id);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX idx_evaluations_diagnostico ON evaluations(diagnostico);

-- ===================================
-- Tabela: audit_log
-- Logs de auditoria para LGPD
-- ===================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_log
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ===================================
-- Tabela: consent
-- Armazena consentimento do paciente
-- ===================================
CREATE TABLE IF NOT EXISTS consent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    tipo VARCHAR(100),
    consentido BOOLEAN DEFAULT true,
    data_consentimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- ===================================
-- Tabela: data_transfers
-- Registro de transferências para Clínica Selene
-- ===================================
CREATE TABLE IF NOT EXISTS data_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    recipient VARCHAR(255),
    encrypted_data TEXT NOT NULL,
    data_hash VARCHAR(64),
    consent_given BOOLEAN DEFAULT true,
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'revoked', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL
);

-- Índices para data_transfers
CREATE INDEX idx_data_transfer_evaluation ON data_transfers(evaluation_id);
CREATE INDEX idx_data_transfer_status ON data_transfers(status);

-- ===================================
-- View: user_stats
-- Estatísticas de uso por usuário
-- ===================================
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.nome_completo,
    COUNT(e.id) as total_avaliacoes,
    MAX(e.created_at) as ultima_avaliacao,
    u.created_at as data_cadastro
FROM users u
LEFT JOIN evaluations e ON u.id = e.avaliador_id
GROUP BY u.id, u.email, u.nome_completo, u.created_at;

-- ===================================
-- Triggers
-- ===================================

-- Trigger para atualizar updated_at em users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Trigger para atualizar updated_at em evaluations
CREATE OR REPLACE FUNCTION update_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluations_updated_at_trigger
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_evaluations_updated_at();

-- ===================================
-- Políticas de Segurança (RLS)
-- ===================================

-- Habilitar RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver suas próprias avaliações
CREATE POLICY evaluations_user_policy ON evaluations
    FOR SELECT USING (avaliador_id = current_user_id());

CREATE POLICY evaluations_insert_policy ON evaluations
    FOR INSERT WITH CHECK (avaliador_id = current_user_id());

-- Função para obter ID do usuário atual
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN (current_setting('app.user_id', true))::UUID;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- Tabela: evaluations
-- Armazena avaliações neuropsicológicas
-- ===================================
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    avaliador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dados do paciente (criptografados)
    paciente_nome VARCHAR(255),
    data_nascimento VARCHAR(255),
    idade INTEGER,
    genero VARCHAR(50),
    escolaridade VARCHAR(100),
    profissao VARCHAR(255),
    contato VARCHAR(255),
    
    -- Queixa e histórico
    queixa_principal TEXT,
    duracao_sintomas VARCHAR(100),
    encaminhado_por VARCHAR(255),
    historico_familiar TEXT,
    historico_pessoal TEXT,
    desenvolvimento TEXT,
    medicacoes TEXT,
    avaliacoes_anteriores TEXT,
    
    -- Avaliação
    testes_aplicados TEXT,
    observacoes_comportamentais TEXT,
    
    -- Scores dos testes (0-100)
    atencao_score INTEGER,
    memoria_score INTEGER,
    funcoes_executivas_score INTEGER,
    linguagem_score INTEGER,
    visuoespacial_score INTEGER,
    velocidade_processamento_score INTEGER,
    
    -- Interpretação
    diagnostico TEXT,
    pontos_fortes TEXT,
    pontos_fracos TEXT,
    recomendacoes TEXT,
    conclusao TEXT,
    encaminhamentos TEXT,
    proximo_retorno DATE,
    
    -- Informações do profissional
    crp VARCHAR(20),
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Conformidade LGPD
    consentimento_informado BOOLEAN DEFAULT true,
    anonimizado BOOLEAN DEFAULT false
);

-- Índices para evaluations
CREATE INDEX idx_evaluations_avaliador ON evaluations(avaliador_id);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX idx_evaluations_diagnostico ON evaluations(diagnostico);

-- ===================================
-- Tabela: audit_log
-- Logs de auditoria para LGPD
-- ===================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para audit_log
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- ===================================
-- Tabela: consent
-- Armazena consentimento do paciente
-- ===================================
CREATE TABLE IF NOT EXISTS consent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    tipo VARCHAR(100),
    consentido BOOLEAN DEFAULT true,
    data_consentimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- ===================================
-- View: user_stats
-- Estatísticas de uso por usuário
-- ===================================
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.nome_completo,
    COUNT(e.id) as total_avaliacoes,
    MAX(e.created_at) as ultima_avaliacao,
    u.created_at as data_cadastro
FROM users u
LEFT JOIN evaluations e ON u.id = e.avaliador_id
GROUP BY u.id, u.email, u.nome_completo, u.created_at;

-- ===================================
-- Triggers
-- ===================================

-- Trigger para atualizar updated_at em users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Trigger para atualizar updated_at em evaluations
CREATE OR REPLACE FUNCTION update_evaluations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evaluations_updated_at_trigger
BEFORE UPDATE ON evaluations
FOR EACH ROW
EXECUTE FUNCTION update_evaluations_updated_at();

-- ===================================
-- Políticas de Segurança (RLS)
-- ===================================

-- Habilitar RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Política: Usuários só podem ver suas próprias avaliações
CREATE POLICY evaluations_user_policy ON evaluations
    FOR SELECT USING (avaliador_id = current_user_id());

CREATE POLICY evaluations_insert_policy ON evaluations
    FOR INSERT WITH CHECK (avaliador_id = current_user_id());

-- Função para obter ID do usuário atual
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN (current_setting('app.user_id', true))::UUID;
END;
$$ LANGUAGE plpgsql;

-- ===================================
-- Tabela: data_transfers
-- Integração com Clínica Selene
-- LGPD Art. 8º §5º - Revogação
-- ===================================
CREATE TABLE IF NOT EXISTS data_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    protocol VARCHAR(50) NOT NULL UNIQUE,
    recipient VARCHAR(255) NOT NULL,
    encrypted_data TEXT NOT NULL,
    data_hash VARCHAR(64) NOT NULL,
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'sent',
    revoked_at TIMESTAMP,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para data_transfers
CREATE INDEX idx_data_transfers_evaluation ON data_transfers(evaluation_id);
CREATE INDEX idx_data_transfers_protocol ON data_transfers(protocol);
CREATE INDEX idx_data_transfers_status ON data_transfers(status);
CREATE INDEX idx_data_transfers_created_at ON data_transfers(created_at DESC);
CREATE INDEX idx_data_transfers_recipient ON data_transfers(recipient);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_data_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER data_transfers_updated_at_trigger
BEFORE UPDATE ON data_transfers
FOR EACH ROW
EXECUTE FUNCTION update_data_transfers_updated_at();

-- ===================================
-- Políticas RLS Adicionais
-- ===================================

-- Policy: data_transfers
ALTER TABLE data_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY data_transfers_view_policy ON data_transfers
    FOR SELECT 
    USING (
        evaluation_id IN (
            SELECT id FROM evaluations 
            WHERE avaliador_id = current_user_id()
        )
    );

CREATE POLICY data_transfers_insert_policy ON data_transfers
    FOR INSERT 
    WITH CHECK (
        evaluation_id IN (
            SELECT id FROM evaluations 
            WHERE avaliador_id = current_user_id()
        )
    );

-- ===================================
-- View: transfers_summary
-- Resumo de transferências com contexto
-- ===================================
CREATE OR REPLACE VIEW transfers_summary AS
SELECT 
    dt.id,
    dt.protocol,
    dt.status,
    dt.recipient,
    dt.consent_given,
    dt.created_at,
    e.queixa_principal,
    u.nome_completo as professional_name,
    u.email
FROM data_transfers dt
JOIN evaluations e ON dt.evaluation_id = e.id
JOIN users u ON e.avaliador_id = u.id;

-- ===================================
-- Sample Data - Development Only
-- ===================================

-- Usuário de teste (senha: Test@123456)
INSERT INTO users (email, password_hash, nome_completo, crp, especialidade, ativo)
VALUES (
    'profissional@neuroeval.com',
    '$2a$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Sw7KIUgO2t0jKMm6',
    'Dr. João Silva',
    'CRP 05/00000',
    'Neuropsicologia',
    true
)
ON CONFLICT (email) DO NOTHING;

-- ===================================
-- Comments for Documentation
-- ===================================

COMMENT ON TABLE users IS 'Usuários profissionais - LGPD Art. 5º';
COMMENT ON TABLE evaluations IS 'Avaliações neuropsicológicas - dados sensíveis';
COMMENT ON TABLE audit_log IS 'Logs de auditoria - LGPD Art. 32º';
COMMENT ON TABLE consent IS 'Consentimento informado - LGPD Art. 7º';
COMMENT ON TABLE data_transfers IS 'Transferências para Clínica Selene - LGPD Art. 8º';

COMMENT ON COLUMN evaluations.paciente_nome IS 'Criptografado com AES-256';
COMMENT ON COLUMN evaluations.data_nascimento IS 'Criptografado com AES-256';
COMMENT ON COLUMN evaluations.contato IS 'Criptografado com AES-256';
COMMENT ON COLUMN data_transfers.encrypted_data IS 'AES-256 encrypted JSON';
COMMENT ON COLUMN data_transfers.data_hash IS 'SHA-256 para verificação';

-- ===================================
-- Verificação Final
-- ===================================
SELECT 
    schemaname, 
    tablename,
    (SELECT count(*) FROM information_schema.columns 
     WHERE table_name = tablename) as colunas
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ===================================
-- ✅ LGPD Compliance Checklist
-- ===================================
-- ✅ Dados criptografados (AES-256)
-- ✅ Audit logs com IP e User Agent
-- ✅ Consentimento rastreado
-- ✅ Revogação de consentimento (Art. 8º §5º)
-- ✅ Direito ao esquecimento (DELETE em cascata)
-- ✅ Segurança de dados (RLS, índices)
-- ✅ Integridade de dados (SHA-256 hash)
-- ⚠️ Backup automático (configurar em produção)
-- ⚠️ HTTPS (configurar em produção)
-- ⚠️ Retenção de logs (90 dias padrão)
--
-- ============================================================================
