"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const internService_1 = require("../services/internService");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public verification endpoint (supports slashes e.g. /verify/ORBIT-I/INT/2026/01 and query param /verify?id=...)
router.get(/^\/verify(?:\/(.*))?$/, async (req, res, next) => {
    try {
        const rawParam = req.params[0] || req.query.certificateId || req.query.id || '';
        const certificateId = decodeURIComponent(String(rawParam)).trim();
        const intern = await internService_1.internService.verifyByCertificateId(certificateId);
        if (!intern) {
            return res.status(404).json({
                success: false,
                message: `No intern or certificate record found for identifier: ${certificateId}`,
                data: null,
            });
        }
        return res.json({
            success: true,
            message: 'Certificate successfully verified against ORBIT-I registry',
            data: {
                ...intern,
                isAuthentic: intern.certificateStatus === 'valid',
                issuer: 'ORBIT-I Private Limited',
                officialWebsite: 'https://orbit-i.tech/',
                contact: '+92 3190375751',
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Admin endpoints
router.get('/admin/list', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const { search, status } = req.query;
        const list = await internService_1.internService.list(search, status);
        res.json({ success: true, message: 'Interns retrieved successfully', data: list });
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/create', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const { certificateId, fullName, email, phone, department, role, startDate, endDate, duration, completionStatus, certificateStatus, gradePerformance, issueDate, remarks } = req.body;
        if (!certificateId || !fullName || !email || !department || !role || !startDate || !endDate || !issueDate) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const created = await internService_1.internService.create({
            certificateId,
            fullName,
            email,
            phone,
            department,
            role,
            startDate,
            endDate,
            duration: duration || '3 Months',
            completionStatus: completionStatus || 'completed',
            certificateStatus: certificateStatus || 'valid',
            gradePerformance: gradePerformance || 'A+',
            issueDate,
            remarks,
        });
        res.status(201).json({ success: true, message: 'Intern record created successfully', data: created });
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const updated = await internService_1.internService.update(id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Intern record not found' });
        }
        res.json({ success: true, message: 'Intern record updated successfully', data: updated });
    }
    catch (error) {
        next(error);
    }
});
router.delete('/admin/:id', auth_1.authenticate, (0, auth_1.authorize)('super_admin', 'admin'), async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const deleted = await internService_1.internService.delete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Intern record not found' });
        }
        res.json({ success: true, message: 'Intern record deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/export-csv', auth_1.authenticate, (0, auth_1.authorize)('admin', 'super_admin'), async (_req, res, next) => {
    try {
        const list = await internService_1.internService.list();
        const headers = [
            'Certificate ID',
            'Full Name',
            'Email',
            'Phone',
            'Department',
            'Role',
            'Start Date',
            'End Date',
            'Duration',
            'Completion Status',
            'Certificate Status',
            'Grade',
            'Verification Code',
            'Issue Date',
        ];
        const csvRows = [headers.join(',')];
        for (const item of list) {
            const row = [
                `"${item.certificateId}"`,
                `"${item.fullName}"`,
                `"${item.email}"`,
                `"${item.phone || ''}"`,
                `"${item.department}"`,
                `"${item.role}"`,
                `"${item.startDate}"`,
                `"${item.endDate}"`,
                `"${item.duration}"`,
                `"${item.completionStatus}"`,
                `"${item.certificateStatus}"`,
                `"${item.gradePerformance || ''}"`,
                `"${item.verificationCode}"`,
                `"${item.issueDate}"`,
            ];
            csvRows.push(row.join(','));
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orbit-i-interns-${Date.now()}.csv`);
        res.status(200).send(csvRows.join('\n'));
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=internRoutes.js.map