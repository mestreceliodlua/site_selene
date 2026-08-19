/**
 * @fileoverview Rotas de avaliações neuropsicológicas
 * @description CRUD de avaliações com autenticação
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const evaluationController = require('../controllers/evaluationController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Middleware para capturar erros de validação
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * POST /api/evaluations
 * Cria uma nova avaliação
 */
router.post('/', authMiddleware, [
    body('nomeCompleto').trim().notEmpty(),
    body('queixaPrincipal').trim().notEmpty(),
    handleValidationErrors
], evaluationController.createEvaluation);

/**
 * GET /api/evaluations
 * Lista todas as avaliações do usuário
 */
router.get('/', authMiddleware, evaluationController.listEvaluations);

/**
 * GET /api/evaluations/:evaluationId
 * Obtém uma avaliação específica
 */
router.get('/:evaluationId', authMiddleware, evaluationController.getEvaluation);

/**
 * PUT /api/evaluations/:evaluationId
 * Atualiza uma avaliação
 */
router.put('/:evaluationId', authMiddleware, evaluationController.updateEvaluation);

/**
 * DELETE /api/evaluations/:evaluationId
 * Deleta uma avaliação (LGPD - direito ao esquecimento)
 */
router.delete('/:evaluationId', authMiddleware, evaluationController.deleteEvaluation);

module.exports = router;
