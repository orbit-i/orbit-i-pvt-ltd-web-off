"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRichText = sanitizeRichText;
exports.slugify = slugify;
/** Conservative HTML sanitization for editor output. */
function sanitizeRichText(value) {
    return value
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<(iframe|object|embed|form|style|base|meta|link)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<(iframe|object|embed|form|style|base|meta|link)[^>]*\/?>/gi, '')
        .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
        .replace(/\s(href|src|action)\s*=\s*(['"])\s*(?:javascript|vbscript|data:text\/html):[^'"]*\2/gi, '')
        .replace(/\s(src|href)\s*=\s*(['"])\s*data:[^'"]*\2/gi, '');
}
function slugify(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
//# sourceMappingURL=sanitize.js.map