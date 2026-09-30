"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const productService_1 = require("../services/productService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
exports.productController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { search, category, status, page, limit } = req.query;
        const result = await productService_1.productService.list({
            search: search,
            category: category,
            status: status,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Products fetched', result);
    }),
    getBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await productService_1.productService.getBySlug(req.params.slug);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Product fetched', product);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await productService_1.productService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Product created', product);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await productService_1.productService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Product updated', product);
    }),
    archive: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const product = await productService_1.productService.archive(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Product archived', product);
    }),
};
//# sourceMappingURL=productController.js.map