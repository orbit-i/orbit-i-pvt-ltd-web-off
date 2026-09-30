"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
/**
 * Sends a response in the app's standard envelope:
 * { success: true, message, data }
 */
function sendSuccess(res, statusCode, message, data) {
    return res.status(statusCode).json({ success: true, message, data });
}
//# sourceMappingURL=ApiResponse.js.map