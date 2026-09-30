"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const mongoose_1 = require("mongoose");
const multer_1 = require("multer");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
/**
 * Must be registered last, after all routes. Normalizes every thrown error
 * (ApiError, Mongoose validation/cast errors, JWT errors, duplicate-key
 * errors, or anything unexpected) into { success: false, message, errors }.
 */
function errorHandler(err, _req, res, _next) {
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors });
    }
    if (err instanceof mongoose_1.MongooseError && err.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: extractMongooseErrors(err) });
    }
    if (err instanceof multer_1.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2MB or smaller' : err.message;
        return res.status(400).json({ success: false, message });
    }
    const mongoErr = err;
    if (mongoErr?.code === 11000) {
        const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
        return res.status(409).json({
            success: false,
            message: `A record with this ${field} already exists`,
            errors: { [field]: 'Already in use' },
        });
    }
    if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }
    console.error('[unhandled error]', err);
    return res.status(500).json({
        success: false,
        message: env_1.env.isProduction ? 'Something went wrong. Please try again.' : err?.message || 'Unknown error',
    });
}
function extractMongooseErrors(err) {
    const errors = {};
    const mongooseErr = err;
    if (mongooseErr.errors) {
        for (const [key, value] of Object.entries(mongooseErr.errors)) {
            errors[key] = value.message;
        }
    }
    return errors;
}
//# sourceMappingURL=errorHandler.js.map