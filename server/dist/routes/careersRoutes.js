"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactAndCareersController_1 = require("../controllers/contactAndCareersController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const catalogValidators_1 = require("../validators/catalogValidators");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
// Public: jobs
router.get('/jobs', contactAndCareersController_1.careersController.listOpenJobs);
router.get('/jobs/:slug', contactAndCareersController_1.careersController.getJobBySlug);
// Admin: jobs
router.get('/jobs/admin/all', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.listAllJobs);
router.post('/jobs', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.createJob);
router.patch('/jobs/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.updateJob);
router.patch('/jobs/:id/close', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.closeJob);
// Public: applications
router.post('/applications', rateLimiter_1.publicWriteRateLimiter, (0, validate_1.validateBody)(catalogValidators_1.jobApplicationSchema), contactAndCareersController_1.careersController.submitApplication);
// Admin: applications
router.get('/applications', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.listApplications);
router.patch('/applications/:id/status', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), contactAndCareersController_1.careersController.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=careersRoutes.js.map