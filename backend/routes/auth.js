/**
 * @fileoverview Rotas de autenticação
 * @description Login, registro e refresh de tokens
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
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
 * POST /api/auth/register
 * Registra um novo usuário
 */
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('nomeCompleto').trim().notEmpty(),
    handleValidationErrors
], authController.register);

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    handleValidationErrors
], authController.login);

/**
 * POST /api/auth/refresh
 * Renova o token JWT
 */
router.post('/refresh', authMiddleware, authController.refreshToken);

/**
 * POST /api/auth/logout
 * Faz logout do usuário
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
