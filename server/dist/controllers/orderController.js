"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const orderService_1 = require("../services/orderService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.orderController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const items = req.body.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
        }));
        const order = await orderService_1.orderService.create({ userId: req.user.id, items });
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Order placed successfully', order);
    }),
    listMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const orders = await orderService_1.orderService.listForUser(req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Orders fetched', orders);
    }),
    getMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const order = await orderService_1.orderService.getForUser(req.params.id, req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Order fetched', order);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { status, page, limit } = req.query;
        const result = await orderService_1.orderService.listAll({
            status: status,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Orders fetched', result);
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const order = await orderService_1.orderService.updateStatus(req.params.id, req.body.status);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Order status updated', order);
    }),
};
//# sourceMappingURL=orderController.js.map