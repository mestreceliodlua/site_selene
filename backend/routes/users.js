/**
 * @fileoverview Rotas de usuários
 * @description Perfil, atualização e deleção de conta (LGPD)
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * GET /api/users/profile
 * Obtém o perfil do usuário autenticado
 */
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const { id } = req.user;
        
        const result = await query(
            'SELECT id, email, nome_completo, crp, especialidade, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.status(200).json({
            message: 'Perfil obtido com sucesso',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ error: 'Erro ao obter perfil' });
    }
});

/**
 * PUT /api/users/profile
 * Atualiza o perfil do usuário
 */
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { id } = req.user;
        const { nomeCompleto, crp, especialidade } = req.body;

        const result = await query(
            `UPDATE users
             SET nome_completo = COALESCE($1, nome_completo),
                 crp = COALESCE($2, crp),
                 especialidade = COALESCE($3, especialidade),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, email, nome_completo, crp, especialidade`,
            [nomeCompleto || null, crp || null, especialidade || null, id]
        );

        res.status(200).json({
            message: 'Perfil atualizado com sucesso',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});

/**
 * DELETE /api/users/account
 * Deleta a conta do usuário (LGPD - direito ao esquecimento)
 */
router.delete('/account', authMiddleware, async (req, res) => {
    try {
        const { id } = req.user;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: 'Senha é obrigatória para deletar a conta'
            });
        }

        // Verificar senha antes de deletar (implementar comparePassword)
        const userResult = await query(
            'SELECT password_hash FROM users WHERE id = $1',
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Deletar avaliações primeiro (cascade)
        await query('DELETE FROM evaluations WHERE avaliador_id = $1', [id]);

        // Deletar usuário
        await query('DELETE FROM users WHERE id = $1', [id]);

        // Registrar deleção para auditoria LGPD
        await query(
            'INSERT INTO audit_log (user_id, action, resource_type) VALUES ($1, $2, $3)',
            [id, 'DELETE_ACCOUNT', 'USER']
        );

        res.status(200).json({
            message: 'Conta deletada com sucesso (LGPD - Direito ao Esquecimento)'
        });
    } catch (error) {
        console.error('Erro ao deletar conta:', error);
        res.status(500).json({ error: 'Erro ao deletar conta' });
    }
});

module.exports = router;
