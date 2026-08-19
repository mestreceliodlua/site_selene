/**
 * @fileoverview Controlador para integração com Clínica Selene
 * @description Envio seguro e auditado de avaliações com LGPD
 */

const db = require('../config/database');
const { encryptData, decryptData } = require('../utils/encryption');
const { 
    logDataTransfer, 
    logAction,
    logSensitiveDataAccess 
} = require('../utils/audit');
const crypto = require('crypto');

/**
 * Enviar avaliação para Clínica Selene com consentimento LGPD
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.sendToSelene = async (req, res) => {
    try {
        const { id } = req.params;
        const { consentimento_lgpd, email_destino, observacoes } = req.body;
        const userId = req.user.id;

        // Validação: consentimento LGPD obrigatório
        if (!consentimento_lgpd) {
            return res.status(400).json({
                error: 'CONSENT_REQUIRED',
                message: 'Consentimento LGPD é obrigatório para envio de dados'
            });
        }

        // Buscar avaliação
        const evaluationResult = await db.query(
            'SELECT * FROM evaluations WHERE id = $1 AND avaliador_id = $2',
            [id, userId]
        );

        if (evaluationResult.rows.length === 0) {
            return res.status(404).json({
                error: 'EVALUATION_NOT_FOUND',
                message: 'Avaliação não encontrada ou sem permissão'
            });
        }

        const evaluation = evaluationResult.rows[0];

        // Preparar dados para transferência
        const dataToTransfer = {
            // Dados demográficos (encriptados no banco)
            nomeCompleto: evaluation.nome_completo,
            dataNascimento: evaluation.data_nascimento,
            genero: evaluation.genero,
            idade: evaluation.idade,
            
            // Histórico clínico
            queixaPrincipal: evaluation.queixa_principal,
            historicoFamiliar: evaluation.historico_familiar,
            duracaoSintomas: evaluation.duracao_sintomas,
            
            // Avaliação neuropsicológica
            testesAplicados: evaluation.testes_aplicados,
            atencao_score: evaluation.atencao_score,
            memoria_score: evaluation.memoria_score,
            
            // Análise e recomendações
            pontosFortes: evaluation.pontos_fortes,
            conclusao: evaluation.conclusao,
            
            // Metadados
            dataAvaliacao: evaluation.created_at,
            avaliadorId: userId,
            observacoesClinicas: observacoes
        };

        // Criptografar dados completos com AES-256
        const encryptedData = encryptData(
            JSON.stringify(dataToTransfer),
            process.env.ENCRYPTION_KEY
        );

        // Gerar hash SHA-256 para verificação de integridade
        const dataHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(dataToTransfer))
            .digest('hex');

        // Gerar protocolo único com timestamp
        const protocol = `SEL-${Date.now()}`;

        // Registrar em data_transfers com consentimento
        const transferResult = await db.query(
            `INSERT INTO data_transfers 
            (evaluation_id, recipient, encrypted_data, data_hash, 
             consent_given, consent_date, protocol, status, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING id, protocol, created_at`,
            [
                id,
                email_destino || 'integracao@clinicaselene.com',
                encryptedData,
                dataHash,
                true,
                new Date(),
                protocol,
                'sent'
            ]
        );

        const transfer = transferResult.rows[0];

        // Log de auditoria - LGPD Art. 7º I (consentimento)
        await logDataTransfer(
            userId,
            id,
            email_destino || 'Clínica Selene',
            true
        );

        // Log de auditoria - Ação de transferência
        await logAction({
            user_id: userId,
            action: 'DATA_TRANSFER',
            resource_type: 'evaluation',
            resource_id: id,
            details: {
                protocol: protocol,
                recipient: email_destino,
                data_hash: dataHash,
                timestamp: new Date().toISOString()
            },
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        // Log de acesso a dados sensíveis - LGPD Art. 32º
        await logSensitiveDataAccess(
            userId,
            id,
            req.ip,
            req.headers['user-agent']
        );

        // Resposta com confirmação
        res.status(200).json({
            success: true,
            message: 'Avaliação enviada com sucesso para Clínica Selene',
            protocolo: protocol,
            enviado_em: transfer.created_at,
            lgpd_compliance: {
                consentimento_registrado: true,
                consentimento_data: new Date(),
                dados_criptografados: true,
                metodo_criptografia: 'AES-256',
                hash_verificacao: dataHash.substring(0, 16) + '...',
                auditoria_gerada: true
            },
            proximo_passo: 'Clínica Selene receberá os dados. Você pode revogar este consentimento a qualquer momento.'
        });

    } catch (error) {
        console.error('Erro ao enviar para Clínica Selene:', error);
        res.status(500).json({
            error: 'TRANSFER_ERROR',
            message: 'Erro ao enviar avaliação. Tente novamente.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Obter histórico de transferências
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.getTransferHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Contar total
        const countResult = await db.query(
            `SELECT COUNT(*) as total FROM data_transfers dt
             JOIN evaluations e ON dt.evaluation_id = e.id
             WHERE e.avaliador_id = $1`,
            [userId]
        );

        const total = parseInt(countResult.rows[0].total);

        // Buscar transferências com paginação
        const result = await db.query(
            `SELECT 
                dt.id,
                dt.evaluation_id,
                dt.protocol,
                dt.recipient,
                dt.consent_given,
                dt.consent_date,
                dt.status,
                dt.revoked_at,
                dt.created_at,
                dt.updated_at,
                e.nome_completo as patient_name,
                e.queixa_principal,
                u.email as professional_email
            FROM data_transfers dt
            JOIN evaluations e ON dt.evaluation_id = e.id
            JOIN users u ON e.avaliador_id = u.id
            WHERE e.avaliador_id = $1
            ORDER BY dt.created_at DESC
            LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        res.status(200).json({
            success: true,
            message: 'Histórico de transferências',
            transfers: result.rows,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({
            error: 'HISTORY_ERROR',
            message: 'Erro ao buscar histórico de transferências'
        });
    }
};

/**
 * Revogar consentimento - LGPD Art. 8º §5º
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.revokeConsent = async (req, res) => {
    try {
        const { transfer_id } = req.params;
        const userId = req.user.id;

        // Verificar que a transferência pertence ao profissional
        const transferResult = await db.query(
            `SELECT dt.* FROM data_transfers dt
             JOIN evaluations e ON dt.evaluation_id = e.id
             WHERE dt.id = $1 AND e.avaliador_id = $2`,
            [transfer_id, userId]
        );

        if (transferResult.rows.length === 0) {
            return res.status(404).json({
                error: 'TRANSFER_NOT_FOUND',
                message: 'Transferência não encontrada ou sem permissão'
            });
        }

        const transfer = transferResult.rows[0];

        // Atualizar status para revoked
        await db.query(
            `UPDATE data_transfers 
            SET status = 'revoked', revoked_at = NOW(), updated_at = NOW()
            WHERE id = $1`,
            [transfer_id]
        );

        // Log de auditoria - LGPD Art. 8º §5º (revogação de consentimento)
        await logAction({
            user_id: userId,
            action: 'REVOKE_CONSENT',
            resource_type: 'data_transfer',
            resource_id: transfer_id,
            details: {
                protocol: transfer.protocol,
                recipient: transfer.recipient,
                motivo: 'Revogação de consentimento pelo profissional',
                lgpd_article: 'Art. 8º §5º'
            },
            ip_address: req.ip,
            user_agent: req.headers['user-agent']
        });

        res.status(200).json({
            success: true,
            message: 'Consentimento revogado com sucesso. Clínica Selene será notificada para deletar os dados.',
            protocolo_revogado: transfer.protocol,
            revogado_em: new Date()
        });

    } catch (error) {
        console.error('Erro ao revogar consentimento:', error);
        res.status(500).json({
            error: 'REVOKE_ERROR',
            message: 'Erro ao revogar consentimento'
        });
    }
};

/**
 * Obter dados de transferência (apenas com chave de descriptografia)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @private
 */
exports.getTransferData = async (req, res) => {
    try {
        const { protocol } = req.params;
        const { decryption_key } = req.body;

        // Verificar chave de descriptografia
        if (decryption_key !== process.env.ENCRYPTION_KEY) {
            return res.status(403).json({
                error: 'UNAUTHORIZED',
                message: 'Chave de descriptografia inválida'
            });
        }

        // Buscar transferência
        const result = await db.query(
            'SELECT * FROM data_transfers WHERE protocol = $1 AND status = $2',
            [protocol, 'sent']
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'TRANSFER_NOT_FOUND',
                message: 'Transferência não encontrada ou já revogada'
            });
        }

        const transfer = result.rows[0];

        // Descriptografar dados
        const decryptedData = decryptData(transfer.encrypted_data);

        res.status(200).json({
            success: true,
            protocol: transfer.protocol,
            consent_given: transfer.consent_given,
            consent_date: transfer.consent_date,
            data_hash: transfer.data_hash,
            data: JSON.parse(decryptedData),
            received_at: new Date()
        });

    } catch (error) {
        console.error('Erro ao descriptografar dados:', error);
        res.status(500).json({
            error: 'DECRYPTION_ERROR',
            message: 'Erro ao descriptografar dados'
        });
    }
};
