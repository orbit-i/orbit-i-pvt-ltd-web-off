"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const projectService_1 = require("../services/projectService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.projectController = {
    listMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const projects = await projectService_1.projectService.listForClient(req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Projects fetched', projects);
    }),
    getMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        const project = await projectService_1.projectService.getForClient(req.params.id, req.user.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Project fetched', project);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { clientId, status } = req.query;
        const projects = await projectService_1.projectService.listAll({
            clientId: clientId,
            status: status,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Projects fetched', projects);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const project = await projectService_1.projectService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Project created', project);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const project = await projectService_1.projectService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Project updated', project);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await projectService_1.projectService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Project deleted', null);
    }),
    addMilestone: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const project = await projectService_1.projectService.addMilestone(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Milestone added', project);
    }),
    toggleMilestone: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const project = await projectService_1.projectService.toggleMilestone(req.params.id, req.params.milestoneId, req.body.isComplete);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Milestone updated', project);
    }),
    postUpdate: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const project = await projectService_1.projectService.postUpdate(req.params.id, req.body.message);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Update posted', project);
    }),
};
//# sourceMappingURL=projectController.js.map