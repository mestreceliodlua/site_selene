/**
 * @fileoverview Utilitários de criptografia
 * @description AES-256, bcrypt e validação de senha
 */

const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

/**
 * Validar força da senha - LGPD compliance
 * @param {string} password - Senha para validar
 * @returns {object} { valid: boolean, message: string }
 */
exports.validatePasswordStrength = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Deve conter maiúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Deve conter minúscula');
    }
    if (!/\d/.test(password)) {
        errors.push('Deve conter número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Deve conter caractere especial');
    }

    return {
        valid: errors.length === 0,
        errors,
        message: errors.length === 0 
            ? 'Senha forte' 
            : `Senha fraca: ${errors.join(', ')}`
    };
};

/**
 * Hash de senha com bcrypt
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash bcrypt
 */
exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Erro ao fazer hash da senha:', error);
        throw new Error('Erro ao processar senha');
    }
};

/**
 * Comparar senha com hash - Proteção contra timing attacks
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {Promise<boolean>}
 */
exports.comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Erro ao comparar senha:', error);
        return false;
    }
};

/**
 * Criptografar dados sensíveis com AES-256
 * @param {object|string} data - Dados para criptografar
 * @param {string} key - Chave de criptografia (deve ter 32 caracteres)
 * @returns {string} Dados criptografados em Base64
 */
exports.encryptData = (data, key) => {
    try {
        if (!key || key.length < 32) {
            throw new Error('Chave de criptografia inválida. Deve ter mínimo 32 caracteres.');
        }

        // Converter para string se necessário
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

        // Criptografar com AES-256-CBC
        const encrypted = CryptoJS.AES.encrypt(dataStr, key).toString();

        return encrypted;
    } catch (error) {
        console.error('Erro ao criptografar dados:', error);
        throw new Error('Erro ao criptografar dados sensíveis');
    }
};

/**
 * Descriptografar dados com AES-256
 * @param {string} encryptedData - Dados criptografados em Base64
 * @param {string} key - Chave de criptografia
 * @returns {string|object} Dados descriptografados
 */
exports.decryptData = (encryptedData, key = process.env.ENCRYPTION_KEY) => {
    try {
        if (!key || key.length < 32) {
            throw new Error('Chave de criptografia inválida.');
        }

        // Descriptografar
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key).toString(
            CryptoJS.enc.Utf8
        );

        if (!decrypted) {
            throw new Error('Falha ao descriptografar. Chave pode estar incorreta.');
        }

        // Tentar parsear como JSON, senão retornar string
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch (error) {
        console.error('Erro ao descriptografar dados:', error);
        throw new Error('Erro ao descriptografar dados');
    }
};

/**
 * Criptografar campos sensíveis de um objeto
 * @param {object} obj - Objeto com dados
 * @param {string[]} fields - Array de campos a criptografar
 * @param {string} key - Chave de criptografia
 * @returns {object} Objeto com campos criptografados
 */
exports.encryptObjectFields = (obj, fields, key) => {
    const encrypted = { ...obj };

    fields.forEach(field => {
        if (encrypted[field]) {
            encrypted[field] = exports.encryptData(encrypted[field], key);
        }
    });

    return encrypted;
};

/**
 * Descriptografar campos sensíveis de um objeto
 * @param {object} obj - Objeto com dados criptografados
 * @param {string[]} fields - Array de campos a descriptografar
 * @param {string} key - Chave de criptografia
 * @returns {object} Objeto com campos descriptografados
 */
exports.decryptObjectFields = (obj, fields, key) => {
    const decrypted = { ...obj };

    fields.forEach(field => {
        if (decrypted[field]) {
            decrypted[field] = exports.decryptData(decrypted[field], key);
        }
    });

    return decrypted;
};

/**
 * Gerar chave de criptografia aleatória
 * @param {number} length - Tamanho da chave (padrão: 32)
 * @returns {string} Chave aleatória
 */
exports.generateEncryptionKey = (length = 32) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return key;
};

// Verificar se chave está configurada (aviso apenas, não lança erro no import)
if (!process.env.ENCRYPTION_KEY) {
    console.warn('⚠️ ENCRYPTION_KEY não configurada. Use generateEncryptionKey() para gerar uma chave segura.');
} else if (process.env.ENCRYPTION_KEY.length < 32) {
    console.error('❌ ENCRYPTION_KEY deve ter mínimo 32 caracteres. Criptografia pode falhar.');
}

/**
 * Exportar para teste
 */
if (process.env.NODE_ENV === 'test') {
    exports.testExports = {
        validatePasswordStrength: exports.validatePasswordStrength,
        generateEncryptionKey: exports.generateEncryptionKey
    };
}
