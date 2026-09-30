"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careersController = exports.contactController = void 0;
const contactAndCareersService_1 = require("../services/contactAndCareersService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
exports.contactController = {
    submit: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await contactAndCareersService_1.contactService.submit(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, "Message sent — we'll be in touch within one business day", null);
    }),
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { status, page, limit } = req.query;
        const result = await contactAndCareersService_1.contactService.list({
            status: status,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Messages fetched', result);
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const message = await contactAndCareersService_1.contactService.updateStatus(req.params.id, req.body.status);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Status updated', message);
    }),
};
exports.careersController = {
    listOpenJobs: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const jobs = await contactAndCareersService_1.careersService.listOpenJobs();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Jobs fetched', jobs);
    }),
    getJobBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const job = await contactAndCareersService_1.careersService.getJobBySlug(req.params.slug);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Job fetched', job);
    }),
    listAllJobs: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const jobs = await contactAndCareersService_1.careersService.listAllJobs();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Jobs fetched', jobs);
    }),
    createJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const job = await contactAndCareersService_1.careersService.createJob(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Job posted', job);
    }),
    updateJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const job = await contactAndCareersService_1.careersService.updateJob(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Job updated', job);
    }),
    closeJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const job = await contactAndCareersService_1.careersService.closeJob(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Job closed', job);
    }),
    submitApplication: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const application = await contactAndCareersService_1.careersService.submitApplication(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Application submitted successfully', application);
    }),
    listApplications: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { jobId, status } = req.query;
        const applications = await contactAndCareersService_1.careersService.listApplications({
            jobId: jobId,
            status: status,
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Applications fetched', applications);
    }),
    updateApplicationStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const application = await contactAndCareersService_1.careersService.updateApplicationStatus(req.params.id, req.body.status);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Application status updated', application);
    }),
};
//# sourceMappingURL=contactAndCareersController.js.map