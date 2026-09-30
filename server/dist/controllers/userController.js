"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("../services/userService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.userController = {
    me: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const user = await userService_1.userService.getById(req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Profile fetched', user);
    }),
    updateMe: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const user = await userService_1.userService.updateProfile(req.user.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Profile updated', user);
    }),
    listClients: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { search, page, limit } = req.query;
        const result = await userService_1.userService.listClients({
            search: search,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Clients fetched', result);
    }),
    setActiveStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await userService_1.userService.setActiveStatus(req.params.id, req.body.isActive);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Client status updated', user);
    }),
    listSeoManagers: (0, asyncHandler_1.asyncHandler)(async (_req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'SEO managers fetched', await userService_1.userService.listSeoManagers())),
    deleteSeoManager: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await userService_1.userService.deleteSeoManager(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'SEO manager deleted', null);
    }),
    createEditor: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 201, 'Editor account created', await userService_1.userService.createEditor(req.body))),
    createSeoManager: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 201, 'SEO Manager account created', await userService_1.userService.createSeoManager(req.body))),
};
//# sourceMappingURL=userController.js.map