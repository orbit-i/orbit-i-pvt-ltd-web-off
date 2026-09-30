"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
/**
 * Verifies the Bearer access token and attaches { id, role } to req.user.
 * This is the server-side authorization boundary — the frontend's route
 * guards are UX only and must never be relied on for real security.
 */
function authenticate(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return next(ApiError_1.ApiError.unauthorized('Authentication required'));
    }
    const token = header.slice('Bearer '.length);
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    }
    catch {
        return next(ApiError_1.ApiError.unauthorized('Invalid or expired session'));
    }
}
/** Restricts a route to specific roles. Must run after `authenticate`. */
function authorize(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(ApiError_1.ApiError.unauthorized('Authentication required'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(ApiError_1.ApiError.forbidden('You do not have permission to perform this action'));
        }
        return next();
    };
}
//# sourceMappingURL=auth.js.map