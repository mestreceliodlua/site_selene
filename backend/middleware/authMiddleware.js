/**
 * @fileoverview Middleware de autenticação JWT
 * @description Verifica e valida tokens JWT
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Token não fornecido',
                message: 'Adicione o token no header Authorization'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido',
            message: 'Token expirado ou inválido'
        });
    }
};

module.exports = authMiddleware;
