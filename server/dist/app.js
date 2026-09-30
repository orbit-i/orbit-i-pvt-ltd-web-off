"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const rateLimiter_1 = require("./middleware/rateLimiter");
const validate_1 = require("./middleware/validate");
const errorHandler_1 = require("./middleware/errorHandler");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// --- Security & core middleware -------------------------------------------------
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://res.cloudinary.com', 'https://*.orbit-i.tech'],
            connectSrc: ["'self'", 'http://localhost:*', 'https://orbit-i.tech', 'https://api.stripe.com'],
            frameAncestors: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use((0, cors_1.default)({
    origin: [env_1.env.clientUrl, env_1.env.publicSiteUrl, 'https://orbit-i.tech', 'http://localhost:5173'],
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(rateLimiter_1.apiRateLimiter);
if (!env_1.env.isProduction) {
    app.use((0, morgan_1.default)('dev'));
}
// --- Routes -----------------------------------------------------------------------
app.use('/api/v1', index_1.default);
// --- 404 + error handling ----------------------------------------------------------
app.use(validate_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map