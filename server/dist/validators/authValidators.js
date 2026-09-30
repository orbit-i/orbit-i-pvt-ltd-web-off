"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSeoManagerSchema = exports.createEditorSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2, 'Full name must be at least 2 characters').max(120),
    email: zod_1.z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email('Enter a valid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email('Enter a valid email address'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
});
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2).max(120).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
});
exports.createEditorSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2).max(120),
    email: zod_1.z.string().trim().toLowerCase().email(),
    password: zod_1.z.string().min(8),
});
exports.createSeoManagerSchema = exports.createEditorSchema;
//# sourceMappingURL=authValidators.js.map