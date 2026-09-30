"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const Project_1 = require("../models/Project");
const ApiError_1 = require("../utils/ApiError");
exports.projectService = {
    async listForClient(clientId) {
        return Project_1.Project.find({ client: clientId }).sort({ createdAt: -1 });
    },
    async getForClient(projectId, clientId) {
        const project = await Project_1.Project.findOne({ _id: projectId, client: clientId });
        if (!project)
            throw ApiError_1.ApiError.notFound('Project not found');
        return project;
    },
    async listAll(query) {
        const filter = {};
        if (query.clientId)
            filter.client = query.clientId;
        if (query.status)
            filter.status = query.status;
        return Project_1.Project.find(filter).populate('client', 'fullName email').sort({ createdAt: -1 });
    },
    async create(data) {
        return Project_1.Project.create(data);
    },
    async update(id, data) {
        const project = await Project_1.Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (!project)
            throw ApiError_1.ApiError.notFound('Project not found');
        return project;
    },
    async remove(id) {
        const project = await Project_1.Project.findByIdAndDelete(id);
        if (!project)
            throw ApiError_1.ApiError.notFound('Project not found');
    },
    async addMilestone(id, milestone) {
        const project = await Project_1.Project.findByIdAndUpdate(id, { $push: { milestones: milestone } }, { new: true, runValidators: true });
        if (!project)
            throw ApiError_1.ApiError.notFound('Project not found');
        return project;
    },
    async toggleMilestone(projectId, milestoneId, isComplete) {
        const project = await Project_1.Project.findOneAndUpdate({ _id: projectId, 'milestones._id': milestoneId }, { $set: { 'milestones.$.isComplete': isComplete } }, { new: true });
        if (!project)
            throw ApiError_1.ApiError.notFound('Project or milestone not found');
        return project;
    },
    async postUpdate(id, message) {
        const project = await Project_1.Project.findByIdAndUpdate(id, { $push: { updates: { message, postedAt: new Date() } } }, { new: true });
        if (!project)
            throw ApiError_1.ApiError.notFound('Project not found');
        return project;
    },
};
//# sourceMappingURL=projectService.js.map