/**
 * @fileoverview Controller de avaliações neuropsicológicas
 * @description CRUD de avaliações com criptografia LGPD
 */

const { query } = require('../config/database');
const { encryptSensitiveData, decryptSensitiveData } = require('../utils/crypto');

/**
 * Cria uma nova avaliação
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const createEvaluation = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const evaluationData = req.body;

        // Validação básica
        if (!evaluationData.nomeCompleto || !evaluationData.queixaPrincipal) {
            return res.status(400).json({
                error: 'Dados obrigatórios faltando'
            });
        }

        // Criptografar dados sensíveis
        const encryptedData = {
            ...evaluationData,
            nomeCompleto: encryptSensitiveData(evaluationData.nomeCompleto),
            dataNascimento: encryptSensitiveData(evaluationData.dataNascimento || ''),
            contato: encryptSensitiveData(evaluationData.contato || ''),
            profissao: encryptSensitiveData(evaluationData.profissao || '')
        };

        // Inserir no banco de dados
        const result = await query(
            `INSERT INTO evaluations (
                avaliador_id, paciente_nome, data_nascimento, idade, genero,
                escolaridade, profissao, contato, queixa_principal, duracao_sintomas,
                encaminhado_por, historico_familiar, historico_pessoal, desenvolvimento,
                medicacoes, avaliacoes_anteriores, testes_aplicados, observacoes_comportamentais,
                atencao_score, memoria_score, funcoes_executivas_score, linguagem_score,
                visuoespacial_score, velocidade_processamento_score, diagnostico,
                pontos_fortes, pontos_fracos, recomendacoes, conclusao, encaminhamentos,
                proximo_retorno, crp
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22, $23, $24, $25,
                $26, $27, $28, $29, $30, $31, $32
            )
            RETURNING id, created_at`,
            [
                userId, encryptedData.nomeCompleto, encryptedData.dataNascimento,
                evaluationData.idade, evaluationData.genero,
                evaluationData.escolaridade, encryptedData.profissao, encryptedData.contato,
                evaluationData.queixaPrincipal, evaluationData.duracaoSintomas,
                evaluationData.encaminhadoPor, evaluationData.historicoFamiliar,
                evaluationData.historicoPessoal, evaluationData.desenvolvimento,
                evaluationData.medicacoes, evaluationData.avaliacoesAnteriores,
                evaluationData.testesAplicados, evaluationData.observacoesComportamentais,
                evaluationData.atencao_score, evaluationData.memoria_score,
                evaluationData.funcoes_executivas_score, evaluationData.linguagem_score,
                evaluationData.visuoespacial_score, evaluationData.velocidade_processamento_score,
                evaluationData.diagnostico, evaluationData.pontosFortes, evaluationData.pontosFracos,
                evaluationData.recomendacoes, evaluationData.conclusao, evaluationData.encaminhamentos,
                evaluationData.proximoRetorno, evaluationData.crp
            ]
        );

        const evaluation = result.rows[0];

        res.status(201).json({
            message: 'Avaliação criada com sucesso',
            evaluation: {
                id: evaluation.id,
                createdAt: evaluation.created_at
            }
        });
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({
            error: 'Erro ao criar avaliação'
        });
    }
};

/**
 * Lista todas as avaliações do usuário
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const listEvaluations = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        // Buscar avaliações
        const result = await query(
            `SELECT id, paciente_nome, idade, genero, queixa_principal, diagnostico, created_at
             FROM evaluations
             WHERE avaliador_id = $1
             ORDER BY created_at DESC
             LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );

        // Contar total
        const countResult = await query(
            'SELECT COUNT(*) FROM evaluations WHERE avaliador_id = $1',
            [userId]
        );

        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            message: 'Avaliações listadas com sucesso',
            evaluations: result.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao listar avaliações:', error);
        res.status(500).json({
            error: 'Erro ao listar avaliações'
        });
    }
};

/**
 * Obtém uma avaliação específica
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getEvaluation = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { evaluationId } = req.params;

        const result = await query(
            'SELECT * FROM evaluations WHERE id = $1 AND avaliador_id = $2',
            [evaluationId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Avaliação não encontrada'
            });
        }

        const evaluation = result.rows[0];

        // Descriptografar dados sensíveis
        evaluation.paciente_nome = decryptSensitiveData(evaluation.paciente_nome);
        evaluation.data_nascimento = decryptSensitiveData(evaluation.data_nascimento);
        evaluation.contato = decryptSensitiveData(evaluation.contato);
        evaluation.profissao = decryptSensitiveData(evaluation.profissao);

        res.status(200).json({
            message: 'Avaliação obtida com sucesso',
            evaluation
        });
    } catch (error) {
        console.error('Erro ao obter avaliação:', error);
        res.status(500).json({
            error: 'Erro ao obter avaliação'
        });
    }
};

/**
 * Atualiza uma avaliação
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const updateEvaluation = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { evaluationId } = req.params;
        const updates = req.body;

        // Verificar permissão
        const checkResult = await query(
            'SELECT id FROM evaluations WHERE id = $1 AND avaliador_id = $2',
            [evaluationId, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(403).json({
                error: 'Você não tem permissão para editar esta avaliação'
            });
        }

        // Preparar dados criptografados
        if (updates.nomeCompleto) {
            updates.paciente_nome = encryptSensitiveData(updates.nomeCompleto);
            delete updates.nomeCompleto;
        }

        // Construir query de atualização dinamicamente
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        const values = [...Object.values(updates), evaluationId, userId];

        const result = await query(
            `UPDATE evaluations SET ${setClause}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $${fields.length + 1} AND avaliador_id = $${fields.length + 2}
             RETURNING id, updated_at`,
            values
        );

        res.status(200).json({
            message: 'Avaliação atualizada com sucesso',
            evaluation: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        res.status(500).json({
            error: 'Erro ao atualizar avaliação'
        });
    }
};

/**
 * Deleta uma avaliação (LGPD - direito ao esquecimento)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const deleteEvaluation = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { evaluationId } = req.params;

        // Verificar permissão
        const checkResult = await query(
            'SELECT id FROM evaluations WHERE id = $1 AND avaliador_id = $2',
            [evaluationId, userId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(403).json({
                error: 'Você não tem permissão para deletar esta avaliação'
            });
        }

        // Deletar avaliação
        await query('DELETE FROM evaluations WHERE id = $1', [evaluationId]);

        // Registrar deleção para auditoria LGPD
        await query(
            'INSERT INTO audit_log (user_id, action, resource_type) VALUES ($1, $2, $3)',
            [userId, 'DELETE', 'EVALUATION']
        );

        res.status(200).json({
            message: 'Avaliação deletada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        res.status(500).json({
            error: 'Erro ao deletar avaliação'
        });
    }
};

module.exports = {
    createEvaluation,
    listEvaluations,
    getEvaluation,
    updateEvaluation,
    deleteEvaluation
};
