/**
 * @fileoverview Sistema de auditoria e compliance LGPD
 * @description Logging de todas as operações sensíveis
 */

const db = require('../config/database');

/**
 * Log genérico de ação
 * @param {object} params - Parâmetros do log
 * @returns {Promise<object>} Resultado do insert
 */
exports.logAction = async ({
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
}) => {
    try {
        const result = await db.query(
            `INSERT INTO audit_logs 
            (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING id, created_at`,
            [
                user_id,
                action,
                resource_type,
                resource_id,
                JSON.stringify(details),
                ip_address,
                user_agent
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Erro ao registrar ação:', error);
        throw error;
    }
};

/**
 * Log de acesso a dados sensíveis
 * Art. 7º V LGPD - Tratamento de dados de saúde
 * Art. 32º LGPD - Segurança dos dados
 * 
 * @param {string} user_id - ID do usuário
 * @param {string} evaluation_id - ID da avaliação
 * @param {string} ip_address - Endereço IP
 * @param {string} user_agent - User Agent do navegador
 * @returns {Promise<object>}
 */
exports.logSensitiveDataAccess = async (
    user_id,
    evaluation_id,
    ip_address,
    user_agent
) => {
    try {
        return await exports.logAction({
            user_id,
            action: 'ACCESS_SENSITIVE_DATA',
            resource_type: 'evaluation',
            resource_id: evaluation_id,
            details: {
                data_type: 'health_information',
                sensitive_fields: [
                    'nome_completo',
                    'data_nascimento',
                    'contato',
                    'profissao'
                ],
                lgpd_article: 'Art. 7º V (health data), Art. 32º (security)',
                timestamp: new Date().toISOString()
            },
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Erro ao registrar acesso sensível:', error);
        throw error;
    }
};

/**
 * Log de transferência de dados para terceiros
 * Art. 7º I LGPD - Consentimento
 * Art. 8º LGPD - Revogação de consentimento
 * 
 * @param {string} user_id - ID do profissional
 * @param {string} evaluation_id - ID da avaliação
 * @param {string} recipient - Destinatário (ex: Clínica Selene)
 * @param {boolean} consent - Se consentimento foi dado
 * @returns {Promise<object>}
 */
exports.logDataTransfer = async (
    user_id,
    evaluation_id,
    recipient,
    consent
) => {
    try {
        return await exports.logAction({
            user_id,
            action: 'DATA_TRANSFER',
            resource_type: 'evaluation',
            resource_id: evaluation_id,
            details: {
                recipient: recipient,
                consent_given: consent,
                data_transferred: [
                    'patient_demographics',
                    'clinical_history',
                    'neuropsych_evaluation',
                    'recommendations'
                ],
                encryption: 'AES-256',
                lgpd_article: 'Art. 7º I (consent), Art. 8º (revocation)',
                lgpd_reference: 'Transfer to third party with explicit consent',
                timestamp: new Date().toISOString()
            },
            ip_address: null,
            user_agent: null
        });
    } catch (error) {
        console.error('Erro ao registrar transferência:', error);
        throw error;
    }
};

/**
 * Log de acesso não autorizado
 * @param {string} ip_address - Endereço IP
 * @param {string} attempted_action - Ação tentada
 * @param {string} user_agent - User Agent
 * @returns {Promise<object>}
 */
exports.logUnauthorizedAccess = async (
    ip_address,
    attempted_action,
    user_agent
) => {
    try {
        return await exports.logAction({
            user_id: null,
            action: 'UNAUTHORIZED_ACCESS',
            resource_type: 'system',
            resource_id: null,
            details: {
                attempted_action,
                severity: 'high',
                timestamp: new Date().toISOString()
            },
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Erro ao registrar acesso não autorizado:', error);
        throw error;
    }
};

/**
 * Log de deleção de dados (direito ao esquecimento)
 * Art. 19º LGPD - Direito de apagamento
 * 
 * @param {string} user_id - ID do usuário
 * @param {string} resource_id - ID do recurso deletado
 * @param {string} reason - Motivo da deleção
 * @returns {Promise<object>}
 */
exports.logDeletion = async (
    user_id,
    resource_id,
    reason
) => {
    try {
        return await exports.logAction({
            user_id,
            action: 'DATA_DELETION',
            resource_type: 'evaluation',
            resource_id,
            details: {
                reason: reason,
                deleted_at: new Date().toISOString(),
                lgpd_article: 'Art. 19º (Right to Erasure - Right to Oblivion)',
                lgpd_reference: 'Data subject requested deletion',
                irrevocable: true
            },
            ip_address: null,
            user_agent: null
        });
    } catch (error) {
        console.error('Erro ao registrar deleção:', error);
        throw error;
    }
};

/**
 * Obter logs de auditoria de um recurso
 * @param {string} resource_type - Tipo de recurso
 * @param {string} resource_id - ID do recurso
 * @param {number} limit - Limite de resultados
 * @returns {Promise<array>}
 */
exports.getResourceAuditLogs = async (
    resource_type,
    resource_id,
    limit = 50
) => {
    try {
        const result = await db.query(
            `SELECT 
                id,
                user_id,
                action,
                resource_type,
                resource_id,
                details,
                ip_address,
                user_agent,
                created_at
            FROM audit_logs
            WHERE resource_type = $1 AND resource_id = $2
            ORDER BY created_at DESC
            LIMIT $3`,
            [resource_type, resource_id, limit]
        );

        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        throw error;
    }
};

/**
 * Obter logs de acesso sensível de um usuário
 * @param {string} user_id - ID do usuário
 * @param {number} days - Últimos X dias (padrão: 30)
 * @returns {Promise<array>}
 */
exports.getUserSensitiveAccessLogs = async (
    user_id,
    days = 30
) => {
    try {
        const result = await db.query(
            `SELECT 
                id,
                user_id,
                action,
                resource_id,
                details,
                ip_address,
                created_at
            FROM audit_logs
            WHERE user_id = $1 
            AND action = 'ACCESS_SENSITIVE_DATA'
            AND created_at >= NOW() - INTERVAL '${days} days'
            ORDER BY created_at DESC`,
            [user_id]
        );

        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar logs de acesso sensível:', error);
        throw error;
    }
};

/**
 * Gerar relatório de conformidade LGPD
 * @param {object} options - Opções do relatório
 * @returns {Promise<object>}
 */
exports.generateComplianceReport = async (options = {}) => {
    try {
        const {
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate = new Date(),
            groupBy = 'action'
        } = options;

        // Contar ações por tipo
        const actionsResult = await db.query(
            `SELECT action, COUNT(*) as count
            FROM audit_logs
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY action
            ORDER BY count DESC`,
            [startDate, endDate]
        );

        // Contar acessos sensíveis
        const sensitiveResult = await db.query(
            `SELECT COUNT(*) as count
            FROM audit_logs
            WHERE action = 'ACCESS_SENSITIVE_DATA'
            AND created_at BETWEEN $1 AND $2`,
            [startDate, endDate]
        );

        // Contar transferências
        const transferResult = await db.query(
            `SELECT COUNT(*) as count
            FROM audit_logs
            WHERE action = 'DATA_TRANSFER'
            AND created_at BETWEEN $1 AND $2`,
            [startDate, endDate]
        );

        // Contar deletions
        const deletionResult = await db.query(
            `SELECT COUNT(*) as count
            FROM audit_logs
            WHERE action = 'DATA_DELETION'
            AND created_at BETWEEN $1 AND $2`,
            [startDate, endDate]
        );

        return {
            period: {
                from: startDate,
                to: endDate
            },
            summary: {
                total_actions: actionsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
                sensitive_data_accesses: parseInt(sensitiveResult.rows[0]?.count || 0),
                data_transfers: parseInt(transferResult.rows[0]?.count || 0),
                data_deletions: parseInt(deletionResult.rows[0]?.count || 0)
            },
            actions_breakdown: actionsResult.rows,
            lgpd_compliance_status: 'active'
        };
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        throw error;
    }
};

/**
 * Purgar logs antigos (retenção de dados)
 * Manter últimos 90 dias (LGPD Art. 15º - Retenção)
 * @param {number} daysToKeep - Dias para manter (padrão: 90)
 * @returns {Promise<object>}
 */
exports.purgeOldLogs = async (daysToKeep = 90) => {
    try {
        const result = await db.query(
            `DELETE FROM audit_logs
            WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
            RETURNING id`,
        );

        console.log(`🧹 ${result.rowCount} logs antigos removidos`);

        return {
            deleted_count: result.rowCount,
            retention_period_days: daysToKeep,
            deleted_before: new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
        };
    } catch (error) {
        console.error('Erro ao purgar logs:', error);
        throw error;
    }
};

// Log de inicialização
console.log('✅ Sistema de auditoria LGPD ativo');
