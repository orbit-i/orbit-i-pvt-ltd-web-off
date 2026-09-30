"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportController = void 0;
const supportService_1 = require("../services/supportService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.supportController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const ticket = await supportService_1.supportService.create({ userId: req.user.id, subject: req.body.subject, message: req.body.message });
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Support ticket created', ticket);
    }),
    listMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const tickets = await supportService_1.supportService.listForUser(req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Support tickets fetched', tickets);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const tickets = await supportService_1.supportService.listAll({ status: req.query.status });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Support tickets fetched', tickets);
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const ticket = await supportService_1.supportService.updateStatus(req.params.id, req.body.status);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Support ticket updated', ticket);
    }),
};
//# sourceMappingURL=supportController.js.map