"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityService = void 0;
const mysql_1 = require("../config/mysql");
const failedLogins = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
exports.securityService = {
    /**
     * Checks if an IP or email is currently locked out due to brute-force attempts
     */
    isLockedOut(key) {
        const record = failedLogins.get(key);
        if (!record)
            return { locked: false, remainingMinutes: 0 };
        const now = Date.now();
        if (record.lockUntil > now) {
            const remainingMs = record.lockUntil - now;
            return { locked: true, remainingMinutes: Math.ceil(remainingMs / 60000) };
        }
        // Reset if lockout window has expired
        if (now - record.firstAttempt > LOCKOUT_DURATION_MS && record.count < MAX_FAILED_ATTEMPTS) {
            failedLogins.delete(key);
        }
        return { locked: false, remainingMinutes: 0 };
    },
    /**
     * Registers a failed authentication attempt and locks out when threshold is reached
     */
    async recordFailedAttempt(key, ip, email, userAgent) {
        const now = Date.now();
        let record = failedLogins.get(key);
        if (!record || now - record.firstAttempt > LOCKOUT_DURATION_MS) {
            record = { count: 1, firstAttempt: now, lockUntil: 0 };
        }
        else {
            record.count += 1;
        }
        let newlyLocked = false;
        if (record.count >= MAX_FAILED_ATTEMPTS) {
            record.lockUntil = now + LOCKOUT_DURATION_MS;
            newlyLocked = true;
            await this.logSecurityEvent('BRUTE_FORCE_LOCKOUT', ip, email, userAgent, `Locked out after ${record.count} failed login attempts`);
        }
        else {
            await this.logSecurityEvent('LOGIN_FAILURE', ip, email, userAgent, `Failed login attempt #${record.count}`);
        }
        failedLogins.set(key, record);
        return newlyLocked;
    },
    /**
     * Clears failed attempt tracking upon successful authentication
     */
    async recordSuccessfulLogin(key, ip, email, userAgent) {
        failedLogins.delete(key);
        await this.logSecurityEvent('LOGIN_SUCCESS', ip, email, userAgent, 'Successful credential verification');
    },
    /**
     * Logs a security audit event to MySQL security_audit_logs table
     */
    async logSecurityEvent(eventType, ip, email, userAgent, details) {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)(`INSERT INTO security_audit_logs (event_type, ip_address, user_email, user_agent, details)
           VALUES (?, ?, ?, ?, ?)`, [eventType, ip || '0.0.0.0', email || null, userAgent ? userAgent.substring(0, 500) : null, details || null]);
            }
            catch (err) {
                console.warn('[securityService] Failed to write security audit log:', err);
            }
        }
        else {
            console.log(`[security-audit] [${eventType}] IP: ${ip} | User: ${email || 'anonymous'} | ${details || ''}`);
        }
    },
    /**
     * Verifies buffer magic bytes to ensure file content actually matches permitted MIME types
     * and is not an executable/malware/ransomware disguised with a deceptive extension
     */
    validateFileMagicBytes(buffer, mimetype) {
        if (!buffer || buffer.length < 4)
            return false;
        // JPEG: FF D8 FF
        if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
            return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        }
        // PNG: 89 50 4E 47
        if (mimetype === 'image/png') {
            return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
        }
        // WEBP: "RIFF" (52 49 46 46) and "WEBP" at byte 8
        if (mimetype === 'image/webp') {
            if (buffer.length < 12)
                return false;
            const riff = buffer.toString('ascii', 0, 4);
            const webp = buffer.toString('ascii', 8, 12);
            return riff === 'RIFF' && webp === 'WEBP';
        }
        // PDF: "%PDF-" (25 50 44 46 2D)
        if (mimetype === 'application/pdf') {
            return buffer.toString('ascii', 0, 5) === '%PDF-';
        }
        return false;
    },
    /**
     * Sanitizes rich text HTML content from text editors to prevent Cross-Site Scripting (XSS)
     */
    sanitizeHtml(dirtyHtml) {
        if (!dirtyHtml)
            return '';
        return dirtyHtml
            // Remove all <script> tags and contents
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Remove inline event handlers like onload=, onerror=, onclick=, etc.
            .replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
            // Disallow javascript: pseudo-protocols
            .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"')
            .replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '')
            // Remove dangerous tags
            .replace(/<\/?(?:applet|bgsound|base|basefont|frame|frameset|iframe(?!.*(?:youtube\.com|vimeo\.com))|layer|object|embed)[^>]*>/gi, '');
    },
};
//# sourceMappingURL=securityService.js.map