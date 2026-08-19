/**
 * @fileoverview Rotas para integração com Clínica Selene
 * @description Endpoints seguros para transferência de dados com LGPD
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const seleneController = require('../controllers/seleneController');

/**
 * Middleware de validação
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            details: errors.array()
        });
    }
    next();
};

/**
 * POST /api/selene/send/:id
 * Enviar avaliação para Clínica Selene com consentimento LGPD
 * 
 * Headers:
 *   Authorization: Bearer JWT_TOKEN
 * 
 * Body:
 *   - consentimento_lgpd (boolean, obrigatório)
 *   - email_destino (string, opcional)
 *   - observacoes (string, opcional)
 * 
 * Resposta:
 *   {
 *     success: true,
 *     protocolo: "SEL-1692374400000",
 *     enviado_em: "2026-08-18T10:30:00Z",
 *     lgpd_compliance: {...}
 *   }
 */
router.post(
    '/send/:id',
    authMiddleware,
    [
        body('consentimento_lgpd')
            .isBoolean()
            .equals('true')
            .withMessage('Consentimento LGPD é obrigatório'),
        body('email_destino')
            .optional()
            .isEmail()
            .withMessage('Email inválido'),
        body('observacoes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Observações não podem exceder 500 caracteres')
    ],
    handleValidationErrors,
    seleneController.sendToSelene
);

/**
 * GET /api/selene/history
 * Obter histórico de transferências para Clínica Selene
 * 
 * Headers:
 *   Authorization: Bearer JWT_TOKEN
 * 
 * Query Parameters:
 *   - page (int, default: 1)
 *   - limit (int, default: 10, max: 50)
 * 
 * Resposta:
 *   {
 *     success: true,
 *     transfers: [...],
 *     pagination: {page, limit, total, pages}
 *   }
 */
router.get(
    '/history',
    authMiddleware,
    [
        body('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Página deve ser número positivo'),
        body('limit')
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage('Limite deve estar entre 1 e 50')
    ],
    seleneController.getTransferHistory
);

/**
 * POST /api/selene/revoke/:transfer_id
 * Revogar consentimento - LGPD Art. 8º §5º
 * 
 * Headers:
 *   Authorization: Bearer JWT_TOKEN
 * 
 * Resposta:
 *   {
 *     success: true,
 *     message: "Consentimento revogado com sucesso...",
 *     protocolo_revogado: "SEL-1692374400000",
 *     revogado_em: "2026-08-18T10:35:00Z"
 *   }
 */
router.post(
    '/revoke/:transfer_id',
    authMiddleware,
    seleneController.revokeConsent
);

/**
 * GET /api/selene/data/:protocol (PRIVADO)
 * Obter dados de transferência - apenas para Clínica Selene
 * Requer chave de descriptografia (enviada via email seguro)
 * 
 * Headers:
 *   Authorization: Bearer SERVICE_TOKEN (Clínica Selene)
 * 
 * Body:
 *   - decryption_key (string)
 * 
 * Resposta:
 *   {
 *     success: true,
 *     protocol: "SEL-1692374400000",
 *     data: {...dados descriptografados...},
 *     data_hash: "a1b2c3d4..."
 *   }
 * 
 * @private Este endpoint deve ter acesso restrito apenas à Clínica Selene
 */
router.get(
    '/data/:protocol',
    authMiddleware,
    seleneController.getTransferData
);

module.exports = router;
