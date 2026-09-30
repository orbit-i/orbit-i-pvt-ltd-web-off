"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostController = exports.teamController = exports.adminDashboardController = exports.testimonialController = exports.caseStudyController = exports.serviceController = void 0;
const contentServices_1 = require("../services/contentServices");
const teamService_1 = require("../services/teamService");
const adminDashboardService_1 = require("../services/adminDashboardService");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
exports.serviceController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const services = await contentServices_1.serviceContentService.list();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Services fetched', services);
    }),
    getBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await contentServices_1.serviceContentService.getBySlug(req.params.slug);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Service fetched', service);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await contentServices_1.serviceContentService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Service created', service);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const service = await contentServices_1.serviceContentService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Service updated', service);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await contentServices_1.serviceContentService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Service deleted', null);
    }),
};
exports.caseStudyController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const items = await contentServices_1.caseStudyService.list();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Case studies fetched', items);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const items = await contentServices_1.caseStudyService.listAll();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Case studies fetched', items);
    }),
    getBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await contentServices_1.caseStudyService.getBySlug(req.params.slug);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Case study fetched', item);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await contentServices_1.caseStudyService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Case study created', item);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await contentServices_1.caseStudyService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Case study updated', item);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await contentServices_1.caseStudyService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Case study deleted', null);
    }),
};
exports.testimonialController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const items = await contentServices_1.testimonialService.list();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Testimonials fetched', items);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const items = await contentServices_1.testimonialService.listAll();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Testimonials fetched', items);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await contentServices_1.testimonialService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Testimonial created', item);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const item = await contentServices_1.testimonialService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Testimonial updated', item);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await contentServices_1.testimonialService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Testimonial deleted', null);
    }),
};
exports.adminDashboardController = {
    getMetrics: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const metrics = await adminDashboardService_1.adminDashboardService.getMetrics();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Metrics fetched', metrics);
    }),
    getCmsMetrics: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const metrics = await adminDashboardService_1.adminDashboardService.getCmsMetrics();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'CMS metrics fetched', metrics);
    }),
};
exports.teamController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const members = await teamService_1.teamService.list();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Team members fetched', members);
    }),
    listAll: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const members = await teamService_1.teamService.listAll();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Team members fetched', members);
    }),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const member = await teamService_1.teamService.create(req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Team member added', member);
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const member = await teamService_1.teamService.update(req.params.id, req.body);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Team member updated', member);
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await teamService_1.teamService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Team member removed', null);
    }),
};
exports.blogPostController = {
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await contentServices_1.blogPostService.list({
            category: req.query.category,
            tag: req.query.tag,
            search: req.query.search,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            includeDrafts: Boolean(req.user),
        });
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog posts fetched', result);
    }),
    getBySlug: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog post fetched', await contentServices_1.blogPostService.getBySlug(req.params.slug, Boolean(req.user)))),
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Blog post created', await contentServices_1.blogPostService.create(req.body, req.user.id));
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog post updated', await contentServices_1.blogPostService.update(req.params.id, req.body, req.user?.id))),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await contentServices_1.blogPostService.remove(req.params.id);
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog post deleted', null);
    }),
    publish: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog post published', await contentServices_1.blogPostService.setPublished(req.params.id, true))),
    unpublish: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Blog post unpublished', await contentServices_1.blogPostService.setPublished(req.params.id, false))),
    duplicate: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        return (0, ApiResponse_1.sendSuccess)(res, 201, 'Blog post duplicated', await contentServices_1.blogPostService.duplicate(req.params.id, req.user.id));
    }),
    revisions: (0, asyncHandler_1.asyncHandler)(async (req, res) => (0, ApiResponse_1.sendSuccess)(res, 200, 'Revisions fetched', await contentServices_1.blogPostService.revisions(req.params.id))),
    restoreRevision: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw ApiError_1.ApiError.unauthorized();
        return (0, ApiResponse_1.sendSuccess)(res, 200, 'Revision restored', await contentServices_1.blogPostService.restoreRevision(req.params.id, req.params.revisionId, req.user.id));
    }),
};
//# sourceMappingURL=contentController.js.map