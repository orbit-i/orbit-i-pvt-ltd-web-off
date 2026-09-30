"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mysql_1 = require("../config/mysql");
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const roles_1 = require("../constants/roles");
const securityService_1 = require("./securityService");
const SALT_ROUNDS = 12;
// In-memory demo fallback credentials when databases are offline during initial local preview
const FALLBACK_USERS = {
    'ab.samad@orbit-i.tech': {
        id: 101,
        passwordHash: '$2b$10$ymIsbnSNdmWpDn5nn1HOweN0/X.YTIsambUf9JcI6o7GuXiGAoLX.', // ab.samad@orbit-i.tech
        fullName: 'Abdul Samad',
        role: roles_1.ROLES.SUPER_ADMIN,
        isActive: true,
    },
    'maria.almani@orbit-i.tech': {
        id: 102,
        passwordHash: '$2b$10$b/JeTp.rHDLl9E16j3teZOI/6oIE.UEMsYMUG9S6MzzbGaJpHYbMW', // maria.almani@orbit-i.tech
        fullName: 'Maria Almani',
        role: roles_1.ROLES.SUPER_ADMIN,
        isActive: true,
    },
    'm.muneeb@orbit-i.tech': {
        id: 103,
        passwordHash: '$2b$10$NFMc1FMZpcp98SElU7zgMuzJhL7c0t38.xbC0JjDdAD1jajv28dqC', // m.muneeb@orbit-i.tech
        fullName: 'Muhammad Muneeb',
        role: roles_1.ROLES.SUPER_ADMIN,
        isActive: true,
    },
    'superadmin@orbit-i.com': {
        id: 1,
        passwordHash: '$2a$12$NqB8.8HlMzgfJoxE5sM.Nu9V8Psmr5JvU0q9a2J8Q0YQ31S8ZJ0K.', // SuperAdmin@2026!
        fullName: 'Super Administrator',
        role: roles_1.ROLES.SUPER_ADMIN,
        isActive: true,
    },
    'admin@orbit-i.com': {
        id: 2,
        passwordHash: '$2a$12$4m5O0mE0Q8D2mS5YgB7M6.pI8V7G6H5J4K3L2M1N0O9P8Q7R6S5T.', // AdminPass@2026!
        fullName: 'Operations Admin',
        role: roles_1.ROLES.ADMIN,
        isActive: true,
    },
    'client@orbit-i.com': {
        id: 3,
        passwordHash: '$2a$12$1a2b3c4d5e6f7g8h9i0j1.k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6.', // ClientPass@2026!
        fullName: 'Enterprise Client',
        role: roles_1.ROLES.CLIENT,
        isActive: true,
    },
};
function issueTokens(userId, role) {
    const payload = { sub: String(userId), role };
    return {
        accessToken: (0, jwt_1.signAccessToken)(payload),
        refreshToken: (0, jwt_1.signRefreshToken)(payload),
    };
}
exports.authService = {
    async register(input) {
        const cleanEmail = input.email.trim().toLowerCase();
        // 1. Check MySQL if active
        if ((0, mysql_1.isMySQLActive)()) {
            const existing = await (0, mysql_1.query)('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
            if (existing && existing.length > 0) {
                throw ApiError_1.ApiError.conflict('An account with this email already exists');
            }
            const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
            const result = await (0, mysql_1.execute)('INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)', [cleanEmail, passwordHash, input.fullName.trim(), roles_1.ROLES.CLIENT]);
            const user = {
                id: result.insertId,
                email: cleanEmail,
                fullName: input.fullName.trim(),
                role: roles_1.ROLES.CLIENT,
                isActive: true,
            };
            const tokens = issueTokens(user.id, user.role);
            return { user, ...tokens };
        }
        // 2. Mongoose fallback
        try {
            const existing = await User_1.User.findOne({ email: cleanEmail });
            if (existing) {
                throw ApiError_1.ApiError.conflict('An account with this email already exists');
            }
            const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
            const user = await User_1.User.create({
                fullName: input.fullName,
                email: cleanEmail,
                passwordHash,
                role: roles_1.ROLES.CLIENT,
            });
            const tokens = issueTokens(user.id, user.role);
            return { user, ...tokens };
        }
        catch (err) {
            if (err instanceof ApiError_1.ApiError)
                throw err;
            // Memory fallback for preview
            const passwordHash = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
            const newId = Object.keys(FALLBACK_USERS).length + 10;
            FALLBACK_USERS[cleanEmail] = {
                id: newId,
                passwordHash,
                fullName: input.fullName,
                role: roles_1.ROLES.CLIENT,
                isActive: true,
            };
            const user = {
                id: newId,
                email: cleanEmail,
                fullName: input.fullName,
                role: roles_1.ROLES.CLIENT,
                isActive: true,
            };
            const tokens = issueTokens(newId, roles_1.ROLES.CLIENT);
            return { user, ...tokens };
        }
    },
    async login(input) {
        const cleanEmail = input.email.trim().toLowerCase();
        const ip = input.ip || '0.0.0.0';
        const userAgent = input.userAgent || '';
        // Brute-force lockout verification
        const lockoutStatus = securityService_1.securityService.isLockedOut(cleanEmail);
        if (lockoutStatus.locked) {
            await securityService_1.securityService.logSecurityEvent('BRUTE_FORCE_BLOCKED', ip, cleanEmail, userAgent, `Attempt while locked out. ${lockoutStatus.remainingMinutes}m remaining.`);
            throw ApiError_1.ApiError.forbidden(`Account temporarily locked due to excessive failed attempts. Please try again in ${lockoutStatus.remainingMinutes} minutes.`);
        }
        // 1. MySQL Mode (Primary for Hostinger)
        if ((0, mysql_1.isMySQLActive)()) {
            const rows = await (0, mysql_1.query)('SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
            if (!rows || rows.length === 0) {
                await securityService_1.securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent);
                throw ApiError_1.ApiError.unauthorized('Invalid email or password');
            }
            const userRow = rows[0];
            if (!userRow.is_active) {
                throw ApiError_1.ApiError.forbidden('This account has been deactivated. Please contact ORBIT-I support.');
            }
            const isValid = await bcryptjs_1.default.compare(input.password, userRow.password_hash);
            if (!isValid) {
                const newlyLocked = await securityService_1.securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent);
                if (newlyLocked) {
                    throw ApiError_1.ApiError.forbidden('Too many failed attempts. For your security, this account is temporarily locked for 15 minutes.');
                }
                throw ApiError_1.ApiError.unauthorized('Invalid email or password');
            }
            await securityService_1.securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent);
            const user = {
                id: userRow.id,
                email: userRow.email,
                fullName: userRow.full_name,
                role: userRow.role,
                isActive: Boolean(userRow.is_active),
            };
            const tokens = issueTokens(user.id, user.role);
            return { user, ...tokens };
        }
        // 2. Mongoose or Memory Fallback
        try {
            const mongoUser = await User_1.User.findOne({ email: cleanEmail }).select('+passwordHash');
            if (mongoUser) {
                if (!mongoUser.isActive) {
                    throw ApiError_1.ApiError.forbidden('This account has been deactivated. Contact support for help.');
                }
                const isValid = await mongoUser.comparePassword(input.password);
                if (!isValid) {
                    await securityService_1.securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent);
                    throw ApiError_1.ApiError.unauthorized('Invalid email or password');
                }
                await securityService_1.securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent);
                const tokens = issueTokens(mongoUser.id, mongoUser.role);
                return { user: mongoUser, ...tokens };
            }
        }
        catch {
            // ignore mongo error and proceed to memory
        }
        // Check Fallback Memory Accounts for local testing
        const memUser = FALLBACK_USERS[cleanEmail];
        if (memUser) {
            // For demo accounts, accept standard passwords
            const demoMatches = (cleanEmail === 'superadmin@orbit-i.com' && input.password === 'SuperAdmin@2026!') ||
                (cleanEmail === 'admin@orbit-i.com' && input.password === 'AdminPass@2026!') ||
                (cleanEmail === 'client@orbit-i.com' && input.password === 'ClientPass@2026!');
            if (!demoMatches) {
                const isBcryptValid = await bcryptjs_1.default.compare(input.password, memUser.passwordHash).catch(() => false);
                if (!isBcryptValid) {
                    await securityService_1.securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent);
                    throw ApiError_1.ApiError.unauthorized('Invalid email or password');
                }
            }
            await securityService_1.securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent);
            const user = {
                id: memUser.id,
                email: cleanEmail,
                fullName: memUser.fullName,
                role: memUser.role,
                isActive: memUser.isActive,
            };
            const tokens = issueTokens(memUser.id, memUser.role);
            return { user, ...tokens };
        }
        await securityService_1.securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent);
        throw ApiError_1.ApiError.unauthorized('Invalid email or password');
    },
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError_1.ApiError.unauthorized('No refresh token provided');
        }
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw ApiError_1.ApiError.unauthorized('Invalid or expired session');
        }
        const userId = payload.sub;
        const userRole = payload.role;
        if ((0, mysql_1.isMySQLActive)()) {
            const rows = await (0, mysql_1.query)('SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1', [userId]);
            if (!rows || rows.length === 0 || !rows[0].is_active) {
                throw ApiError_1.ApiError.unauthorized('Session is no longer valid');
            }
            return issueTokens(rows[0].id, rows[0].role);
        }
        return issueTokens(userId, userRole);
    },
    async forgotPassword(email) {
        const cleanEmail = email.trim().toLowerCase();
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        console.log(`[authService] Password reset token generated for ${cleanEmail}: ${resetToken}`);
    },
    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw ApiError_1.ApiError.badRequest('Invalid reset request');
        }
    },
};
//# sourceMappingURL=authService.js.map