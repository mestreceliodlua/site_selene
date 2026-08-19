/**
 * @fileoverview Controller de autenticação
 * @description Manipula login, registro e renovação de tokens
 */

const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/crypto');

/**
 * Registra um novo usuário
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const register = async (req, res) => {
    try {
        const { email, password, nomeCompleto, crp, especialidade } = req.body;

        // Validação básica
        if (!email || !password || !nomeCompleto) {
            return res.status(400).json({
                error: 'Campos obrigatórios faltando'
            });
        }

        // Validar força da senha
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'Senha fraca',
                details: passwordValidation.errors
            });
        }

        // Verificar se usuário já existe
        const checkUser = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(409).json({
                error: 'Email já cadastrado'
            });
        }

        // Hash da senha
        const passwordHash = await hashPassword(password);

        // Criar usuário
        const result = await query(
            `INSERT INTO users (email, password_hash, nome_completo, crp, especialidade)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, nome_completo, crp`,
            [email, passwordHash, nomeCompleto, crp || null, especialidade || null]
        );

        const user = result.rows[0];

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                nomeCompleto: user.nome_completo,
                crp: user.crp
            },
            token
        });
    } catch (error) {
        console.error('Erro ao registrar:', error);
        res.status(500).json({
            error: 'Erro ao registrar usuário'
        });
    }
};

/**
 * Faz login de um usuário
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        // Buscar usuário
        const result = await query(
            'SELECT id, email, password_hash, nome_completo, crp FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Email ou senha inválidos'
            });
        }

        const user = result.rows[0];

        // Comparar senha
        const passwordMatch = await comparePassword(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Email ou senha inválidos'
            });
        }

        // Atualizar último acesso
        await query(
            'UPDATE users SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                email: user.email,
                nomeCompleto: user.nome_completo,
                crp: user.crp
            },
            token
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({
            error: 'Erro ao fazer login'
        });
    }
};

/**
 * Renova o token JWT
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const refreshToken = async (req, res) => {
    try {
        const { id, email } = req.user;

        const token = jwt.sign(
            { id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Token renovado com sucesso',
            token
        });
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        res.status(500).json({
            error: 'Erro ao renovar token'
        });
    }
};

/**
 * Faz logout do usuário (frontend)
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const logout = (req, res) => {
    try {
        // Implementar blacklist de tokens se necessário
        res.status(200).json({
            message: 'Logout realizado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        res.status(500).json({
            error: 'Erro ao fazer logout'
        });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};
