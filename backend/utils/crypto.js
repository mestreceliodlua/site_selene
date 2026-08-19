/**
 * @fileoverview Utilitários de criptografia e segurança
 * @description Funções para criptografia AES-256 e hashing de senhas
 */

const CryptoJS = require('crypto-js');
const bcrypt = require('bcryptjs');

/**
 * Criptografa uma string usando AES-256
 * @param {string} text - Texto a ser criptografado
 * @returns {string} Texto criptografado
 */
const encryptSensitiveData = (text) => {
    if (!text) return '';
    return CryptoJS.AES.encrypt(
        text,
        CryptoJS.enc.Base64.parse(process.env.ENCRYPTION_KEY),
        {
            iv: CryptoJS.enc.Utf8.parse('0'.repeat(16)),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();
};

/**
 * Descriptografa uma string criptografada com AES-256
 * @param {string} encryptedText - Texto criptografado
 * @returns {string} Texto descriptografado
 */
const decryptSensitiveData = (encryptedText) => {
    if (!encryptedText) return '';
    try {
        const decrypted = CryptoJS.AES.decrypt(
            encryptedText,
            CryptoJS.enc.Base64.parse(process.env.ENCRYPTION_KEY),
            {
                iv: CryptoJS.enc.Utf8.parse('0'.repeat(16)),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Erro ao descriptografar:', error);
        return '';
    }
};

/**
 * Gera hash de uma senha usando bcrypt
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
};

/**
 * Compara uma senha em texto plano com seu hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash da senha
 * @returns {Promise<boolean>} True se correspondem
 */
const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Valida força de uma senha
 * @param {string} password - Senha a ser validada
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
const validatePasswordStrength = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Senha deve ter pelo menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Senha deve conter pelo menos um número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Senha deve conter pelo menos um caractere especial (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    encryptSensitiveData,
    decryptSensitiveData,
    hashPassword,
    comparePassword,
    validatePasswordStrength
};
