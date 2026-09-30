"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.validateBody = validateBody;
const ApiError_1 = require("../utils/ApiError");
function notFoundHandler(req, _res, next) {
    next(ApiError_1.ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
/**
 * Validates req.body against a Zod schema and replaces it with the parsed
 * (typed, defaulted) result. On failure, forwards a 400 with per-field
 * messages via the standard error envelope.
 */
function validateBody(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = {};
            for (const issue of result.error.issues) {
                errors[issue.path.join('.') || 'body'] = issue.message;
            }
            return next(ApiError_1.ApiError.badRequest('Validation failed', errors));
        }
        req.body = result.data;
        return next();
    };
}
//# sourceMappingURL=validate.js.map