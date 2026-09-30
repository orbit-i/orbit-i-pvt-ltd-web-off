"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
// Client
router.get('/mine', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), projectController_1.projectController.listMine);
router.get('/mine/:id', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.CLIENT), projectController_1.projectController.getMine);
// Admin
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.listAll);
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.create);
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.update);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.remove);
router.post('/:id/milestones', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.addMilestone);
router.patch('/:id/milestones/:milestoneId', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.toggleMilestone);
router.post('/:id/updates', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), projectController_1.projectController.postUpdate);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map