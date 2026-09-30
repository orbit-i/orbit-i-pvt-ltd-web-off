"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.uploadSecure = void 0;
const multer_1 = __importDefault(require("multer"));
const ApiError_1 = require("../utils/ApiError");
const securityService_1 = require("../services/securityService");
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.bash', '.php', '.phtml', '.php3', '.php4', '.php5',
    '.js', '.vbs', '.scr', '.jar', '.apk', '.msi', '.com', '.ps1', '.hta', '.dll'
];
const storage = multer_1.default.memoryStorage();
exports.uploadSecure = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit prevents memory exhaustion attacks
        files: 1,
    },
    fileFilter: (req, file, callback) => {
        const rawName = file.originalname.toLowerCase();
        // 1. Block dangerous or double extensions
        const hasDangerousExtension = DANGEROUS_EXTENSIONS.some((ext) => rawName.endsWith(ext) || rawName.includes(ext + '.'));
        if (hasDangerousExtension) {
            securityService_1.securityService.logSecurityEvent('FILE_REJECTED_DANGEROUS_EXT', req.ip || '0.0.0.0', undefined, req.headers['user-agent'], `Blocked attempt to upload file: ${file.originalname}`);
            return callback(ApiError_1.ApiError.badRequest('File type rejected by corporate security policy.'));
        }
        // 2. MIME type verification
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(ApiError_1.ApiError.badRequest('Only JPEG, PNG, WebP images and PDF documents are allowed.'));
        }
        callback(null, true);
    },
});
exports.uploadImage = exports.uploadSecure;
//# sourceMappingURL=upload.js.map