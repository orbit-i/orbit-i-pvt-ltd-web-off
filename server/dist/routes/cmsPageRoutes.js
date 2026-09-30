"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cmsPageService_1 = require("../services/cmsPageService");
const securityService_1 = require("../services/securityService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public endpoints
router.get('/', async (_req, res, next) => {
    try {
        const list = await cmsPageService_1.cmsPageService.list();
        res.json({ success: true, message: 'CMS pages fetched', data: list });
    }
    catch (error) {
        next(error);
    }
});
router.get('/:slug', async (req, res, next) => {
    try {
        const slug = String(req.params.slug);
        const page = await cmsPageService_1.cmsPageService.getBySlug(slug);
        if (!page) {
            return res.status(404).json({ success: false, message: 'Page not found', data: null });
        }
        res.json({ success: true, message: 'CMS page fetched', data: page });
    }
    catch (error) {
        next(error);
    }
});
// Admin endpoints
router.get('/admin/list', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin', 'editor', 'seo_manager'), async (_req, res, next) => {
    try {
        const list = await cmsPageService_1.cmsPageService.listAll();
        res.json({ success: true, message: 'All CMS pages fetched', data: list });
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/create', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin', 'editor', 'seo_manager'), async (req, res, next) => {
    try {
        const { title, slug, contentHtml, excerpt, status, metaTitle, metaDescription, keywords, schemaType } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Page title is required' });
        }
        const cleanHtml = securityService_1.securityService.sanitizeHtml(contentHtml || '');
        const created = await cmsPageService_1.cmsPageService.create({
            title,
            slug,
            contentHtml: cleanHtml,
            excerpt,
            status: status || 'draft',
            metaTitle,
            metaDescription,
            keywords,
            schemaType,
        });
        res.status(201).json({ success: true, message: 'CMS page created successfully', data: created });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin', 'editor', 'seo_manager'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        if (req.body.contentHtml) {
            req.body.contentHtml = securityService_1.securityService.sanitizeHtml(req.body.contentHtml);
        }
        const updated = await cmsPageService_1.cmsPageService.update(id, req.body);
        res.json({ success: true, message: 'CMS page updated successfully', data: updated });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        await cmsPageService_1.cmsPageService.remove(id);
        res.json({ success: true, message: 'CMS page removed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=cmsPageRoutes.js.map