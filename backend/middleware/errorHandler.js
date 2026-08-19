/**
 * @fileoverview Middleware de tratamento de erros
 * @description Centraliza tratamento de erros da aplicação
 */

/**
 * Middleware para tratamento global de erros
 * @param {Error} err - Objeto de erro
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Erro de validação
    if (err.status === 400) {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.details || err.message
        });
    }

    // Erro de autenticação
    if (err.status === 401) {
        return res.status(401).json({
            error: 'Não autenticado',
            message: 'Token inválido ou expirado'
        });
    }

    // Erro de autorização
    if (err.status === 403) {
        return res.status(403).json({
            error: 'Não autorizado',
            message: 'Você não tem permissão para acessar este recurso'
        });
    }

    // Erro não encontrado
    if (err.status === 404) {
        return res.status(404).json({
            error: 'Não encontrado',
            message: 'Recurso não encontrado'
        });
    }

    // Erro de banco de dados
    if (err.name === 'QueryResultError' || err.code) {
        return res.status(500).json({
            error: 'Erro no banco de dados',
            message: 'Ocorreu um erro ao processar sua solicitação'
        });
    }

    // Erro genérico
    res.status(err.status || 500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente mais tarde'
    });
};

module.exports = errorHandler;
