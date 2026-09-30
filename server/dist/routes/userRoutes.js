"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const authValidators_1 = require("../validators/authValidators");
const roles_1 = require("../constants/roles");
const router = (0, express_1.Router)();
router.get('/me', auth_1.authenticate, userController_1.userController.me);
router.patch('/me', auth_1.authenticate, (0, validate_1.validateBody)(authValidators_1.updateProfileSchema), userController_1.userController.updateMe);
router.get('/', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), userController_1.userController.listClients);
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), userController_1.userController.setActiveStatus);
router.post('/editors', auth_1.authenticate, (0, auth_1.authorize)(roles_1.ROLES.SUPER_ADMIN), (0, validate_1.validateBody)(authValidators_1.createEditorSchema), userController_1.userController.createEditor);
router.post('/seo-managers', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), (0, validate_1.validateBody)(authValidators_1.createSeoManagerSchema), userController_1.userController.createSeoManager);
router.get('/seo-managers', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), userController_1.userController.listSeoManagers);
router.delete('/seo-managers/:id', auth_1.authenticate, (0, auth_1.authorize)(...roles_1.ADMIN_ROLES), userController_1.userController.deleteSeoManager);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map