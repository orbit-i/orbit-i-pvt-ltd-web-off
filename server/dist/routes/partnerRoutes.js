"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partnerService_1 = require("../services/partnerService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public endpoints
router.get('/', async (_req, res, next) => {
    try {
        const list = await partnerService_1.partnerService.list();
        res.json({ success: true, message: 'Partners retrieved successfully', data: list });
    }
    catch (error) {
        next(error);
    }
});
router.get('/featured', async (_req, res, next) => {
    try {
        const list = await partnerService_1.partnerService.listFeatured();
        res.json({ success: true, message: 'Featured partners retrieved successfully', data: list });
    }
    catch (error) {
        next(error);
    }
});
// Admin endpoints
router.get('/admin/list', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (_req, res, next) => {
    try {
        const list = await partnerService_1.partnerService.list();
        res.json({ success: true, message: 'All partners retrieved', data: list });
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/create', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const { name, logoUrl, websiteUrl, category, description, orderIndex, isFeatured } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Partner name is required' });
        }
        const created = await partnerService_1.partnerService.create({ name, logoUrl, websiteUrl, category, description, orderIndex, isFeatured });
        res.status(201).json({ success: true, message: 'Partner created successfully', data: created });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const updated = await partnerService_1.partnerService.update(id, req.body);
        res.json({ success: true, message: 'Partner updated successfully', data: updated });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        await partnerService_1.partnerService.remove(id);
        res.json({ success: true, message: 'Partner removed successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=partnerRoutes.js.map