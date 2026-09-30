"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = exports.contactRoutes = void 0;
const express_1 = require("express");
const contactAndCareersController_1 = require("../controllers/contactAndCareersController");
const contentController_1 = require("../controllers/contentController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const catalogValidators_1 = require("../validators/catalogValidators");
const roles_1 = require("../constants/roles");
exports.contactRoutes = (0, express_1.Router)();
exports.contactRoutes.post('/', rateLimiter_1.publicWriteRateLimiter, (0, validate_1.validateBody)(catalogValidators_1.contactMessageSchema), contactAndCareersController_1.contactController.submit);
exports.contactRoutes.get('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.contactController.list);
exports.contactRoutes.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.contactController.updateStatus);
exports.adminRoutes = (0, express_1.Router)();
exports.adminRoutes.get('/dashboard', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contentController_1.adminDashboardController.getMetrics);
exports.adminRoutes.get('/cms-dashboard', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.SEO_CONTENT_ROLES), contentController_1.adminDashboardController.getCmsMetrics);
//# sourceMappingURL=miscRoutes.js.map