"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenCookie = setRefreshTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
exports.getRefreshTokenCookieName = getRefreshTokenCookieName;
const env_1 = require("../config/env");
const REFRESH_COOKIE_NAME = 'orbit_refresh_token';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
function setRefreshTokenCookie(res, token) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env_1.env.isProduction,
        sameSite: env_1.env.isProduction ? 'strict' : 'lax',
        maxAge: THIRTY_DAYS_MS,
        path: '/api/v1/auth',
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });
}
function getRefreshTokenCookieName() {
    return REFRESH_COOKIE_NAME;
}
//# sourceMappingURL=cookies.js.map