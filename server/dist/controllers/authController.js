"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const cookies_1 = require("../utils/cookies");
exports.authController = {
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService_1.authService.register(req.body);
        (0, cookies_1.setRefreshTokenCookie)(res, refreshToken);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Account created successfully', { user, accessToken });
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { user, accessToken, refreshToken } = await authService_1.authService.login(req.body);
        (0, cookies_1.setRefreshTokenCookie)(res, refreshToken);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Logged in successfully', { user, accessToken });
    }),
    refresh: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const incomingToken = req.cookies?.[(0, cookies_1.getRefreshTokenCookieName)()];
        const { accessToken, refreshToken } = await authService_1.authService.refresh(incomingToken);
        (0, cookies_1.setRefreshTokenCookie)(res, refreshToken);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Session refreshed', { accessToken });
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        (0, cookies_1.clearRefreshTokenCookie)(res);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Logged out successfully', null);
    }),
    forgotPassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await authService_1.authService.forgotPassword(req.body.email);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'If an account exists for that email, a reset link has been sent', null);
    }),
    resetPassword: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await authService_1.authService.resetPassword(req.body.token, req.body.password);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Password updated successfully', null);
    }),
};
//# sourceMappingURL=authController.js.map