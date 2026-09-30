"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 5000),
    mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/orbit-i'),
    jwtSecret: required('JWT_SECRET', 'dev-only-access-secret-change-me'),
    jwtRefreshSecret: required('JWT_REFRESH_SECRET', 'dev-only-refresh-secret-change-me'),
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
    publicSiteUrl: process.env.PUBLIC_SITE_URL ?? process.env.CLIENT_URL ?? 'http://localhost:5173',
    cloudinaryCloudName: required('CLOUDINARY_CLOUD_NAME'),
    cloudinaryApiKey: required('CLOUDINARY_API_KEY'),
    cloudinaryApiSecret: required('CLOUDINARY_API_SECRET'),
    isProduction: process.env.NODE_ENV === 'production',
};
//# sourceMappingURL=env.js.map